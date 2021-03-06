import React, { useEffect, useState } from 'react'
import { Link, Redirect } from 'react-router-dom'
import { useStoreContext } from '../../../contexts/Store'
import { useFollowMeContext } from '../../../contexts/FollowMe'
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'
import './style.scss'
import Dropdown from 'react-bootstrap/Dropdown'
import { BN, toDecimals } from '../../../utils'
import { get } from 'lodash'
function Balances ({ state, actions, dispatch }) {
  if (!state.private || !state.private.me) return null


  const { used, total } = state.controller.balances
  return (
    <div className='nav-link slide-left'>
    {/* wallet no more <Link className='nav-link slide-left' to='/wallet'>*/}
      <span className='balance'><img className='dai-logo' src='../img/dai.png' /> {toDecimals(used)} / {toDecimals(total)}</span>

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
  const { state, query, actions, dispatch } = useStoreContext()
  const hasToken = query.getMyToken()
  const hasClaimedDai = state.private.mytoken && state.private.me.claimed
  return (
    <div>
      <li className='nav-item'>
        <a className='nav-link in'>
          <AddressIcon username={query.getUserMyName()} useraddress={query.getUserAddress()} />
        </a>
        <Wave />
      </li>
      <li className='nav-item' key='balances'>
        <Balances state={state} actions={actions} dispatch={dispatch}/>
      </li>

      {hasToken && !hasClaimedDai && (<li className="nav-item text-muted small" style={{paddingLeft:'16px'}}>
        <a href='#' onClick={e => {
           e.preventDefault()
           dispatch(actions.claimFakeDai())
        }}>Get fake DAI</a>
      </li>)}
      {!hasToken && (<li className="nav-item text-muted small" style={{paddingLeft:'16px'}}>
        <Link to="/manage"><i className="fab fa-twitter"></i> Link Username</Link>
      </li>)}
    </div>
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

function Disconnected({}){
  return (
    <li className='nav-item'>
      <div className='nav-link' style={{fontWeight: 'bold'}}>
        <i className="fas fa-circle" style={{color: 'red'}}></i> Not connected
      </div>
    </li>
  )
}

function SigningIn () {
  return (
    <div className="flex-column">
      <div className='spinner-grow' role='status'>
        <span className='sr-only'>Loading...</span>
      </div>
    </div>
  )
}

export default function User (props) {
  const prevRoute = get(props, 'location.state.from')
  const { state, dispatch, actions } = useStoreContext()
  const { network:fmnetwork } = useFollowMeContext()
  const {network} = state
  const intent = ['intents', 'signingIn']
  const signingIn = get(state, intent)

  const isUnlocked = get(state,'web3.isUnlocked', false)
  const isSignedIn = get(state, 'private.isSignedIn', false)
  const authToken = get(state, 'auth.token')

  const isError =
    get(state, ['error', 'LOGIN']) ||
    get(state, ['error', 'UNLOCK_WALLET']) ||
    get(state, ['error', 'METAMASK'])

  const setSigningIn = val => {
    dispatch(actions.update(intent, val))
  }

  const publicAddress = get(state, 'private.me.publicAddress')

  // Auto Sign in
  useEffect(() => {
    if (network.loading) return
    if (isSignedIn || signingIn || !authToken) return
    if (state.web3.hasWallet && network.connected) setSigningIn(true)
  }, [authToken, state.web3.hasWallet, network.loading, network.connected, network.reconnected])

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
  if (!network.connected || network.disconnected || fmnetwork.disconnected) return <Disconnected />
  if (isSignedIn) {
    if (prevRoute) return <Redirect to={prevRoute} key='redirect' />
    return <SignedIn key='signedin' />
  } else if (signingIn) {
    return <SigningIn key='signingin' />
  } else {
    return <NotSigningIn onClick={() => setSigningIn(true)} key='signedout' />
  }
}
