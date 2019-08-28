import React, { useState,useEffect } from 'react'
import { useStoreContext } from '../../../contexts/Store'
import { toDecimals } from '../../../utils'
import Allocator from '../../Allocator'
import { useCountUp } from 'react-countup'
import { sortBy } from 'lodash'
import { Link } from 'react-router-dom'
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
        <div className='token-name large'><Link to={`$${token.name}`}>{token.name}</Link></div>
        <div className='token-description' style={{ fontSize: '0.7rem',color:'#aaa'}}>Access my new sci-fi story ...</div>
      </td>
      <td>
        <span className='text-muted'>{toDecimals(token.totalStakes)} DAI</span>
      </td>
      <td>
        <Allocator token={token} /><span className="small">{toDecimals(token.myStake)} DAI</span>
      </td>
      <td>0.00021</td>
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
          <th>All Stakers</th>
          <th>My Stake</th>
          <th>Earning per block</th>
          <th>Balance</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  )
}