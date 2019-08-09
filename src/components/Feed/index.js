import React, { useState, useEffect, useRef } from 'react'
import { useStoreContext } from '../../contexts/Store'
import { toDecimals, BN } from '../../utils'
import { get, sortBy,cloneDeep } from 'lodash'
//transferCreatorReward
//transferOwnerReward
//transferStakeReward

function getLatestBlock(state){
  return get(state, 'public.latestBlock.number')
}

function getLastCommand(state){
  return getCommands(state)[0]
}

function getCommands(state){
  return sortBy(Object.values(get(state, 'private.myCommandHistory', {})), command => command.updated || command.created)
}

function getTokens(state){
  return cloneDeep(state.tokens || {})
}

function getIsSignedIn(state) {
  return get(state, 'private.isSignedIn', false)
}

const defaultDelay = 3000

/*
<ul className='list-group list-group-flush'>
        <li className='list-group-item'>1000 Followers</li>
        <li className='list-group-item'>6,000 Minting</li>
      </ul>
      */

function getStakeStats(token, previous){
  if (!previous) return {changed: false, amount: "0"}
  const currentStakes = BN(token.totalStakes)
  const prevStakes = BN(previous.totalStakes || "0")
  let amount = BN(currentStakes).sub(prevStakes)
  let percent = BN(0)
  const changed = !amount.eq(0)
  const increased = amount.gt(0)
  amount = amount.abs()
  console.log(' ');
  console.log(' ');

  console.log(token.name, token.id);
  console.log('prevStakes.eq(0)', prevStakes.eq(0), prevStakes.toString());
  console.log('currentStakes.eq(0)', currentStakes.eq(0), currentStakes.toString());
  console.log('AMOUNT', amount.toString())
  console.log('CHANGED', changed, 'INCREASED', increased);
  if (changed) console.log('amount.div(prevStakes.eq(0) ? amount : prevStakes)', amount.div(prevStakes.eq(0) ? amount : prevStakes).toString());
  if (changed) console.log('amount.div(currentStakes.eq(0) ? amount : currentStakes)', amount.div(currentStakes.eq(0) ? amount : currentStakes).toString());
  console.log('------------------');
  console.log();

  if (changed)
    {percent = increased ? amount.div(prevStakes.eq(0) ? amount : prevStakes) : amount.div(currentStakes.eq(0) ? amount : currentStakes)}
  percent = percent.mul(100).toString()
  return {
   amount,
   changed,
   increased,
  percent
  }
}

function TokenStat({token, previous}){
  if (token.pending) return null
    const stats = getStakeStats(token, previous)

  return (
    <ul className='list-group list-group-flush'>
      <p>{token.name}</p>
      { stats.changed ? <li className='list-group-item'>Minting {stats.increased ? 'up' : 'down'} by {stats.percent}%</li> : null }

    </ul>
  )
}

export default function Feed(){
  const { state } = useStoreContext()
  const [latestBlock, setLatestBlock] = useState(getLatestBlock(state))

  const [delay, setDelay] = useState(0)
  const tokens = useRef({previous: [], now: getTokens(state) })
  const isSignedIn = getIsSignedIn(state)

  useEffect( () =>{
    if (!latestBlock) return setLatestBlock(getLatestBlock(state))
    setTimeout( () => {
      setLatestBlock(getLatestBlock(state))
      tokens.current = {
        previous: tokens.current.now,
        now: getTokens(state)
      }
    }, delay)
    // if (delay === 0) setDelay(defaultDelay)
  }, [getLatestBlock(state)])
  return (
    <div className='card'>
      <div className='card-body'>
        <h5 className='card-title'>Feed</h5>
        { /*Object.values(tokens.current.now).map( token => {
          return <TokenStat token={token} previous={tokens.current.previous[token.name]} key={token.id}/>
        })*/ }
      </div>

    </div>
  )
}
