import React from 'react'
import { Link } from 'react-router-dom'
import { useStoreContext } from '../../contexts/Store'
import { toDecimals } from '../../utils'
import User from './User'
import {Row, Col, Card} from 'react-bootstrap'
import ProfileImage from '../ProfileImage'
import './style.scss'

const isDev = !/alpha/.test(window.location.href)

function ProtectedNavItem ({state, children}) {
  if (!state.private.isSignedIn) return null
    return children
}

function Logo(){
  return(
    <>
    <img className='logo' src='/img/logo9.png' />
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
    <>
      <div style={{textAlign: 'center'}}>
        <div className='our-brand'>
          <Link to='/'><Logo /></Link>
        </div>
        <ul class="nav flex-column vertical-nav">
          <User {...props} key='user' />
        </ul>
      </div>
      <hr/>
      <Row className='personal-data-feed no-gutters justify-content-center small'>
        <Col md='10'>
          <h6>🎉 you earned</h6>
          <Row className='asset-earnings no-gutters'>
            <Col md='2'><ProfileImage token='benjmnr'/></Col>
            <Col md='10'>
              <div>$benjmnr</div>
            </Col>
          </Row>
          <Row className='asset-earnings no-gutters'>
            <Col md='2'><ProfileImage token='brttb'/></Col>
            <Col md='10'>
              <div>$brttb</div>
            </Col>
          </Row>
          <Row className='asset-earnings no-gutters'>
            <Col md='2'><ProfileImage token='fehrsam'/></Col>
            <Col md='10'>
              <div>fehrsam</div>
            </Col>
          </Row>
          <Row className='asset-earnings no-gutters'>
            <Col md='2'><ProfileImage token='jessewldn'/></Col>
            <Col md='10'>
              <div>$jessewldn</div>
            </Col>
          </Row>
          <p>and 5 more...</p>
          <p>based on #34235465</p>
          <hr/>
        </Col>
      </Row>
    </>
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
