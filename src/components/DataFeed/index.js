import React, {useMemo, useState, useEffect} from 'react'
import { useStoreContext } from '../../contexts/Store'
import _BigNumber from 'bignumber.js'
import { BigNumber, toDecimals, oneblockReward, numberSuffix } from '../../utils'
import ms from 'ms'
import {get} from 'lodash'
import {Row, Col} from 'react-bootstrap'
import ProfileImage from '../ProfileImage'
import LinkableName from '../LinkableName'
import './style.scss'

function RewardsHeadingText({state}){
  const latestBlock = get(state, 'public.latestBlock.number', 0)
  const blocksToGo = 5-latestBlock % 5
  let timeToGo = useMemo( () => ms(blocksToGo * 15000), [latestBlock])
  if (latestBlock === 0) timeToGo = 'Some time'
  const emojis = ["","🕘","🕖","🕓","🕐","🎉"]

  const textToGo = blocksToGo === 5 && latestBlock !== 0 ? `Issuing rewards` : `${timeToGo} to next reward`
  return `${emojis[blocksToGo]} ${textToGo}`
}

// function HoldingsFeed({state, query}){
//   const isSignedIn = query.getIsSignedIn()

//   if (!isSignedIn) return null // figure this out later

//   const useraddress = query.getUserAddress().toLowerCase()
//   const holdings = {...get(state, 'stats.earned.latest',{})}
//   delete holdings['2100']

//   const myHoldings = Object.entries(holdings).filter( ([_, holders]) => {
//     return Object.keys(holders).includes(useraddress)
//   }).map( ([name, holders]) => {
//     holders = Object.entries(holders).filter( ([address]) => address !=name ).sort( (a, b) => BigNumber(a[1]).lt(b[1]) ? -1 : 1)
//     const largestHolderAdderss = holders[holders.length - 1][0]
//     let largestHolderName = query.getUserName(largestHolderAdderss) || largestHolderAdderss
//     let myRank = 0
//     let myHolding = "0.00"
//     holders.forEach( ([address, holding], i) => {
//       if (address === useraddress) {
//         myRank = holders.length - i
//         myHolding = toDecimals(holding,6)
//       }
//     })
//     myRank = myRank + 1
//     const suffix = myRank % 10 === 1 ? 'st' : myRank % 10 === 2 ? 'nd' : myRank % 10 === 3 ? 'rd' : 'th'
//     return {name, myRank, suffix, myHolding, largestHolderName}
//   })

//   const holdingsRows = myHoldings.map( ({name, myRank, myHolding, suffix, largestHolderName}) => {
//     return (
//       <React.Fragment>
//         <Row className='asset-holdings no-gutters'>
//           <Col md='2'>
//             <ProfileImage token={name}/>
//           </Col>
//           <Col md='10' style={{paddingLeft: '0.5rem'}}>
//             <div><strong>${name}</strong></div>
//             <div>you hold:</div>
//             <div>{myHolding} ${name} ({myRank}{suffix})</div>
//             { myRank !== 1 && <div>top staker: <br/> ${largestHolderName}</div> }
//           </Col>
//         </Row>
//         <hr/>
//       </React.Fragment>
//     )
//   })

//   return (
//     <React.Fragment>
//       <Row className='user-data-feed no-gutters justify-content-center small'>
//         <Col md='10'>
//           <h6>Your Holdings</h6>
//           {holdingsRows}
//         </Col>
//       </Row>
//     </React.Fragment>
//   )
// }

function EarningsFeed({state, query}){
  const isSignedIn = query.getIsSignedIn()
  const latestBlock = get(state, 'public.latestBlock.number', null)
  const [myEarnings, setMyEarnings] = useState()
  const [lastProcessedBlock, setLastProcessedBlock] = useState()
  useEffect(()=> {
    if (!isSignedIn) return
    if (latestBlock == null) return
    // if (latestBlock%5!==0) return
    if (latestBlock === lastProcessedBlock) return
    setLastProcessedBlock(latestBlock)

    const useraddress = query.getUserAddress().toLowerCase()
    const stakes = get(state, 'public.stakes',{})

    const newEarnings = Object.entries(stakes)
    .filter( ([name, stakers]) => {
      if (name === '2100') return false
      return Object.keys(stakers).includes(useraddress)
    }).map( ([name, stakers]) => {
      stakers = Object.entries(stakers).filter( ([address]) => address !=name ).sort( (a, b) => BigNumber(a[1]).lt(b[1]) ? -1 : 1)
      const largestStakerAddress = stakers[stakers.length - 1][0]
      let largestStakerName = query.getUserName(largestStakerAddress) || largestStakerAddress
      let myRank = 0
      let myStake = null
      stakers.forEach( ([address, stake], i) => {
        if (address === useraddress) {
          myRank = stakers.length - i
          myStake = stake
        }
      })
      if (!myStake || myStake === "0") return null // not staking this round
      const myProportion = BigNumber(myStake).div( _BigNumber.sum(...stakers.map(([_,stake])=>stake)))
      const myEarning = toDecimals(myProportion.times(oneblockReward).times(5),6)
      const suffix = numberSuffix(myRank)
      return {name, myRank, suffix, myStake, myEarning, largestStakerName, blockNumber: latestBlock}
    }).filter(x => x)
    setMyEarnings(newEarnings)
  },[isSignedIn,latestBlock])

  const earningsRows = useMemo( () => {
    if (lastProcessedBlock == null) return (
      <React.Fragment>
        <Row className='asset-holdings no-gutters'>
        <Col>
          <strong>Computing... hang tight!</strong>
        </Col>
        </Row>
        <hr/>
      </React.Fragment>
    )
    return myEarnings.map( ({name, myRank, suffix, myEarning, largestStakerName}) => {
      return (
        <React.Fragment key={name}>
          <Row className='asset-holdings no-gutters'>
            <Col md='2'>
              <ProfileImage token={name}/>
            </Col>
            <Col md='10' style={{paddingLeft: '0.5rem'}}>
              <div>{myEarning} <br/> <LinkableName name={name} /></div>
              <div><span className='badge badge-light'>{myRank}{suffix} largest</span></div>
              { myRank !== 1 && <div style={{marginTop: '0.5rem'}}> 🐋 <LinkableName name={largestStakerName} /></div> }
            </Col>
          </Row>
          <hr/>
        </React.Fragment>
      )
    })
  }, [lastProcessedBlock])
  if (!isSignedIn) return null // figure this out later
  return (
    <React.Fragment>
      <Row className='user-data-feed no-gutters justify-content-center small'>
        <Col md='10'>
          <h6 style={{marginBottom: '1rem'}}>Latest Earnings</h6>
          {earningsRows}
        </Col>
      </Row>
    </React.Fragment>
  )
}

export default function DataFeed(){
  const context = useStoreContext()
  return (
    <React.Fragment>
      <Row className='no-gutters justify-content-center'>
        <Col md='10'>
        <div className='time-to-reward'><RewardsHeadingText {...context} /></div>
        </Col>
      </Row>
      <hr/>
      <EarningsFeed  {...context} />
    </React.Fragment>
  )
}
