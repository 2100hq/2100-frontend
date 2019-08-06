import React, { useState, useEffect } from 'react'
import { useStoreContext } from '../../contexts/Store'
import { Redirect } from 'react-router-dom'
import AllowUsername from './AllowUsername'
import SetAdmin from './SetAdmin'

export default function Admin () {
  const { state } = useStoreContext()
  const [tab, setTab] = useState(null)
  const { isAdmin, isSystemAddress } = (state.private && state.private.me) || {}
  useEffect(() => {
    if (isSystemAddress) return setTab('SetAdmin')
    setTab('AllowUsername')
  }, [isAdmin, isSystemAddress])

  if (!state.private.isSignedIn) return <Redirect to='/' />

  if (!isAdmin && !isSystemAddress) return <Redirect to='/' />

  const tabs = {
    AllowUsername: <AllowUsername />,
    SetAdmin: <SetAdmin />
  }

  const nav = []

  if (isAdmin) {
    nav.push(
      <li className='nav-item' key='AllowUsername'>
        <a
          className={`nav-link ${tab === 'AllowUsername' && 'active'}`}
          onClick={() => setTab('AllowUsername')}
        >
          Allow Username
        </a>
      </li>
    )
  }

  nav.push(
    <li className='nav-item' key='SetAdmin'>
      <a
        className={`nav-link ${tab === 'SetAdmin' && 'active'}`}
        onClick={() => setTab('SetAdmin')}
      >
        Add/Remove Admin
      </a>
    </li>
  )

  console.log(nav)

  return (
    <div className='row'>
      <div className='col-md-5'>
        <h3>Admin</h3>
        <div className='card'>
          <div className='card-body'>
            <ul className='nav nav-pills'>{nav}</ul>
            <div className='card-body'>
              <div className='row'>{tab ? tabs[tab] : null}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
