import React, {useMemo, useState, useEffect} from 'react'
import { useStoreContext } from '../../contexts/Store'
import _BigNumber from 'bignumber.js'
import { BigNumber, toDecimals, oneblockReward, numberSuffix } from '../../utils'
import ms from 'ms'
import {get} from 'lodash'
import {Row, Col} from 'react-bootstrap'
import ProfileImage from '../ProfileImage'
import LinkableName from '../LinkableName'
import { useCountUp } from 'react-countup'
import './style.scss'
const isDev = !/alpha/.test(window.location.href)

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

function useBlockCountdown(state){
  const latestBlock = get(state, 'public.latestBlock.number', 0)
  const blocksToGo = 5-latestBlock % 5
  const maxTimeToGo = 5 * 15000
  const timeToGo = blocksToGo*15000
  const [msToGo, setMsToGo] = useState(timeToGo)

  useEffect(()=>{
    if (blocksToGo === 5) setMsToGo(maxTimeToGo)
    const id = setInterval(() => {
      setMsToGo(current => {
        // progress bar is behind blocks
        if (current>timeToGo) {
          let inc = 500
          if (current-timeToGo > 5000) inc = 1000
          if (current-timeToGo > 10000) inc = 2000
          if (current-timeToGo > 20000) inc = 10000
          return current-inc
        }
        // if blocks are behind progress bar let progress bar go a bit
        if (timeToGo-current < 5000) return current-200
        return current
      })
    },1000)
    return () => clearInterval(id)
  }, [latestBlock])

  return {
    percent: useMemo( () => msToGo == 0 ? 0 : String((msToGo/maxTimeToGo)*100), [msToGo] ),
    blocksToGo,
    maxTimeToGo,
    msToGo
  }
}

function RewardsHeadingText({state}){
  const {
    latestBlock,
    percent,
    blocksToGo,
    maxTimeToGo,
    msToGo
  } = useBlockCountdown(state)

  const emojis = ["","🕘","🕖","🕓","🕐"]

  let textToGo = blocksToGo === 5 && latestBlock !== 0 && maxTimeToGo-msToGo > 4000 ? `🎉 Issuing rewards` : `Next reward`

  return (
    <React.Fragment>
      <Row className='small text-muted mb-2'>
        <Col>
          {blocksToGo < 5 ? emojis[blocksToGo] : emojis[4]} {textToGo}
        </Col>
      </Row>
      <Row className='small'>
        <Col md='12'>      
        <div class="progress">
          <div class="progress-bar" role="progressbar" style={{width: String(percent)+'%'}} aria-valuenow="75" aria-valuemin="0" aria-valuemax="100">
          </div>
        </div>
        </Col>
      </Row>
    </React.Fragment>
  )
}

function EarningsFeed({state, query}){
  const isSignedIn = query.getIsSignedIn()
  const hasToken = Boolean(query.getMyToken())
  const latestBlock = get(state, 'public.latestBlock.number', null)
  const [myEarnings, setMyEarnings] = useState()
  const [lastProcessedBlock, setLastProcessedBlock] = useState()
  useEffect(()=> {
    if (!isSignedIn) return
    if (latestBlock == null) return
    if (!isDev && latestBlock%5!==0) return
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
    if (lastProcessedBlock == null || !isSignedIn || !hasToken) {
      let text = "Waiting for next rewards... hang tight!"
      if (!hasToken) text = <span>Link your Twitter to see your stats</span>
      if (!isSignedIn) text = <span>Sign in to see your stats</span>
      return (
        <React.Fragment>
          <Row className='asset-holdings no-gutters'>
          <Col>
            <strong>{text}</strong>
          </Col>
          </Row>
          <hr/>
        </React.Fragment>
      )
    }
    return myEarnings.map( ({name, myRank, suffix, myEarning, largestStakerName}) => {
      return (
        <React.Fragment key={name}>
        <div className='asset-holdings'>
        <Row className='no-gutters'>
          <Col className='pl-2' md='2'>
            <ProfileImage name={name}/>
          </Col>
          <Col className='pl-2' md='10'>
            <Row className=' no-gutters align-items-center'>
              <Col md='12'>
              <strong>
              <CountUp balance={myEarning} /> <LinkableName name={name} />
              </strong>
              </Col>
            </Row>
            <Row className='no-gutters mt-1'>
              <Col>
                  <Row>
                  <Col sm='2'><span className='badge badge-light stake-rank'>Top</span></Col>
                  <Col>
                    <LinkableName name={largestStakerName} />
                  </Col>
                  </Row>
                  { myRank !== 1 && (
                    <React.Fragment>
                    <Row>
                      <Col sm='2'>
                        <span className='badge badge-light stake-rank'>{myRank}{suffix}</span>
                      </Col>
                      <Col>
                        me
                      </Col>
                      </Row>
                    </React.Fragment>
                  )}
              </Col>            
            </Row>
          </Col>
        </Row>

        </div>
        </React.Fragment>
      )
    })
  }, [lastProcessedBlock, isSignedIn, hasToken])

  return (
    <React.Fragment>
      <Row className='user-data-feed justify-content-center small'>
        <Col md='12' className='ml-4'>
          <h6 style={{marginBottom: '1rem',}}>Latest Earnings</h6>
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
