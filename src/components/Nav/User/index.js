import React, { useEffect } from 'react'
import { useStoreContext } from '../../../contexts/Store'
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'
import './style.scss'
import Dropdown from 'react-bootstrap/Dropdown'
import { BN, toDecimals, daiAddress } from '../../../utils'
import { get } from 'lodash'
function Balances ({ state }) {
  if (!state.private || !state.private.me) return null
  const remaining = BN(
    get(state, `private.myWallets.available.${daiAddress}.balance`, 0)
  )
  const used = Object.values(get(state, 'private.myStakes', [])).reduce(
    (sum, stake) => sum.add(stake.value),
    BN(0)
  )
  const total = used.add(remaining)
  return (
    <a className='nav-link slide-left' href='wallet.html'>
      <img className='dai-logo' src='./img/dai.png' />
      {toDecimals(used)}/{toDecimals(total)}
    </a>
  )
}

function Wallet ({ state }) {
  const account = state.web3.account
  const address = account.slice(0, 7) // state.web3.account.slice(0,7)
  const icon = (
    <span className='in'>
      <Jazzicon diameter={15} seed={jsNumberForAddress(account)} />
    </span>
  )
  return (
    <>
      {address} {icon}
    </>
  )
}
/*

      */
function SignedIn ({ state }) {
  const wave = (
    <span className='out'>
      <div className='emoji wave'>👋</div>
    </span>
  )
  return (
    <>
      <li className='nav-item'>
        <Balances state={state} />
      </li>

      <Dropdown as='li' className='nav-item'>
        {wave}
        <Dropdown.Toggle as='a' className='nav-link in' href='#'>
          <Wallet state={state} />
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item href='sync-add.html'>Manage</Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item href='accounts-sign-in.html'>Sign Out</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </>
  )
}

function NotSigningIn ({ onClick }) {
  return (
    <li className='nav-item'>
      <a href='#' className='nav-link btn' onClick={onClick}>
        <img className='wallet-logo' src='./img/metamask.png' />
        Sign In
      </a>
    </li>
  )
}

function SigningIn () {
  return (
    <div className='spinner-grow' role='status'>
      <span className='sr-only'>Loading...</span>
    </div>
  )
}

export default function User () {
  const { state, dispatch, actions } = useStoreContext()
  const intent = ['intents', 'signingIn']
  const signingIn = get(state, intent)

  const isUnlocked = Boolean(state.web3.active && state.web3.account)
  const isAuthenticated = get(state, 'private.me')
  const isSignedIn = Boolean(isUnlocked && isAuthenticated)
  const isError = get(state, ['error', 'login'])

  const setSigningIn = val => dispatch(actions.update(intent, val))

  // unlock/login action effect
  useEffect(() => {
    if (!signingIn || isSignedIn || isError) return

    const action = isUnlocked ? actions.login() : actions.unlockWallet()

    dispatch(action)
  }, [isUnlocked, signingIn, isSignedIn, isError])

  // error effect
  useEffect(() => {
    if (isError && signingIn) {
      setSigningIn(false)
    }
  }, [signingIn, isError])

  // stop signing in effect
  useEffect(() => {
    if (isSignedIn && signingIn) {
      setSigningIn(false)
    }
  }, [isSignedIn, signingIn])

  // logout action effect
  useEffect(() => {
    if (!isSignedIn) return
    if (
      state.private.me.publicAddress.toLowerCase() ===
      state.web3.account.toLowerCase()
    ) { return }
    dispatch(actions.logout())
  }, [isSignedIn, state.web3.account])

  if (!state.web3.hasWallet) return null

  return isSignedIn ? (
    <SignedIn state={state} />
  ) : signingIn ? (
    <SigningIn />
  ) : (
    <NotSigningIn onClick={() => setSigningIn(true)} />
  )
}
