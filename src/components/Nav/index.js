import React from 'react'
import { Link } from 'react-router-dom'
import { useStoreContext } from '../../contexts/Store'
import User from './User'
import './style.scss'

function ProtectedNavItem ({state, children}) {
  if (!state.private.isSignedIn) return null
  return children
}

export default function Nav (props) {
  const { state } = useStoreContext()
  return (
    <nav className='navbar navbar-expand-lg navbar-light'>
      <Link to='/' className='navbar-brand'>
        2100
      </Link>
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


        </ul>
        <ul className='navbar-nav'>
          <User {...props} key='user' />
        </ul>
      </div>
    </nav>
  )
}
