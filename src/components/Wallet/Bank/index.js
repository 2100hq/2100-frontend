import React, { useState, useEffect } from 'react'

import { useStoreContext } from '../../../contexts/Store'
import { toDecimals, BN, isApproved } from '../../../utils'

const diffSteps = BN(10).pow(16)

export default function Bank () {
  const [diff, setDiff] = useState(BN(0))
  const { dispatch, state, actions } = useStoreContext()

  let { total: lockedDaiTotal, pending } = state.controller.balances
  let displayLockedDai = toDecimals(lockedDaiTotal.add(pending).add(diff))
  let { available: daiAvailable } = state.dai.balances
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
    if (resp.hash) {
      setDiff(BN(0))
    }
    return !!resp.hash
  }

  async function approve () {
    if (isApproved(state)) return true
    const resp = await dispatch(actions.approve())
    return !!resp.hash
  }

  return (
    <div className='card'>
      <div className='card-body'>
        <div className='row justify-content-center align-items-center STYLE1'>
          <div className='col-md-4'>
            <div className='contract-balance'>
              <p>
                <img
                  src='./img/metamask.png'
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
  )
}
