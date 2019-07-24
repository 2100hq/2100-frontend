import React, { useEffect } from 'react'
import { useStoreContext } from '../../contexts/Store'

import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'

export default function Wallet () {
  const { state, dispatch, actions } = useStoreContext()

  const loggingIn = state.intents && state.intents.loggingIn

  const isUnlocked = Boolean(state.web3.active && state.web3.account)
  const isLoggedIn = Boolean(isUnlocked && state.private.me)

  const setLogginIn = val =>
    dispatch(actions.update(['intents', 'loggingIn'], val))

  useEffect(() => {
    if (!loggingIn || isLoggedIn) return
    if (state.error.login) {
      setLogginIn(false)
      return
    }
    if (isLoggedIn && loggingIn) {
      setLogginIn(false)
      return
    }

    const action = isUnlocked ? actions.login() : actions.unlockWallet()

    dispatch(action)
  }, [isUnlocked, loggingIn, isLoggedIn, state.error.login])

  if (!state.web3.hasWallet) return null

  return isLoggedIn ? (
    <Jazzicon diameter={30} seed={jsNumberForAddress(state.web3.account)} />
  ) : loggingIn ? (
    'Logging in'
  ) : (
    <a onClick={() => setLogginIn(true)}>Login</a>
  )
}
