import React, { useEffect, useState } from 'react'
import { Link, Redirect } from 'react-router-dom'
import { useStoreContext } from '../../../contexts/Store'
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'
import './style.scss'
import Dropdown from 'react-bootstrap/Dropdown'
import { BN, toDecimals } from '../../../utils'
import { get } from 'lodash'
function Balances ({ state }) {
  if (!state.private || !state.private.me) return null
  const { used, total } = state.controller.balances
  return (
    <div className='nav-link slide-left'>
    {/* wallet no more <Link className='nav-link slide-left' to='/wallet'>*/}
      <img className='dai-logo' src='../img/dai.png' /> {toDecimals(used)} / {toDecimals(total)}
    {/*</Link>*/}
    </div>
  )
}

function AddressIcon ({ username, useraddress }) {
  const displayName = username || (useraddress||'').slice(0, 7)
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
  const hasToken = query.getMyToken()
  return (
    [
      <Dropdown as='li' className='nav-item' key='dropdown'>
        <Dropdown.Toggle as='a' className='nav-link in' href='#'>
          <AddressIcon username={query.getUserMyName()} useraddress={query.getUserAddress()} />
        </Dropdown.Toggle>
        <Wave />
        <Dropdown.Menu>
          {/*<Link className='dropdown-item' to='/wallet'>
            Wallet
          </Link>*/}
          {
            !hasToken && (
              <Link className='dropdown-item' to='/manage'>
                Link Username
              </Link>
            )
          }
          <AdminLink state={state} />
          <Dropdown.Divider />
          <Link className='dropdown-item' to='/signout'>
            Sign Out
          </Link>
        </Dropdown.Menu>
      </Dropdown>,
      <li className='nav-item' key='balances'>
        <Balances state={state} />
      </li>
    ]
  )
}

function GetMetamask(){
  return(
  <a href='https://metamask.io/' className='nav-link active'>
    <img className='wallet-logo' src='/img/metamask.png' style={{width: '1.5rem', marginRight: '0.5rem'}} />
  Get Metamask
  </a>
  )
}

function NotSigningIn ({ onClick }) {
  function handleClick (e) {
    e.preventDefault()
    onClick()
  }
  return (
    <li className='nav-item'>
      <a href='#' className='nav-link' onClick={handleClick} style={{fontWeight: 'bold'}}>
        <img className='wallet-logo' src='/img/metamask.png' style={{width: '1.5rem', marginRight: '0.5rem'}} />
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

  const isUnlocked = get(state,'web3.isUnlocked', false)
  const isSignedIn = get(state, 'private.isSignedIn', false)
  const authToken = get(state, 'auth.token')

  const isError =
    get(state, ['error', 'LOGIN']) ||
    get(state, ['error', 'UNLOCK_WALLET']) ||
    get(state, ['error', 'METAMASK'])

  const setSigningIn = val => dispatch(actions.update(intent, val))

  const publicAddress = get(state, 'private.me.publicAddress')

  // Auto Sign in
  useEffect(() => {
    if (isSignedIn || signingIn || !authToken) return
    if (state.web3.hasWallet) setSigningIn(true)
  }, [authToken, state.web3.hasWallet])

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

  if (!state.web3.hasWallet) return <GetMetamask />

  if (isSignedIn) {
    if (prevRoute) return <Redirect to={prevRoute} key='redirect' />
    return <SignedIn key='signedin' />
  } else if (signingIn) {
    return <SigningIn key='signingin' />
  } else {
    return <NotSigningIn onClick={() => setSigningIn(true)} key='signedout' />
  }
}
