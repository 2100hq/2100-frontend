import React from 'react'
import { useStoreContext } from '../../contexts/Store'
import Wallet from '../Wallet'
import { Link } from 'react-router-dom'
import { get } from 'lodash'
import './style.scss'

function Balances () {
  const { state } = useStoreContext()
  if (!state.private || !state.private.me) return null // not logged in
  return <div>0/2100</div>
}

function Header (props) {
  const { state } = useStoreContext()
  const connectionStatus = state.network.loading
    ? 'loading'
    : state.network.connected
      ? 'connected'
      : 'not connected'
  const blockNumber = state.network.loading
    ? null
    : get(state, ['public', 'latestBlock', 'number'])
  return (
    <header className='Header'>
      <span className='brand'>2100</span>
      <span className='nav-pill'>
        <Link to='/'>Discover</Link>
      </span>
      <span className='nav-pill'>
        <Link to='/portfolio'>Portfolio</Link>
      </span>
      <span className='nav-pill'>
        <Link to='/sync'>Sync</Link>
      </span>
      <span className='nav-pill'>
        <Link to='/settle'>Settle</Link>
      </span>
      <span className='nav-pill'>{connectionStatus}</span>
      <span className='nav-pill'>{blockNumber}</span>
      <span className='balance'>
        <span>
          <Balances />
          <Wallet />
        </span>
      </span>
    </header>
  )
}

export default Header
