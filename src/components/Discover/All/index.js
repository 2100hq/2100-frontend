import React, { useState,useEffect, useRef } from 'react'
import { useStoreContext } from '../../../contexts/Store'
import { toDecimals, BigNumber, weiDecimals, extractUsernameAndMessageIdFromLocation } from '../../../utils'
import Allocator from '../../Allocator'
import { useCountUp } from 'react-countup'
import { sortBy } from 'lodash'
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router'
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


function Row ({ rank, token, myToken, currentUsername }) {
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
    const id = setTimeout(setStakeArrowDirection, 3000, null)
    return () => clearTimeout(id)
  }, [token.totalStakes])

  const selected = currentUsername === token.name ? ' selected' : ''

  return (

<div className={"row asset-row align-items-center"+selected}>

  <div className="col-md-1">
    <img className='profile-image' src={`https://res.cloudinary.com/dhvvhdndp/image/twitter_name/${token.name}.png`}/>
  </div>
  <div className="col-md-3">
    <div className='token-name large' style={{display: 'inline-block'}}>
      <Link to={`/$${token.name}`}>{token.name}
      </Link>
    </div>
  </div>
  <div className="col-md-2">
    <span style={{position: 'relative'}}>
      { stakeArrowDirection && <i className={`fas fa-arrow-${stakeArrowDirection} stake-arrow`}></i> }
      <CountUp balance={toDecimals(token.totalStakes)} decimals={2} /> DAI
    </span>
  </div>
  <div className="col-md-3">
      <Allocator token={token} />
  </div>
  <div className="col-md-3">
    <div style={{fontWeight: 'bold'}}><CountUp balance={toDecimals(token.balances.available,5)} /></div>
      <span className='small text-muted'> { <span><CountUp balance={earning} decimals={6} /> per block</span> }</span>
  </div>
</div>
  )
}

function All({tokens = {}, location, myToken}){
  const {username} = extractUsernameAndMessageIdFromLocation(location)
  const rows = Object.values(tokens).map((token, i) => (
    <Row
      rank={i + 1}
      token={token}
      myToken={myToken}
      key={token.name}
      currentUsername={username}
    />
  ))
  return (
    <div className="asset-table">
      <div className="row heading-row">
        <div className="col-md-1">Image</div>
        <div className="col-md-3">Name</div>
        <div className="col-md-2">Total Stakes</div>
        <div className="col-md-3">My Stake</div>
        <div className="col-md-3">My Balance</div>
      </div>
      {rows}
    </div>
  )
}

export default withRouter(All)