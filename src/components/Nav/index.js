import React from 'react'
import User from './User'
import './style.scss'
export default function Nav () {
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
            <a className='nav-link' href='accounts-signed-in.html'>
              Discover <span className='sr-only'>(current)</span>
            </a>
          </li>
          <li className='nav-item'>
            <a className='nav-link' href='address.html'>
              Portfolio
            </a>
          </li>
          <li className='nav-item'>
            <a className='nav-link' href='wallet-full.html'>
              Wallet
            </a>
          </li>
        </ul>
        <ul className='navbar-nav'>
          <User />
        </ul>
      </div>
    </nav>
  )
}
