import React, {
  createContext,
  useContext,
  useMemo,
  useEffect,
  useReducer
} from 'react'

import { useSocketContext } from '../Socket'

import Dispatcher, { reducer, initialState, actions } from './dispatcher.js'

import { useWeb3Context } from 'web3-react'

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
  const [state, dispatch] = useReducer(reducer, initialState)
  dispatcher = Dispatcher({ dispatch, socket, web3 })

  useEffect(() => {
    socket.listen('private', socketUpdate('private', dispatcher))
    socket.listen('public', socketUpdate('public', dispatcher))
    socket.listen('auth', socketUpdate('auth', dispatcher))
    socket.listen('admin', socketUpdate('admin', dispatcher))

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

  const contextValue = useMemo(() => {
    return { dispatch: dispatcher, state, actions }
  }, [state, socket, dispatcher])

  return (
    <StoreContext.Provider value={contextValue}>
      {children}
    </StoreContext.Provider>
  )
}
