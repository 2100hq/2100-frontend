import React, { useState,useEffect } from 'react'
import { useStoreContext } from '../../../contexts/Store'
import { toDecimals } from '../../../utils'
import Allocator from '../../Allocator'
import { useCountUp } from 'react-countup'
import { sortBy } from 'lodash'

function BalanceCountUp ({token}) {
  const balance = toDecimals(token.balances.available,5)
  const { countUp, update } = useCountUp({
    start: 0,
    end: balance,
    delay: 0,
    decimals: 5,
    duration: 0.25
  })
  useEffect(() => {
    update(balance)
  }, [balance])
  return (countUp)
}


function Row ({ rank, token }) {
  return (
    <tr>
      <th scope='row'>{rank}
      </th>
      <td>
        <span className='token-name large'>{token.name}</span>
      </td>
      <td>
        <Allocator token={token} />
      </td>
      <td>
        <img src='../img/dai.png' style={{ width: '14px','vertical-align': 'baseline' }} /> <span className='text-muted'>{toDecimals(token.myStake)} / {toDecimals(token.totalStakes)}</span>
      </td>
      <td>
        <BalanceCountUp token={token} />
      </td>
    </tr>
  )
}



export default function All({tokens = {}}){

  const rows = Object.values(tokens).map((token, i) => (
    <Row
      rank={i + 1}
      token={token}
      key={token.name}
    />
  ))
  return (
    <table className='table table-hover table-borderless'>
      <thead className='text-muted'>
        <tr>
          <th>Rank</th>
          <th>Asset</th>
          <th>Mint</th>
          <th>Total</th>
          <th>Balance</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  )
}