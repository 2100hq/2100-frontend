import React, { useState, useEffect, useRef } from 'react'
import { useStoreContext } from '../../contexts/Store'
import { toDecimals, BN } from '../../utils'
import { get, sortBy,cloneDeep, groupBy } from 'lodash'
import { useCountUp } from 'react-countup'

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

function getLatestBlock(state){
  return get(state, 'public.latestBlock.number')
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
  // console.log(' ');
  // console.log(' ');

  // console.log(token.name, token.id);
  // console.log('prevStakes.eq(0)', prevStakes.eq(0), prevStakes.toString());
  // console.log('currentStakes.eq(0)', currentStakes.eq(0), currentStakes.toString());
  // console.log('AMOUNT', amount.toString())
  // console.log('CHANGED', changed, 'INCREASED', increased);
  // if (changed) console.log('amount.div(prevStakes.eq(0) ? amount : prevStakes)', amount.div(prevStakes.eq(0) ? amount : prevStakes).toString());
  // if (changed) console.log('amount.div(currentStakes.eq(0) ? amount : currentStakes)', amount.div(currentStakes.eq(0) ? amount : currentStakes).toString());
  // console.log('------------------');
  // console.log();

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

function getCommands(state, latestBlock){
  return state.commands.filter( command => {
    if (!command.done) return false
    if (!/transferStakeReward|transferOwnerReward|transferCreatorReward/.test(command.type)) return false
    return command.blockNumber === latestBlock
  })
}


function CommandStat({command}){
  let action

  switch(command.type){
    case 'transferOwnerReward':
      action = 'owners reward'
      break
    case 'transferStakeReward':
      action = 'staking reward'
      break
    case 'transferCreatorReward':
      action = 'creators reward'
      break;
    default:
      throw new Error(`Unknown type ${command.type}`)
  }
  const amount = toDecimals(command.amount).split('.')
  return <li>{action}: {amount[0]}.{amount[1].slice(0,6)}</li>
}

function TokenStat({token, commands}){
  console.log();
  console.log("COMMANDS", commands);

  return (
    <div>
      <b>${token.name}</b>
      <ul>
        {
          commands.map( command => <CommandStat command={command} key={command.id}/>)
        }
        <li>Total balance: <BalanceCountUp token={token} key='balance' /></li>
      </ul>
    </div>
  )
}

export default function Feed(){
  const { state } = useStoreContext()
  const [latestBlock, setLatestBlock] = useState(getLatestBlock(state))

  const [delay, setDelay] = useState(0)
  const tokens = useRef({previous: [], now: getTokens(state) })
  const isSignedIn = getIsSignedIn(state)
  let commands = getCommands(state, latestBlock)

  commands = groupBy(commands, 'tokenid')

  useEffect( () =>{
    if (!latestBlock) return setLatestBlock(getLatestBlock(state))
    const id = setTimeout( () => {
      if (getLatestBlock(state) === latestBlock) return
      setLatestBlock(getLatestBlock(state))
      tokens.current = {
        previous: tokens.current.now,
        now: getTokens(state)
      }
    }, delay)
    if (delay === 0) setDelay(defaultDelay)
    return () => clearTimeout(id)
  }, [getLatestBlock(state)])


  /*<ul>
  {
    Object.entries(commands).map( (tokenid, commands => <CommandStat command={command} key={command.id} tokens={tokens.current.now}/>)
  }
  </ul>
  <TokenStat token={token} previous={tokens.current.previous[token.name]} key={token.id}/>*/
  // console.log(commands)
  return (
    <div className='card'>
      <div className='card-body'>
        <h5 className='card-title'>Feed</h5>
        <p>Block {latestBlock}</p>

        { Object.values(tokens.current.now).map( token => {
          if (!commands[token.id] || token.pending) return null
          return <TokenStat token={token} commands={commands[token.id]} key={token.id}/>
        }) }
      </div>

    </div>
  )
}
