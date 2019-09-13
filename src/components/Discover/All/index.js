import React, { useState,useEffect, useRef, useMemo } from 'react'
import { useStoreContext } from '../../../contexts/Store'
import { toDecimals, BigNumber, weiDecimals, extractUsernameAndMessageIdFromLocation } from '../../../utils'
import Allocator from '../../Allocator'
import ProfileImage from '../../ProfileImage'
import { useCountUp } from 'react-countup'
import { sortBy } from 'lodash'
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router'
import { Spinner } from 'react-bootstrap'
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

function Row ({ token, myToken, currentUsername, isAllocating, isEditing,  setIsEditing}) {
  const prevTotalStakeRef = useRef(token.totalStakes)
  const [stakeArrowDirection, setStakeArrowDirection]=useState(null)

  // only calculate earning when necessary
  const [earning, setEarning] = useState('0.000000')
  const [earningZero, setEarningZero] = useState(true)
  useEffect(()=> {
    let newEarning = null

    if (BigNumber(token.myStake).gt(0)){
      newEarning = BigNumber(token.myStake).div(token.totalStakes).times('0.000189')
    }

    // owners reward
    if (myToken && token.id === myToken.id){
      if (newEarning == null) newEarning = BigNumber(0)
      newEarning = newEarning.plus('0.000021')
    }

    newEarning = newEarning == null ? '0.000000' : newEarning.dp(6,1).toString()
    setEarning(newEarning)
    setEarningZero(BigNumber(newEarning).eq(0))
  },[token.myStake,token.totalStakes,(myToken&&myToken.id)])


  // const stakers = Object.values(token.stakes || {}).filter( stake => BigNumber(stake).gt(0) ).length

  useEffect( () => {
    if (prevTotalStakeRef.current === token.totalStakes) return setStakeArrowDirection(null)
    const direction = BigNumber(prevTotalStakeRef.current).lt(token.totalStakes) ? 'up' : 'down'
    setStakeArrowDirection(direction)
    prevTotalStakeRef.current=token.totalStakes
    const id = setTimeout(setStakeArrowDirection, 3000, null)
    return () => clearTimeout(id)
  }, [token.totalStakes])


  const isAllocatingToken = isAllocating && isAllocating.tokenid === token.id
  const myStake = useMemo( ()=>Number(toDecimals(token.myStake)), [token.myStake])

  isEditing = isEditing.tokenid === token.id

  const balance = useMemo(() => toDecimals(token.balances.available,5), [token.balances.available])
  const totalStakes = useMemo( ()=>toDecimals(token.totalStakes), [token.totalStakes])


  const selected = currentUsername === token.name ? ' selected' : ''
  const allocating = isAllocating ? ' allocating' : ''
  const editing = isEditing ? ' editing' : ''

  let columns = null

  if (isEditing){
    columns = (
      <>
        <div className="col-md-5">
          <Allocator token={token} onComplete={()=>setIsEditing({})} onClickOutside={()=>setIsEditing({})} className='allocator' />
        </div>
        <div className="col-md-1">
        { isAllocatingToken ? <Spinner animation="grow" /> : <i className="text-muted fas fa-times-circle close-allocator" onClick={()=>!isAllocating && setIsEditing({})}></i>
        }
        </div>
      </>
    )
  } else {
    columns = (
      <>
        <div className="col-md-1">
            <div className="my-stake">{myStake === 0 ? '-' : myStake}</div>
        </div>
        <div className="col-md-2">
          { !earningZero ? <CountUp balance={earning} decimals={6} /> : '-' }
        </div>
        <div className="col-md-2">
          <div><CountUp balance={balance} /></div>
        </div>
        <div className="col-md-1">
          <i class="text-muted far fa-edit" onClick={()=>!isAllocating && setIsEditing({tokenid: token.id})}></i>
        </div>
      </>
    )
  }
  return (
    <div className={"row asset-row align-items-center"+selected+allocating+editing}>
      <div className="col-md-1" style={{textAlign: 'center'}}>
        <Crown token={token}/>
        <span className={'rank rank'+token.rank}>{token.rank}</span>
      </div>
      <div className="col-md-5">
          <Link to={`/$${token.name}`}>
            <ProfileImage token={token} />
            <span style={{fontWeight: 'bold'}} to={`/$${token.name}`}>${token.name}</span> <span className='small'><CountUp balance={totalStakes} decimals={2} /></span>
          </Link>
      </div>
      {columns}
    </div>
  )
}

function All({tokens = [], location, myToken, isAllocating, isEditing, setIsEditing}){
  const [fixedTokens, setFixedTokens] = useState(tokens)

  useEffect( () => {
    if (fixedTokens.length === tokens.length) return
    setFixedTokens(tokens)
  },[tokens.length])
  const {username} = extractUsernameAndMessageIdFromLocation(location)
  const rows = Object.values(fixedTokens).map((token, i) => (
    <Row
      token={token}
      myToken={myToken}
      key={token.name}
      currentUsername={username}
      isAllocating={isAllocating}
      isEditing={isEditing}
      setIsEditing={setIsEditing}
    />
  ))
  return (
    <div className="asset-table">
      <div className="row heading-row text-muted">
        <div className="col-md-1">#</div>
        <div className="col-md-4">User</div>
        <div className="col-md-2" style={{position: 'relative', left: '-1rem'}}><img src='../img/dai.png' style={{ width: '14px','vertical-align': 'baseline' }} /> Staking</div>
        <div className="col-md-3">My Stake</div>
        <div className="col-md-2">Balance</div>
      </div>
      {rows}
    </div>
  )
}

export default withRouter(All)