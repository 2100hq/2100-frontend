import React, { useState, useEffect, useRef } from 'react'
import { useStoreContext } from '../../contexts/Store'
import { toDecimals, BN } from '../../utils'
import { get, sortBy, cloneDeep, groupBy } from 'lodash'
import { useCountUp } from 'react-countup'
import Blocks from './Blocks'
import './style.scss'

function BalanceCountUp ({token}) {
  const { countUp, update } = useCountUp({
    start: 0,
    end: toDecimals(token.balances.available),
    delay: 0,
    decimals: 6,
    duration: 0.25
  })
  useEffect(() => {
    update(toDecimals(token.balances.available))
  }, [token.balances.available])
  return (
    countUp
  )
}

function getLatestBlock (state) {
  return get(state, 'public.latestBlock.number')
}

function getTokens (state) {
  return cloneDeep(state.tokens || {})
}

function getIsSignedIn (state) {
  return get(state, 'private.isSignedIn', false)
}

const defaultDelay = 3000

/*
<ul className='list-group list-group-flush'>
        <li className='list-group-item'>1000 Followers</li>
        <li className='list-group-item'>6,000 Minting</li>
      </ul>
      */

function getStakeStats (token, previous) {
  if (!previous) return {changed: false, amount: '0'}
  const currentStakes = BN(token.totalStakes)
  const prevStakes = BN(previous.totalStakes || '0')
  let amount = BN(currentStakes).sub(prevStakes)
  let percent = BN(0)
  const changed = !amount.eq(0)
  const increased = amount.gt(0)
  amount = amount.abs()

  // if (changed)
  //   {percent = increased ? amount.div(prevStakes.eq(0) ? amount : prevStakes) : amount.div(currentStakes.eq(0) ? amount : currentStakes)}
  // percent = percent.mul(100).toString()
  return {
    amount,
    changed,
    increased,
    percent
  }
}

// function TokenStat({token, previous}){
//   if (token.pending) return null
//     const stats = getStakeStats(token, previous)
//   if (!stats.changed) return null
//   return (
//     <ul className='list-group list-group-flush'>
//       <p>{token.name}</p>
//       { stats.changed ? <li className='list-group-item'>Minting {stats.increased ? 'up' : 'down'} by {toDecimals(stats.amount)} DAI</li> : null }

//     </ul>
//   )
// }

function getCommands (state) {
  return state.commands.filter(command => {
    if (!command.done) return false
    if (!/transferStakeReward|transferOwnerReward|transferCreatorReward/.test(command.type)) return false
    return true
  })
}

function CommandStat ({command}) {
  let action

  switch (command.type) {
    case 'transferOwnerReward':
      action = 'owners reward'
      break
    case 'transferStakeReward':
      action = 'staking reward'
      break
    case 'transferCreatorReward':
      action = 'creators reward'
      break
    default:
      throw new Error(`Unknown type ${command.type}`)
  }
  const amount = toDecimals(command.amount).split('.')
  return <li>{action}: {amount[0]}.{amount[1].slice(0, 6)}</li>
}

function TokenStat ({token, commands}) {
  return (
    <div>
      <b>${token.name}</b>
      <ul>
        {
          commands.map(command => <CommandStat command={command} key={command.id} />)
        }
        <li>Total balance: <BalanceCountUp token={token} key='balance' /></li>
      </ul>
    </div>
  )
}


export default function Feed () {
  const { state } = useStoreContext()

  const isSignedIn = getIsSignedIn(state)
  let commands = getCommands(state)

  commands = groupBy(commands, 'blockNumber')

  const latestBlock = getLatestBlock(state)

  return (
    <div className='card'>
      <div className='card-body'>
        <Blocks commands={commands} />
      </div>

    </div>
  )
}
