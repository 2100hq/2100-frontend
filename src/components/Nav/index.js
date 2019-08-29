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


function NotSignedIn(){
  return(
    <div className="inner">
      <div>
        <h1 style={{fontSize: '3rem'}}><span>What is 2100?</span></h1>
        <h6><Link to='/manage' style={{color: 'white'}}><i class="fas fa-volume-up"></i> Listen up</Link></h6>
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
    <div className="inner">
      <div>
        <h1><span class='token-name'>{myToken.name}</span></h1>
        <h6><img src='../img/dai.png' style={{ width: '20px','vertical-align': 'middle' }} />{toDecimals(myToken.totalStakes,5)} staking</h6>
      </div>
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
