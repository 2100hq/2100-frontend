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

function Logo(){
  return(
    <>
    <img src='/img/2100-logo.png' style={{width: '8rem', padding: '2rem 0'}} />
    </>
    )
}

function NavBrand(){
  const { query } = useStoreContext()
  const isSignedIn = query.getIsSignedIn()
  if (!isSignedIn) return  <Link to='/' className='navbar-brand'><Logo /></Link>
  const myToken = query.getMyToken()
  if (!myToken || !myToken.id) return <Link to='/' className='navbar-brand'>{query.getUserAddress().slice(0, 7)}</Link>
  return <Link to='/' className='navbar-brand'>{query.getMyToken().name}</Link>
}

export default function Nav (props) {
  const { state, query } = useStoreContext()
  return (
      <ul class="nav flex-column vertical-nav ml-5">
      <li class="nav-item our-brand">
        <Link to='/'><Logo /></Link>
      </li>
      <User {...props} key='user' />
      </ul>
    )

 {/*    <nav className='navbar navbar-expand-lg navbar-light'>
      <Link to='/' className='navbar-brand'><Logo /></Link>
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
    </nav>*/}
}
