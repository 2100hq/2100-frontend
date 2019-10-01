import React, {useState, useEffect, useMemo} from 'react'
import { Form, Button, Row, Col, Container, InputGroup } from 'react-bootstrap'
import {useFollowMeContext} from '../../../contexts/FollowMe'
import {useStoreContext} from '../../../contexts/Store'
import { Link } from 'react-router-dom'
import Slider from '@material-ui/core/Slider'
import ms from 'ms'

import Dots from '../../Dots'
import Meme from '../../Meme'
import memeTypes from '../memeTypes'
import getPercentile from '../../../utils/percentile'
import {BigNumber, toDecimals, fromDecimals, weiDecimals} from '../../../utils'
import HoldersProfiles from '../HoldersProfiles'

import './style.scss'

function isEmpty(message){
  if (!message) return true
  return message.replace(/\s+/, '') === ''
}

const levels = [
  {level: 0, holderType: 'New Staker'},
  {level: 'avg', holderType: 'Average Holder'},
  {level: 100, holderType: 'Largest Holder'}
]

const blockReward = BigNumber("0.00021").times(weiDecimals).times(5)
const blockTime = 15000*5
const minBlock = BigNumber(1)

function calcTimeToSee({levels=[], amounts=[], threshold}){
  levels = levels.map( data => {
    data = {...data}
    let amount = BigNumber(1)
    if (data.level > 0 && data.level < 100 && data.level !== 'avg'){
      amount = getPercentile(amounts, data.level, true)
    } else if (data.level === 100){
      if (amounts.length > 0) amount = amounts[amounts.length-1]
    } else if (data.level === 'avg'){
      amount = amounts[Math.floor(amounts.length/2)] || BigNumber(1)
    }
    data.amount = amount
    return data
  })
  threshold = (!threshold || threshold === "" || isNaN(threshold)) ? BigNumber(1) : BigNumber(threshold)
  return levels.map( data => {
    data = {...data}
    let blocksToSee =  threshold.eq(data.amount) ? BigNumber(0) : BigNumber(threshold).minus(data.amount).div(blockReward)
    if (blocksToSee.lt(0)) blocksToSee = BigNumber(0)
    const timeToSee = Math.ceil(blocksToSee.times(blockTime).toNumber())
    data.timeToSee = timeToSee === 0 ? "now" : ms(timeToSee)
    return data
  })
}

function ThresholdInput({defaultThreshold, onChange = ()=>{}}){
  return <input type='number' step="0.01" min="0" className="threshold-input" value={defaultThreshold} onChange={ (e) => onChange(e.target.value)} />
}

function Tab({currentTab, tabName, setTab}){
  function handleClick(e){
    e.preventDefault()
    setTab(tabName)
  }
  const isActive = currentTab === tabName
  return(
    <li className='nav-item' key={tabName}>
      <a
        className={`nav-link ${isActive && 'active'}`}
        onClick={handleClick}
        href="#"
      >
        {tabName}
      </a>
    </li>
  )
}

export default function MessageForm({onSubmitted}){
  const {query} = useStoreContext()

  let { api, isSignedIn, myToken, messages = {}, publicMessages = {}, followers = {}, actions } = useFollowMeContext()

  const myTokenName=query.getTokenName(myToken)
  let holderAmounts =  Object.values(followers)

  const followerHash = holderAmounts.join('')

  // sort amounts
  holderAmounts = useMemo(() =>holderAmounts.sort(function (a, b) { return BigNumber(a).minus(BigNumber(b)).gt(0) ? 1 : -1 }), [followerHash])
  const followerCount = holderAmounts.length
  const [submitting, setSubmitting] = useState(false)

  const [data, setData] = useState({})
  const { message, hint } = data
  const [error, setError] = useState()
  const [contentLevel, setContentLevel] = useState(0)

  const [threshold, setThreshold] = useState(fromDecimals("0.00021"))

  const [recipientCount, setRecipientCount] = useState(0)
  const [recipients, setRecipients] = useState([])

  const hasToken = myToken != null
  const hasFollowers = myToken && followerCount > 0

  const isDisabled = !hasToken || submitting


  function changeData(e){
    const { id, value } = e.target
    setData({
      ...data,
      [id]: value
    })
  }

  async function handleSend(e){
    e.preventDefault()
    if (isEmpty(message) || isNaN(threshold)) return
    setSubmitting(true)
    const type = currentTab.toLowerCase()

    const resp = await actions.sendMessage({message, hint, threshold:threshold.toString(), type})
    setSubmitting(false)
    if (resp) {
      setData({})
      onSubmitted && onSubmitted(resp)
    }
  }

  function handleSetThreshold(val){
    let newThresh = BigNumber(val).times(weiDecimals)
    if (newThresh.eq(0)){
      newThresh = "1"
    }

    setThreshold(newThresh.toString())
  }

  const contentLevels = useMemo(()=>{
    return calcTimeToSee({levels,amounts:holderAmounts, threshold})
  }, [threshold, followerHash])

  const thresholdNumber = useMemo( ()=> Number(toDecimals(threshold,15)), [threshold])

  const tokenRequirement = (
      <Row>
        <Col>
          <ul className='holders-coda small'>
            <div style={{marginBottom: '0.5rem'}}>Time to decode:</div>
            {contentLevels.map( data => {
              return (
                <li style={{cursor: 'pointer'}} onClick={()=> { setThreshold(data.amount) }} >{data.holderType}: <span style={{fontWeight: 'bold'}}>{data.timeToSee || "Calculating"}</span></li>
              )
            })}
          </ul>
        </Col>
      </Row>
  )

  function PrivatePlaceHolder(type = 'Post'){
    switch(type){
      case 'Post':
        return 'Hidden Message'
      case 'Link':
        return 'Hidden Url'
    }
  }

  function PublicPlaceHolder(type = 'Post'){
    switch(type){
      default:
        return 'Headline'
    }
  }

  function PrivateControlType(type = 'Post'){
    switch(type){
      case 'Post':
        return 'textarea'
      default:
        return 'input'
    }
  }

  const tabNames = [
    'Post', 'Link'
  ]

  const [currentTab, setTab] = useState(tabNames[0])

  const tabs = tabNames.map( tabName => <Tab currentTab={currentTab} tabName={tabName} setTab={setTab} key={tabName} /> )

  let footerText = null

  const publicHint = PublicPlaceHolder(currentTab)

  return (
        <div  className="message-form">
            <ul className='nav nav-pills mt-2'>{tabs}</ul>
            <Form>
              <Form.Group controlId="hint" className='form-group-hint'>
                <Row>
                  <Col>
                      <Row>
                        <Col>
                          <Form.Label>
                              visible to everyone
                          </Form.Label>
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                          <Form.Control as="input" value={hint || ''} onChange={changeData} disabled={isDisabled ? 'disabled' : null} maxlength={120} placeholder={publicHint}/>
                        </Col>
                      </Row>
                  </Col>
                </Row>
              </Form.Group>

              <Form.Group className='post-body' controlId="message">
                <Row>
                  <Col>
                    <Form.Label className='small'>
                      hold {footerText} <ThresholdInput defaultThreshold={thresholdNumber} onChange={handleSetThreshold} /> ${myTokenName} to see
                    </Form.Label>
                  </Col>
                </Row>
                <Row>
                  <Col>
                      <Form.Control as={PrivateControlType(currentTab)} rows="6" value={message || ''} onChange={changeData} disabled={isDisabled ? 'disabled' : null} placeholder={PrivatePlaceHolder(currentTab)}/>
                  </Col>
                </Row>
              </Form.Group>
              <Row>
                <Col>
                  { hasToken ? tokenRequirement : <Link className="create-token-message" to={ isSignedIn ? "/manage" : '/' }><i class="fas fa-bolt"></i> {isSignedIn ? 'Create your token to' : 'Sign in to'} send messages</Link> }
                </Col>
              </Row>
              <Button className='compose-submit-button' variant="primary" disabled={isDisabled || isEmpty(message) || isNaN(threshold) || threshold == null? 'disabled' : null} type="submit" onSubmit={handleSend} onClick={handleSend}>
                { submitting ? 'Sending' : 'Send' }
              </Button>
            </Form>
      </div>
  )
}