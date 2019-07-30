import React, {
  createContext,
  useContext,
  useMemo,
  useEffect,
  useReducer
} from 'react'

import { useSocketContext } from '../Socket'

import Dispatcher, { reducer, initialState, actions } from './dispatcher.js'

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
    // Remove this when API stops sending duplicate arrays and objects
    if (data[channel]) data = { ...data, ...data[channel] }
    dispatch(actions.update(path, data))
  }
}

let dispatcher

export default function StoreProvider ({ children }) {
  const socket = useSocketContext()
  const web3 = useWeb3Context()
  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    dispatch(actions.update(['config'], config))
  }, [])
  useEffect(() => {
    socket.listen('private', socketUpdate('private', dispatch))
    socket.listen('public', socketUpdate('public', dispatch))
    socket.listen('auth', socketUpdate('auth', dispatch))
    socket.listen('admin', socketUpdate('admin', dispatch))

    return () => {
      socket.stop('public')
      socket.stop('auth')
      socket.stop('private')
      socket.stop('admin')
    }
  }, [])

  useEffect(() => {
    dispatch(actions.update(['network'], socket.network))
    if (socket.error) {
      dispatch(actions.error(socket.network.error))
    }
  }, [socket.network])

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

  // useEffect(() => {
  //   if (!web3.library) return
  //   web3.library.on('block', blockNumber =>
  //     console.log('New Block: ' + blockNumber)
  //   )
  // }, [web3.library])

  useEffect(() => {
    if (state.contracts || !web3.library) return
    const signer = web3.account
      ? new Signer(web3.library.getSigner(web3.account))
      : web3.library
    const { Controller, ERC20 } = state.config.contracts
    const controller = new ethers.Contract(
      Controller.address,
      Controller.abi,
      signer
    )
    controller.DAI().then(address => {
      const dai = new ethers.Contract(address, ERC20.abi, signer)
      dispatch(actions.update(['contracts'], { controller, dai }))
    })
  }, [web3.library, web3.account])

  useEffect(() => {
    const { dai, controller } = Selectors(state)
    if (!dai.contract || !state.private.isSignedIn) return
    if (dai.wallet.latestBlock === state.public.latestBlock.number) return
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
      dispatch(
        actions.update(dai.walletPath, {
          balance: balance.toString(),
          allowance: allowance.toString(),
          latestBlock: state.public.latestBlock.number
        })
      )
    })
  }, [state.public.latestBlock, state.private.isSignedIn, state.contracts])

  const contextValue = useMemo(() => {
    const dispatcher = Dispatcher({ dispatch, socket, web3, state })
    return { dispatch: dispatcher, state, actions }
  }, [state, socket])

  return (
    <StoreContext.Provider value={contextValue}>
      {children}
    </StoreContext.Provider>
  )
}
