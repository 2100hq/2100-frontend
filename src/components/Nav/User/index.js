import React, { useEffect, useState } from 'react'
import { Link, Redirect } from 'react-router-dom'
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
      <img className='dai-logo' src='./img/dai.png' /> {toDecimals(total)}
    </Link>
  )
}

function AddressIcon ({ username, useraddress }) {
  const displayName = username || useraddress.slice(0, 7)
  const icon = (
    <span className='in'>
      <Jazzicon diameter={15} seed={jsNumberForAddress(useraddress)} />
    </span>
  )
  return (
    <span>
      {icon} {displayName}
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

function Wave(){
  const [showWave, setShowWave] = useState(true)

  useEffect( ()=>{
    setTimeout(setShowWave,1500)
  }, [])

  if (!showWave) return null
  return (
    <span className='out'>
      <div className='emoji wave'>👋</div>
    </span>
  )
}

function SignedIn () {
  const { state, query } = useStoreContext()
  return (
    [
      <li className='nav-item' key='balances'>
        <Balances state={state} />
      </li>,
      <Dropdown as='li' className='nav-item' key='dropdown'>
        <Dropdown.Toggle as='a' className='nav-link in' href='#'>
          <AddressIcon username={query.getUserName()} useraddress={query.getUserAddress()} />
        </Dropdown.Toggle>
        <Wave />
        <Dropdown.Menu>
          <Link className='dropdown-item' to='/wallet'>
            Wallet
          </Link>
          <Link className='dropdown-item' to='/manage'>
            Manage
          </Link>
          <AdminLink state={state} />
          <Dropdown.Divider />
          <Link className='dropdown-item' to='/signout'>
            Sign Out
          </Link>
        </Dropdown.Menu>
      </Dropdown>
    ]
  )
}

function NotSigningIn ({ onClick }) {
  function handleClick (e) {
    e.preventDefault()
    onClick()
  }
  return (
    <li className='nav-item'>
      <a href='#' className='nav-link btn' onClick={handleClick}>
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

export default function User (props) {
  const prevRoute = get(props, 'location.state.from')
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

  const publicAddress = get(state, 'private.me.publicAddress')

  // Auto Sign in
  useEffect(() => {
    if (isSignedIn || signingIn) return
    if (prevRoute) setSigningIn(true)
  }, [prevRoute])

  useEffect(() => {
    if (state.config.disableAuth == null) return
    if (isSignedIn || signingIn || !state.config.disableAuth) return
    if (state.web3.hasWallet) setSigningIn(true)
  }, [state.web3.hasWallet, state.config.disableAuth])

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
    if (!publicAddress) return // waiting for public address
    if (
      publicAddress.toLowerCase() ===
      get(state, 'web3.account', '').toLowerCase()
    ) {
      return
    }
    dispatch(actions.logout())
  }, [isSignedIn, state.web3.account, publicAddress])

  if (!state.web3.hasWallet) return null

  if (isSignedIn) {
    if (prevRoute) return <Redirect to={prevRoute} key='redirect' />
    return <SignedIn key='signedin' />
  } else if (signingIn) {
    return <SigningIn key='signingin' />
  } else {
    return <NotSigningIn onClick={() => setSigningIn(true)} key='signedout' />
  }
}
