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
    <div style={{backgroundColor: 'black'}}>
    <nav className='navbar navbar-expand-lg navbar-dark'>
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
        <ul className='navbar-nav mr-auto mt-2 mt-lg-0'>


        </ul>
        <ul className='navbar-nav'>
          <User {...props} key='user' />
        </ul>
      </div>
    </nav>
      <div style={{color: 'white'}}>
        <div style={{minHeight: '8rem'}} className="row align-items-center justify-content-center">
          <div className="col-md-4 text-center">
<div><img src='../img/dai.png' style={{ width: '20px','vertical-align': 'middle' }} />123 minting</div>
            <h3>$benjmnr2</h3>
          </div>
        </div>
        <div className="row">
        </div>
      </div>

    </div>
  )
}
