import React, { useState,useEffect, useRef } from 'react'
import { useStoreContext } from '../../../contexts/Store'
import { toDecimals, BigNumber, weiDecimals } from '../../../utils'
import Allocator from '../../Allocator'
import { useCountUp } from 'react-countup'
import { sortBy } from 'lodash'
import { Link } from 'react-router-dom'
import './style.scss'

function CountUp ({balance, decimals = 5}) {
  const { countUp, update } = useCountUp({
    start: 0,
    end: balance,
    delay: 0,
    decimals,
    duration: 0.25
  })
  useEffect(() => {
    update(balance)
  }, [balance])
  return (countUp)
}


function Row ({ rank, token, myToken }) {
  const prevTotalStakeRef = useRef(token.totalStakes)
  const [stakeArrowDirection, setStakeArrowDirection]=useState(null)
  let earning = null

  if (BigNumber(token.myStake).gt(0)){
    earning = BigNumber(token.myStake).div(token.totalStakes).times('0.000189')
  }

  // owners reward
  if (myToken && token.id === myToken.id){
    if (earning == null) earning = BigNumber(0)
    earning = earning.plus('0.000021')
  }

  earning = earning == null ? '0.000000' : earning.dp(6,1).toString()

  const stakers = Object.values(token.stakes || {}).filter( stake => BigNumber(stake).gt(0) ).length

  useEffect( () => {
    if (prevTotalStakeRef.current === token.totalStakes) return setStakeArrowDirection(null)
    const direction = BigNumber(prevTotalStakeRef.current).lt(token.totalStakes) ? 'up' : 'down'
    setStakeArrowDirection(direction)
    prevTotalStakeRef.current=token.totalStakes
    const id = setTimeout(setStakeArrowDirection, 1000, null)
    return () => clearTimeout(id)
  }, [token.totalStakes])
  return (
    <tr>
      <th scope='row'>{rank}
      </th>
      <td>
        <div className='token-name large'>
          <Link to={`$${token.name}`}>{token.name}</Link>
        </div>
        <div className='token-description small text-muted'>
          {token.description}
        </div>
      </td>
      <td>
        <span style={{position: 'relative'}}>
          { stakeArrowDirection && <i className={`fas fa-arrow-${stakeArrowDirection} stake-arrow`}></i> }
          <CountUp balance={toDecimals(token.totalStakes)} decimals={2} /> DAI
        </span>
        <div className='small text-muted'>
          {stakers > 0 && <span><i className="fas fa-user stakers-icon"></i><CountUp balance={stakers} decimals={0} /></span>}
        </div>
      </td>
      <td>
        <Allocator token={token} /><span className="small text-muted"><CountUp balance={toDecimals(token.myStake)} decimals={2} /> DAI</span>
      </td>
      <td>
        <div>
          <span className='small'><img src='../img/coin-icon.png' style={{width: '1rem', position: 'relative', top: '-0.15rem', left: '0.1rem'}}/></span> <CountUp balance={toDecimals(token.balances.available,5)} />
        </div>
          <span className='small text-muted'> { <span><CountUp balance={earning} decimals={6} /> per block</span> }</span>
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
          <th>My Balance</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  )
}