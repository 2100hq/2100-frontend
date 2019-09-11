import React, { useState,useEffect, useRef } from 'react'
import { useStoreContext } from '../../../contexts/Store'
import { toDecimals, BigNumber, weiDecimals, extractUsernameAndMessageIdFromLocation } from '../../../utils'
import Allocator from '../../Allocator'
import ProfileImage from '../../ProfileImage'
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

function Crown({token}){
  if (token.rank == 1){
     return <i className='fas fa-crown' style={{color: 'orange'}}/>
  } else {
    return null
  }
}

function Row ({ token, myToken, currentUsername }) {
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
  <div className="col-md-1" style={{textAlign: 'center'}}>
    <Crown token={token}/>
    <span className={'rank rank'+token.rank}>{token.rank}</span>
  </div>
  <div className="col-md-5">
      <Link to={`/$${token.name}`}>
        <ProfileImage token={token} />
        <span style={{fontWeight: 'bold'}} to={`/$${token.name}`}>${token.name}</span> <span className='small'><CountUp balance={toDecimals(token.totalStakes)} decimals={2} /></span>
      </Link>
  </div>
  <div className="col-md-2">
      <Allocator token={token} />
  </div>
  <div className="col-md-2">
      <span> { <span><CountUp balance={earning} decimals={6} /></span> }</span>
  </div>
  <div className="col-md-2">
    <div><CountUp  balance={toDecimals(token.balances.available,5)} /></div>
  </div>
</div>
  )
}

function All({tokens = {}, location, myToken}){
  const {username} = extractUsernameAndMessageIdFromLocation(location)
  const rows = Object.values(tokens).map((token, i) => (
    <Row
      token={token}
      myToken={myToken}
      key={token.name}
      currentUsername={username}
    />
  ))
  return (
    <div className="asset-table">
      <div className="row heading-row text-muted">
        <div className="col-md-1">#</div>
        <div className="col-md-5">User</div>
        <div className="col-md-2">My Stake</div>
        <div className="col-md-2">Per Block</div>
        <div className="col-md-2">Balance</div>
      </div>
      {rows}
    </div>
  )
}

export default withRouter(All)