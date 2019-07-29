import React, { useState, useEffect } from 'react'
import { Redirect } from 'react-router-dom'
import { useStoreContext } from '../../contexts/Store'
import { toDecimals, balances, daiBalances, BN, isApproved } from '../../utils'
import Selectors from '../../utils/selectors'
const diffSteps = BN(10).pow(16)
export default function Wallet () {
  const [diff, setDiff] = useState(BN(0))
  const { dispatch, state, actions } = useStoreContext()
  if (!state.private.isSignedIn) return <Redirect to='/' />
  const { dai, controller } = Selectors(state)
  let { total: lockedDaiTotal } = balances(state, controller)
  let displayLockedDai = toDecimals(lockedDaiTotal.add(diff))
  let { available: daiAvailable } = daiBalances(state, dai)
  let daiDisplay = toDecimals(daiAvailable.sub(diff))

  const noDai = daiDisplay === '0.00'
  const noLockedDai = displayLockedDai === '0.00'

  function inc () {
    if (noDai) return
    setDiff(diff.add(diffSteps))
  }

  function dec () {
    if (noLockedDai) return
    setDiff(diff.sub(diffSteps))
  }

  async function handleApply () {
    if (diff.eq(0)) return
    const approved = await approve()
    if (!approved) return
    let action = 'deposit'
    if (diff.lt(0)) action = 'withdraw'
    const resp = await dispatch(actions[action](diff.abs()))
    if (resp.mined) {
      await resp.mined()
      setDiff(BN(0))
    }
    return !!resp.hash
  }

  async function approve () {
    if (isApproved(state, dai)) return true
    const resp = await dispatch(actions.approve())
    return !!resp.hash
  }

  return (
    <div className='container-fluid'>
      <div className='row'>
        <div className='col-md-8'>
          <div className='row'>
            <div className='col-md-12'>
              <div className='card'>
                <div className='card-body'>
                  <div className='row justify-content-center align-items-center STYLE1'>
                    <div className='col-md-4'>
                      <div className='contract-balance'>
                        <p>
                          <img
                            src='./img/metamask-identicon.png'
                            style={{ width: '25px' }}
                          />
                          {daiDisplay} DAI available
                        </p>
                      </div>
                      <hr />
                      <h1 style={{ fontSize: '4rem' }}>
                        <img src='./img/dai.png' style={{ width: '45px' }} />
                        {displayLockedDai}
                      </h1>
                      <hr />
                      <a
                        className={
                          'btn btn-small btn-light' + (noDai ? ' disabled' : '')
                        }
                        onClick={inc}
                        disabled={noDai}
                      >
                        <i className='fas fa-arrow-up' />
                      </a>
                      <a
                        className={
                          'btn btn-small btn-light' +
                          (noLockedDai ? ' disabled' : '')
                        }
                        onClick={dec}
                        disabled={noLockedDai}
                      >
                        <i className='fas fa-arrow-down' />
                      </a>
                    </div>
                    <div className='col-md-1'>
                      <a
                        className='btn btn-small btn-light'
                        href='#'
                        onClick={handleApply}
                      >
                        <i className='fas fa-lock' />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
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
              <table className='table table-sm'>
                <thead>
                  <tr>
                    <th scope='col'>Date</th>
                    <th scope='col'>Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>July 23, 4:30pm</td>
                    <td>
                      <a href='' data-toggle='modal' data-target='#mintedModal'>
                        minted 0.34 $vitalikbuterin
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td>July 23, 2:04pm</td>
                    <td>locked 850 DAI</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
