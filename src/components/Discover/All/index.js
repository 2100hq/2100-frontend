import React, { useState,useEffect } from 'react'
import { useStoreContext } from '../../../contexts/Store'
import { toDecimals, BigNumber, weiDecimals } from '../../../utils'
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


function Row ({ rank, token, myToken }) {
  let earning = null

  if (BigNumber(token.myStake).gt(0)){
    earning = BigNumber(token.myStake).div(token.totalStakes).times('0.000189')
  }

  // owners reward
  if (myToken && token.id === myToken.id){
    if (earning == null) earning = BigNumber(0)
    earning = earning.plus('0.000021')
  }

  const showEarning = earning != null
  if (showEarning) earning = earning.dp(6,1).toString()

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
      <td>{ showEarning && <span>{earning} <span className='text-muted'>${token.name}</span></span> }</td>
      <td>
        <span className='small'><i class="fas fa-coins"></i></span> <BalanceCountUp token={token} />
      </td>
    </tr>
  )
}



export default function All({tokens = {}, myToken}){

  const rows = Object.values(tokens).map((token, i) => (
    <Row
      rank={i + 1}
      token={token}
      myToken={myToken}
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
          <th>My Balance</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  )
}