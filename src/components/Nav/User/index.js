import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useStoreContext } from '../../../contexts/Store'
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'
import './style.scss'
import Dropdown from 'react-bootstrap/Dropdown'
import { BN, toDecimals, daiAddress, balances } from '../../../utils'
import { get } from 'lodash'
function Balances ({ state }) {
  if (!state.private || !state.private.me) return null
  const { available, total } = balances(state)
  return (
    <Link className='nav-link slide-left' to='/wallet'>
      <img className='dai-logo' src='./img/dai.png' />
      {toDecimals(available)}/{toDecimals(total)}
    </Link>
  )
}

function AddressIcon ({ state }) {
  const account = state.web3.account
  const address = account.slice(0, 7) // state.web3.account.slice(0,7)
  const icon = (
    <span className='in'>
      <Jazzicon diameter={15} seed={jsNumberForAddress(account)} />
    </span>
  )
  return (
    <span>
      {address} {icon}
    </span>
  )
}

function AdminLink ({ state }) {
  const isAdmin = state.private.me.isAdmin || state.private.me.isSystemAddress
  if (!isAdmin) return null
  return (
    <Link className='dropdown-item' to='/admin'>
      Admin
    </Link>
  )
}

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
          <AddressIcon state={state} />
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Link className='dropdown-item' to='/manage'>
            Manage
          </Link>
          <AdminLink state={state} />
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
  const isError =
    get(state, ['error', 'LOGIN']) ||
    get(state, ['error', 'UNLOCK_WALLET']) ||
    get(state, ['error', 'METAMASK'])

  const setSigningIn = val => dispatch(actions.update(intent, val))

  // AUTO SIGN IN
  // useEffect(() => {
  //   setSigningIn(true)
  // }, [])
  useEffect(() => {
    console.log('isSignedIn')
    dispatch(actions.update(['private', 'isSignedIn'], isSignedIn))
  }, [isSignedIn])

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
    ) {
      return
    }
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
