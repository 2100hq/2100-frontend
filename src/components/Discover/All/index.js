import React, { useState,useEffect, useRef, useMemo } from 'react'
import { useStoreContext } from '../../../contexts/Store'
import { toDecimals, BigNumber, weiDecimals, extractUsernameAndMessageIdFromLocation, oneblockReward, daiAPRperBlock } from '../../../utils'
import history from '../../../utils/history'
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


function marketCap(totalStakes){
  return daiAPRperBlock.times(toDecimals(totalStakes)).times("10000000").toString()
}

function Row ({ token, myToken, currentUsername, isAllocating, isEditing,  setIsEditing, index}) {
  const prevTotalStakeRef = useRef(token.totalStakes)
  const prevIndexRef = useRef(index)
  const [stakeArrowDirection, setStakeArrowDirection]=useState(null)
  if (prevIndexRef.current != index) console.log(token.name, prevIndexRef.current, index)
  // only calculate earning when necessary
  const [earning, setEarning] = useState('0.000000')
  const [earningZero, setEarningZero] = useState(true)
  const [indexChanged, setIndexChanged] = useState(false)
  // useEffect(()=> {
  //   let newEarning = null

  //   if (BigNumber(token.myStake).gt(0)){
  //     newEarning = BigNumber(token.myStake).div(token.totalStakes).times('0.000189')
  //   }

  //   // owners reward
  //   if (myToken && token.id === myToken.id){
  //     if (newEarning == null) newEarning = BigNumber(0)
  //     newEarning = newEarning.plus('0.000021')
  //   }

  //   newEarning = newEarning == null ? '0.000000' : newEarning.dp(6,1).toString()
  //   setEarning(newEarning)
  //   setEarningZero(BigNumber(newEarning).eq(0))
  // },[token.myStake,token.totalStakes,(myToken&&myToken.id)])


  // const stakers = Object.values(token.stakes || {}).filter( stake => BigNumber(stake).gt(0) ).length

  useEffect( () => {
    if (prevTotalStakeRef.current === token.totalStakes) return setStakeArrowDirection(null)
    const direction = BigNumber(prevTotalStakeRef.current).lt(token.totalStakes) ? 'up' : 'down'
    setStakeArrowDirection(direction)
    prevTotalStakeRef.current=token.totalStakes
    const id = setTimeout(setStakeArrowDirection, 3000, null)
    return () => clearTimeout(id)
  }, [token.totalStakes])

  useEffect( () => {
    if (/trump/.test(token.name)) console.log('prevIndexRef.current === index', prevIndexRef.current,index)
    if (prevIndexRef.current === index) return
    setIndexChanged(index > prevIndexRef.current ? 'up' : 'down')
    prevIndexRef.current=index

    const id = setTimeout(setIndexChanged, 250, false)
    return () => clearTimeout(id)
  }, [index])


  const isAllocatingToken = isAllocating && isAllocating.tokenid === token.id
  const myStake = useMemo( ()=>toDecimals(token.myStake), [token.myStake])

  isEditing = isEditing.tokenid === token.id

  const balance = useMemo(() => toDecimals(token.balances.available,5), [token.balances.available])
  const totalStakes = useMemo( ()=>toDecimals(token.totalStakes), [token.totalStakes])


  const selected = currentUsername === token.name ? ' selected' : ''
  const allocating = isAllocating ? ' allocating' : ''
  const editing = isEditing ? ' editing' : ''
  const changed = indexChanged ? ` index-changed-${indexChanged}` : ''

  let columns = null

  if (isEditing){
    columns = (
      <>
        <div className="col-5">
          <Allocator token={token} onComplete={()=>setIsEditing({})} onClickOutside={()=>setIsEditing({})} className='allocator' />
        </div>
        <div className="col-1">
        { isAllocatingToken ? <Spinner animation="grow" /> : <i className="text-muted fas fa-times-circle close-allocator" onClick={()=>!isAllocating && setIsEditing({})}></i>
        }
        </div>
      </>
    )
  } else {
    columns = (
      <>
        <div className="col-1 small text-center">
          ${ token.totalStakes !== "0" ? <CountUp balance={totalStakes} decimals={2} /> : "0.00" }
        </div>
        <div className="col-1 small text-center">
            <span>{Number(myStake) === 0 ? '-' : myStake}</span>
        </div>
        <div className="col-1 small text-center">
            <span>{Number(myStake) === 0 ? '-' : myStake}</span>
        </div>
        <div className="col-1 small text-center">
            <span>{Number(myStake) === 0 ? '-' : myStake}</span>
        </div>
        <div className="col-1 small text-center">
            <span>{Number(myStake) === 0 ? '-' : myStake}</span>
        </div>
        <div className="col-1 small text-center">
          <div><CountUp balance={balance} /></div>
        </div>
        <div className="col-1" style={{textAlign: 'center'}}>
          <i class="text-muted far fa-edit"></i>
        </div>
      </>
    )
  }

  return (
    <div className={"row no-gutters asset-row align-items-center"+selected+allocating+editing+changed} onClick={()=>{
      !isEditing && !isAllocating && setIsEditing({tokenid: token.id})
    }}>
      <div className="col-1" style={{textAlign: 'center'}}>
        <Crown token={token}/>
        <span className={'rank rank'+token.rank}>{token.rank}</span><br/>
      </div>
      <div className='col-1' style={{textAlign: 'center'}}>
          <ProfileImage className={Number(myStake) === 0 ? 'profile-image' : 'profile-image pulse'} token={token} /><br/>
      </div>
      <div className="col-3" style={{overflow: 'hidden'}}>
          <a href="#" onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            history.push(`/$${token.name}`)
          }}>
            <span style={{fontWeight: 'bold'}}>${token.name}</span>
          </a>
      </div>
      {columns}
    </div>
  )
}

function idHash(tokens){
  return tokens.map(token => token.id).join('')
}

function All({tokens = [], location, myToken, isAllocating, isEditing, setIsEditing}){
  const [fixedTokens, setFixedTokens] = useState(tokens)
  const tokensIds = idHash(tokens)

  useEffect( () => {
    const fixedTokenIds = idHash(fixedTokens)
    if (fixedTokenIds === tokensIds) return
    if (!fixedTokens || fixedTokens.length === 0) return setFixedTokens(tokens)
    if (isAllocating.tokenid || isEditing.tokenid) return // dont swap if we're in the middle of something
    const id = setTimeout(setFixedTokens,2000,tokens)
    return () => clearTimeout(id)
  },[tokensIds, isEditing, isAllocating])
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
      index={i}
    />
  ))
  return (
    <div className="asset-table">
      <div style={{backgroundColor: 'white', borderLeft: '1px solid #eee', borderBottom: '1px solid #eee'}} className="row no-gutters small text-muted sticky-top pt-1 pb-1">
        <div className="col-1">#</div>
        <div className="col-1">Photo</div>
        <div className="col-3">Asset</div>
        <div className="col-1">Total</div>
        <div className="col-1">Me</div>
        <div className="col-1">New</div>
        <div className="col-1">New</div>
        <div className="col-1">New</div>
        <div className="col-1">Balance</div>
      </div>
      {rows}
    </div>
  )
}

export default withRouter(All)