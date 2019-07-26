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

  const signingIn = state.intents && state.intents.signingIn

  const isUnlocked = Boolean(state.web3.active && state.web3.account)
  const isSignedIn = Boolean(isUnlocked && state.private.me)

  const setSigningIn = val =>
    dispatch(actions.update(['intents', 'signingIn'], val))

  useEffect(() => {
    if (!signingIn || isSignedIn) return
    if (state.error.login) {
      setSigningIn(false)
      return
    }
    if (isSignedIn && signingIn) {
      setSigningIn(false)
      return
    }

    const action = isUnlocked ? actions.login() : actions.unlockWallet()

    dispatch(action)
  }, [isUnlocked, signingIn, isSignedIn, state.error.login])

  if (!state.web3.hasWallet) return null

  return isSignedIn ? (
    <SignedIn state={state} />
  ) : signingIn ? (
    <SigningIn />
  ) : (
    <NotSigningIn onClick={() => setSigningIn(true)} />
  )
}
