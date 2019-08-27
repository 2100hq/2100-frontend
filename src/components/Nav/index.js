import React from 'react'
import { Link } from 'react-router-dom'
import { useStoreContext } from '../../contexts/Store'
import { toDecimals } from '../../utils'
import User from './User'
import './style.scss'

function ProtectedNavItem ({state, children}) {
  if (!state.private.isSignedIn) return null
    return children
}

function MiniProfile(){
  const { query } = useStoreContext()
  const isSignedIn = query.getIsSignedIn()
  if (!isSignedIn) return null
  const myToken = query.getMyToken()
  if (!myToken || !myToken.id) return null
  return (
    <div className="inner">
      <img src='../img/dai.png' style={{ width: '20px','vertical-align': 'middle' }} />{toDecimals(myToken.totalStakes,5)} minting
      <h3><span class='token-name'>{myToken.name}</span></h3>
    </div>
  )
}

export default function Nav (props) {
  const { state, query } = useStoreContext()
  return (
    <div className="header-background">
      <nav className='navbar navbar-expand-lg navbar-dark' style={{position: 'absolute', width: '100%'}}>
        <Link to='/' className='navbar-brand'>2100</Link>
        <button
        className='navbar-toggler'
        type='button'
        data-toggle='collapse'
        data-target='#navbarSupportedContent'
        aria-controls='navbarSupportedContent'
        aria-expanded='false'
        aria-label='Toggle navigation'
        >
          <span className='navbar-toggler-icon' />
        </button>

        <div className='collapse navbar-collapse' id='navbarTogglerDemo03'>
          <ul className='navbar-nav mr-auto mt-2 mt-lg-0'></ul>
          <ul className='navbar-nav'>
            <User {...props} key='user' />
          </ul>
        </div>
      </nav>
      <div>
        <div className="token-name-area">
          <MiniProfile />
        </div>
      </div>
    </div>
    )
}
