import React from 'react'
import { Redirect } from 'react-router-dom'
import { useStoreContext } from '../../contexts/Store'
import History from './History'
import Bank from './Bank'

export default function Wallet () {
  const { state } = useStoreContext()
  if (!state.private.isSignedIn) return <Redirect to='/' />

  return (
    <div className='container-fluid'>
      <div className='row'>
        <div className='col-md-8'>
          <div className='row'>
            <div className='col-md-12'>
              <Bank />
              <div className='card mt-3'>
                <div className='card-body'>
                  <table className='table table-sm'>
                    <thead>
                      <tr>
                        <th scope='col'>Asset</th>
                        <th scope='col'>2100</th>
                        <th scope='col'>Mint</th>
                        <th scope='col'>0xabc</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>$vitalikbuterin</td>
                        <td>0</td>
                        <td>
                          <a className='btn disabled' href=''>
                            mint as ERC-20
                          </a>
                        </td>
                        <td>0.34</td>
                      </tr>
                      <tr>
                        <td>$alice</td>
                        <td>0.34</td>
                        <td>
                          <a className='btn btn-light' href=''>
                            mint as ERC-20
                          </a>
                        </td>
                        <td>0</td>
                      </tr>
                      <tr>
                        <td>$bob</td>
                        <td>0.34</td>
                        <td>
                          <a className='btn btn-light' href=''>
                            mint as ERC-20
                          </a>
                        </td>
                        <td>0</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
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
