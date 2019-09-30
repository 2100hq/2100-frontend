import React, { useState,useEffect, useRef, useMemo } from 'react'
import { useStoreContext } from '../../../contexts/Store'
import { toDecimals, BigNumber, weiDecimals, extractUsernameAndMessageIdFromLocation, oneblockReward, daiAPRperBlock } from '../../../utils'
import LinkableName from '../../LinkableName'
import useDebounce from '../../../utils/hooks/useDebounce'
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

function Row ({ token, myToken, currentUsername, isAllocating, isEditing,  setIsEditing, index, delayRankChange = true}) {
  const prevTotalStakeRef = useRef(token.totalStakes)
  const prevIndexRef = useRef(token.rank)
  const [stakeArrowDirection, setStakeArrowDirection]=useState(null)
  // only calculate earning when necessary
  const [earning, setEarning] = useState('0.000000')
  const [earningZero, setEarningZero] = useState(true)
  const [rankChanged, setRankChanged] = useState(false)
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
    if (prevIndexRef.current === token.rank) return

    const change = token.rank > prevIndexRef.current ? 'up' : 'down'

    prevIndexRef.current=token.rank

    if (!delayRankChange) return

    let ids = []

    const id1 = setTimeout(()=>{
      setRankChanged(change)
      const id2 = setTimeout(setRankChanged, 250, false)
      ids.push(id2)
    }, 2000)

    ids.push(id1)

    return () => ids.map(clearTimeout)
  }, [token.rank])


  const isAllocatingToken = isAllocating && isAllocating.tokenid === token.id
  const myStake = useMemo( ()=>toDecimals(token.myStake), [token.myStake])

  isEditing = isEditing.tokenid === token.id

  const balance = useMemo(() => toDecimals(token.balances.available,5), [token.balances.available])
  const totalStakes = useMemo( ()=>toDecimals(token.totalStakes), [token.totalStakes])

  const selected = currentUsername === token.name ? ' selected' : ''
  const allocating = isAllocating ? ' allocating' : ''
  const editing = isEditing ? ' editing' : ''
  const changed = rankChanged ? ` rank-changed-${rankChanged}` : ''

  let columns = null

  if (isEditing){
    columns = (
      <React.Fragment>
        <div className="col-5">
          <Allocator token={token} onComplete={()=>setIsEditing({})} onClickOutside={()=>setIsEditing({})} className='allocator' />
        </div>
        <div className="col-1">
        { isAllocatingToken ? <Spinner animation="grow" /> : <i className="text-muted fas fa-times-circle close-allocator" onClick={()=>!isAllocating && setIsEditing({})}></i>
        }
        </div>
      </React.Fragment>
    )
  } else {
    columns = (
      <React.Fragment>
        <div className="col-3 small text-center">
          <CountUp balance={myStake} decimals={2} /> / { token.totalStakes !== "0" ? <CountUp balance={totalStakes} decimals={2} /> : "0.00" }
        </div>
        <div className="col-3 small text-center">
          <div><CountUp balance={balance} decimals={4}/> / 2100</div>
        </div>
        <div className="col-1" style={{textAlign: 'center'}}>
          <i class="text-muted far fa-edit"></i>
        </div>
      </React.Fragment>
    )
  }

  return (
    <div className={"row no-gutters asset-row align-items-center"+selected+allocating+editing+changed} onClick={()=>{
      !isEditing && !isAllocating && setIsEditing({tokenid: token.id})
    }}>
      <div className="col-1" style={{textAlign: 'center'}}>
        <Crown token={token}/>
        {token.rank !== 1 && <span className={'rank rank'+token.rank}>{token.rank}</span>}<br/>
      </div>
      <div className='col-1' style={{textAlign: 'center'}}>
          <ProfileImage className={Number(myStake) === 0 ? 'profile-image' : 'profile-image pulse'} token={token} /><br/>
      </div>
      <div className="col-3" style={{overflow: 'hidden'}}>
        <LinkableName token={token} />
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
  let [rawAssetSearch, _setAssetSearch] = useState('')
  const setAssetSearch = e => _setAssetSearch(e.target.value)
  const assetSearch = useDebounce(rawAssetSearch, 250)
  const isSearching = Boolean(assetSearch)
  const searchRegExp = useMemo(() => new RegExp(assetSearch || '', 'i'),[assetSearch])

  useEffect( () => {
    const fixedTokenIds = idHash(fixedTokens)
    if (fixedTokenIds === tokensIds) return
    if (!fixedTokens || fixedTokens.length === 0) return setFixedTokens(tokens)
    if (isAllocating.tokenid || isEditing.tokenid) return // dont swap if we're in the middle of something
    const id = setTimeout(setFixedTokens,2000,tokens)
    return () => clearTimeout(id)
  },[tokensIds, isEditing, isAllocating])

  const {username} = extractUsernameAndMessageIdFromLocation(location)

  const filteredTokens = useMemo(() => {
    if (!isSearching) return Object.values(fixedTokens)
    return Object.values(fixedTokens).filter( token => searchRegExp.test(token.name.replace(/_+/g, '')))
  }, [fixedTokens, assetSearch])

  let rows = filteredTokens.map((token, i) => (
    <Row
      token={token}
      myToken={myToken}
      key={token.name}
      currentUsername={username}
      isAllocating={isAllocating}
      isEditing={isEditing}
      setIsEditing={setIsEditing}
      index={i}
      delayRankChange={!isSearching}
    />
  ))

  // empty rows; either still loading tokens or no match found in search
  if (rows.length === 0){
    rows = <div className="row" style={{marginTop: '1rem'}}><div className="col-1" style={{textAlign: 'center'}}></div><div className="col">{isSearching ? `No match for "${assetSearch}"` : 'Loading...'}</div></div>
  }

  return (
    <div className="asset-table">
      <div className="row table-header no-gutters text-center small align-items-center">
        <div className="col-1">#</div>
        <div className="col-4 asset-search">
          <i class="fas fa-search" /><input type='text' value={rawAssetSearch} onChange={setAssetSearch}/>
        </div>
        <div className="col-3">Me / Total</div>
        <div className="col-3">Balance</div>
      </div>
      {rows}
    </div>
  )
}

export default withRouter(All)