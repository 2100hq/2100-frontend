import React from 'react'
import { Link } from 'react-router-dom'
import { useStoreContext } from '../../contexts/Store'
import User from './User'
import './style.scss'

function WalletNavItem ({ state }) {
  if (!state.private.isSignedIn) return null
  return (
    <li className='nav-item'>
      <Link to='/wallet' className='nav-link'>
        Wallet
      </Link>
    </li>
  )
}

export default function Nav (props) {
  const { state } = useStoreContext()
  return (
    <nav className='navbar navbar-expand-lg navbar-light'>
      <a className='navbar-brand' href='accounts.html'>
        2100
      </a>
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
        <ul className='navbar-nav mr-auto mt-2 mt-lg-0'>
          <li className='nav-item active'>
            <Link to='/' className='nav-link'>
              Discover
            </Link>
          </li>
          <WalletNavItem state={state} />
        </ul>
        <ul className='navbar-nav'>
          <User {...props} key='user'/>
        </ul>
      </div>
    </nav>
  )
}
