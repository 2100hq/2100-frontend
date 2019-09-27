import React, {useMemo} from 'react'
import { useStoreContext } from '../../contexts/Store'
import { BN, toDecimals } from '../../utils'
import ms from 'ms'
import {get} from 'lodash'
import {Row, Col} from 'react-bootstrap'
import ProfileImage from '../ProfileImage'

function RewardsHeadingText({state}){
  const latestBlock = get(state, 'public.latestBlock.number', 0)
  const blocksToGo = 5-latestBlock % 5
  let timeToGo = useMemo( () => ms(blocksToGo * 15000), [latestBlock])
  if (latestBlock === 0) timeToGo = 'Some time'
  const emojis = ["","🕘","🕖","🕓","🕐","🎉"]

  const textToGo = blocksToGo === 5 && latestBlock !== 0 ? `Issuing rewards` : `${timeToGo} to next reward`
  return `${emojis[blocksToGo]} ${textToGo}`
}

function RewardsFeed(){
  const { state, query } = useStoreContext()
  const isSignedIn = query.getIsSignedIn()

  if (!isSignedIn) return null // figure this out later

  const useraddress = query.getUserAddress().toLowerCase()
  const holdings = {...get(state, 'stats.earned.latest',{})}
  delete holdings['2100']

  const myHoldings = Object.entries(holdings).filter( ([_, holders]) => {
    return Object.keys(holders).includes(useraddress)
  }).map( ([name, holders]) => {
    holders = Object.entries(holders).filter( ([address]) => address !=name ).sort( (a, b) => BN(a[1]).lt(b[1]) ? -1 : 1)
    const largestHolderAdderss = holders[holders.length - 1][0]
    let largestHolderName = query.getUserName(largestHolderAdderss) || largestHolderAdderss
    let myRank = 0
    let myHolding = "0.00"
    holders.forEach( ([address, holding], i) => {
      if (address === useraddress) console.log({name, address, useraddress, i})
      if (address === useraddress) {
        myRank = holders.length - i
        myHolding = toDecimals(holding,6)
      }
    })
    myRank = myRank + 1
    const suffix = myRank % 10 === 1 ? 'st' : myRank % 10 === 2 ? 'nd' : myRank % 10 === 3 ? 'rd' : 'th'
    return {name, myRank, suffix, myHolding, largestHolderName}
  })

  const holdingsRows = myHoldings.map( ({name, myRank, myHolding, suffix, largestHolderName}) => {
    return (
      <React.Fragment>
        <Row className='asset-holdings no-gutters'>
          <Col md='2'>
            <ProfileImage token={name}/>
          </Col>
          <Col md='10' style={{paddingLeft: '0.5rem'}}>
            <div><strong>${name}</strong></div>
            <div>you hold:</div>
            <div>{myHolding} ${name} ({myRank}{suffix})</div>
            { myRank !== 1 && <div>top staker: <br/> ${largestHolderName}</div> }
          </Col>
        </Row>
        <hr/>
      </React.Fragment>
    )
  })

  return (
    <React.Fragment>
      <Row className='no-gutters justify-content-center'>
        <Col md='10'>
        <div className='time-to-reward'><RewardsHeadingText state={state} /></div>
        </Col>
      </Row>
      <hr/>
      <Row className='user-data-feed no-gutters justify-content-center small'>
        <Col md='10'>
          <h6>Your Holdings</h6>
          {holdingsRows}
        </Col>
      </Row>
    </React.Fragment>
  )
}

export default function DataFeed(){
  return <RewardsFeed />
}
