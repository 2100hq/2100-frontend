import React, {
  createContext,
  useContext,
  useMemo,
  useEffect,
  useReducer
} from 'react'
import { get } from 'lodash'
import { useSocketContext } from '../Socket'

import Dispatcher from './dispatcher.js'
import actions from './actions'
import reducer, { initialState } from './reducer'

import config from '../../utils/config'
import Signer from '../../utils/signer'

import { useWeb3Context } from 'web3-react'

import { BN, unlimitedAllowance } from '../../utils'
import Selectors from '../../utils/selectors'

const ethers = require('ethers')

export const StoreContext = createContext()

export function useStoreContext () {
  return useContext(StoreContext)
}

export const StoreContextConsumer = StoreContext.Consumer

function socketUpdate (channel, dispatch) {
  return (path, data) => {
    path.unshift(channel)
    dispatch(actions.update(path, data))
  }
}

let dispatcher

export default function StoreProvider ({ children }) {
  const socket = useSocketContext()
  const web3 = useWeb3Context()
  // state in the StoreProvider is private
  // public state is a combination of private state and selectors.
  // effects in StoreProvider can only access private state
  const [privState, dispatch] = useReducer(reducer, initialState)

  // add config to private state
  useEffect(() => {
    dispatch(actions.update(['config'], config))
  }, [])

  // hook up socket changes to dispatcher/reducer
  useEffect(() => {
    if (socket.network.loading) return
    socket.listen('private', socketUpdate('private', dispatch))
    socket.listen('public', socketUpdate('public', dispatch))
    socket.listen('auth', socketUpdate('auth', dispatch))
    socket.listen('admin', socketUpdate('admin', dispatch))
  }, [socket.network.loading])

  // add network info to private state
  useEffect(() => {
    dispatch(actions.update(['network'], socket.network))
    if (socket.error) {
      dispatch(actions.error(socket.network.error))
    }
  }, [socket.network])

  // add web3 data to private state
  useEffect(() => {
    const hasWallet = Boolean(window.web3 || window.ethereum)
    dispatch(
      actions.update(['web3'], {
        active: web3.active,
        account: web3.account,
        hasWallet
      })
    )
  }, [web3.active, web3.account])

  // add contract with signer to private state
  useEffect(() => {
    if (get(privState, 'config.contracts.dai')) return // already inited dai
    if (!web3.library) return // no library to fetch data from the blockchain
    const signer = web3.account
      ? new Signer(web3.library.getSigner(web3.account))
      : web3.library
    const { Controller, ERC20 } = privState.config.contracts
    const controller = new ethers.Contract(
      Controller.address,
      Controller.abi,
      signer
    )
    controller.DAI().then(address => {
      const dai = new ethers.Contract(address, ERC20.abi, signer)
      dispatch(actions.update(['config', 'contracts'], { controller, dai }))
    })
  }, [web3.library, web3.account])

  // add DAI balance to private state on new blocks and signing in
  useEffect(() => {
    const { dai, controller } = Selectors(privState)
    if (!dai || !dai.contract || !privState.private.isSignedIn) return
    if (dai.wallet.latestBlock === privState.public.latestBlock.number) return
    const requests = []
    requests.push(dai.contract.balanceOf(web3.account))
    if (BN(dai.wallet.allowance || 0).lt(unlimitedAllowance)) {
      requests.push(
        dai.contract.allowance(web3.account, controller.contract.address)
      )
    } else {
      requests.push(dai.wallet.allowance)
    }

    Promise.all(requests).then(([balance, allowance]) => {
      console.log('balanceOf', balance.toString(),'allowance', allowance.toString())
      dispatch(
        actions.update(dai.walletPath, {
          balance: balance.toString(),
          allowance: allowance.toString(),
          latestBlock: privState.public.latestBlock.number
        })
      )
    })
  }, [
    privState.public.latestBlock,
    privState.private.isSignedIn,
    privState.config.contracts
  ])

  // combine private state with selectors
  // create a new async dispatcher
  // provide context of all these to children
  const contextValue = useMemo(() => {
    const state = { ...privState, ...Selectors(privState) }
    console.log()
    console.log(state)

    const dispatcher = Dispatcher({ dispatch, socket, web3, state })
    return { dispatch: dispatcher, state, actions }
  }, [privState, socket, web3])

  return (
    <StoreContext.Provider value={contextValue}>
      {children}
    </StoreContext.Provider>
  )
}
