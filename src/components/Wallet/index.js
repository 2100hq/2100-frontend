import React from 'react'
import { Redirect } from 'react-router-dom'
import { useStoreContext } from '../../contexts/Store'
import History from './History'
import Bank from './Bank'
import AssetsTable from './AssetsTable'

export default function Wallet (props) {
  const { state } = useStoreContext()
  if (!state.private.isSignedIn) return <Redirect to={{
              pathname: "/",
              state: { from: props.location }
            }}  />

  return (
    <div className='container-fluid'>
      <div className='row'>
        <div className='col-md-8'>
          <div className='row'>
            <div className='col-md-12'>
              <Bank />
              <AssetsTable />
            </div>
          </div>
        </div>
        <div className='col-md-4'>
          <div className='card'>
            <div className='card-body'>
              <History />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
