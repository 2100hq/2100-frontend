import React from 'react'
import { Link } from 'react-router-dom'
import { useStoreContext } from '../../contexts/Store'
import { toDecimals } from '../../utils'
import User from './User'
import './style.scss'
import Onboarding from '../Onboarding'


function ProtectedNavItem ({state, children}) {
  if (!state.private.isSignedIn) return null
    return children
}

function NavBrand(){
  const { query } = useStoreContext()
  const isSignedIn = query.getIsSignedIn()
  if (!isSignedIn) return  <Link to='/' className='navbar-brand'>2100</Link>
  const myToken = query.getMyToken()
  if (!myToken || !myToken.id) return <Link to='/' className='navbar-brand'>{query.getUserAddress().slice(0, 7)}</Link>
  return <Link to='/' className='navbar-brand'>{query.getMyToken().name}</Link>
}


function NotSignedIn(){
  return(
    <div className="inner">
      <div>
        <Onboarding />
      </div>
    </div>
  )
}

function NoToken(){
  const { query } = useStoreContext()
  const userAddress = query.getUserAddress()
  return(
    <div className="inner">
      <div>
        <h1>{userAddress.slice(0, 7)}</h1>
        <h6><Link to='/manage' style={{color: 'white'}}><i class="fab fa-twitter"></i> Create your token</Link></h6>
      </div>
    </div>
  )
}

function HasToken(){
  const { query } = useStoreContext()
  const myToken = query.getMyToken()
  return(
    <div>
      <div className='mytokenname'><span>${myToken.name}</span></div>
      <div className='mytokenstake'><span><img src='../img/dai.png' style={{ width: '20px','vertical-align': 'middle' }} />{toDecimals(myToken.totalStakes,5)} staking</span></div>
    </div>
  )
}

function MiniProfile(){
  const { query } = useStoreContext()
  const isSignedIn = query.getIsSignedIn()
  if (!isSignedIn) return <NotSignedIn />
  const myToken = query.getMyToken()
  if (!myToken || !myToken.id) return <NoToken />
  return <HasToken />
}

export default function Nav (props) {
  const { state, query } = useStoreContext()
  return (
    <div className="header-background">
      <nav className='navbar navbar-expand-lg navbar-light' style={{position: 'absolute', width: '100%'}}>
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
        </div>
      </div>
    </div>
    )
}
