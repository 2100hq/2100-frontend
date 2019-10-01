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

const giftHintText = "I am gifting"
const giftRdedeemText = "To redeem"

function isEmpty(message){
  if (!message) return true
  return message.replace(/\s+/, '') === ''
}

const contentLevels = [
  {level: 0,  name: 'Mediocre', holderType: 'New Holder'},
  {level: 5, name: 'Regular', holderType: '🐟 Minnow'},
  {level: 50, name: 'Premium', holderType: '🦈 Shark'},
  {level: 75, name: 'Exclusive', holderType: '🐋 Whale'},
  {level: 95, name: 'Ultra Exclusive', holderType: '🦄 Unicorn'}
]

function ContentLevelSelect({ levels=[], current=0, onChange=()=>{}}){

  function handleChange(e){
    e.preventDefault()
    onChange(e.target.value)
  }

  const options = levels.map( (data, i) =>{
    return <option value={i}>{data.name}</option>
  })
  return (
    <select className="form-control content-level-select" value={current} onChange={handleChange}>
      {options}
    </select>
  )

}

function calcTimeToSee({levels=[], current=0, amounts=[], threshold}){
  levels.forEach( data => {
    let amount = BigNumber(1)
    if (data.level !== 0){
      amount = getPercentile(amounts, data.level, true)
    }
    data.amount = amount
  })
  threshold = BigNumber(threshold)
  const blockReward = BigNumber("0.00021").times(weiDecimals)
  const blockTime = 15000
  const minBlock = 1
  levels.forEach( data => {
    if (isNaN(threshold)) return data.timeToSee = 'n/a'
    let blocksToSee = BigNumber(threshold).minus(data.amount).div(blockReward)
    blocksToSee = threshold.eq(data.amount) ? BigNumber(0) : blocksToSee
    blocksToSee = blocksToSee.eq(0) && current === 0 ? BigNumber(1) : blocksToSee.lt(0) ? BigNumber(0) : blocksToSee
    const timeToSee = Math.ceil(blocksToSee.times(blockTime).toNumber())
    data.timeToSee = timeToSee === 0 ? "now" : ms(timeToSee)
  })
  return levels
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

function Prepend({type, isHint = true}){
  switch (type){
    case 'Gift':
      const text = isHint ? giftHintText : giftRdedeemText
      return (
        <InputGroup.Prepend>
          <InputGroup.Text>{text}</InputGroup.Text>
        </InputGroup.Prepend>
      )
    default:
      return null
  }
}

function MemeSelect({memeTypes, memeType, onChange=()=>{}}){
  function handleChange(e){
    e.preventDefault()
    onChange(e.target.value)
  }

  const options = memeTypes.map( (data,i)=>{


    return <option value={i}>{data.emoji} {data.name}</option>
  })
  return (
    <select className="form-control meme-type-select" value={memeType} onChange={handleChange}>
      {options}
    </select>
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
  const sliderMax = useMemo(() => Number(toDecimals(getPercentile(holderAmounts, contentLevels[3].level))), [followerHash])
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
    const type = /meme/i.test(currentTab) ? `meme:${memeTypes[memeType].key}` : currentTab.toLowerCase()
    const _hint = /gift/i.test(currentTab) ? `${giftHintText} ${hint}` : hint
    const _message = /gift/i.test(currentTab) ? `${giftRdedeemText} ${message}` : message

    const resp = await actions.sendMessage({message:_message, hint: _hint, threshold:threshold.toString(), type})
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

  useEffect(()=>{
    calcTimeToSee({levels:contentLevels,current:contentLevel,amounts:holderAmounts, threshold})
  }, [threshold])

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

  // if (hasToken && hasFollowers && recipientCount === 0){
  //    footerText = 'Future holders'
  // } else if (hasToken) {
  //   footerText = <HoldersProfiles holders={recipients} prefix="Visible to " suffix=" right now"/>
  // } else {
  //   footerText = '0 holders'
  // }

  const publicHint = PublicPlaceHolder(currentTab)

  const [memeType, setMemeType] = useState(0)

  return (
        <div  className="message-form">
            <ul className='nav nav-pills mt-2'>{tabs}</ul>
            <Form>
              <Form.Group controlId="hint" className='form-group-hint'>
                <Row>
                  <Col>
                      <Row>
                        <Col>
                          <Form.Label className='small'>
                              <i className='fas fa-eye' /> Visible to everyone
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

              <Form.Group controlId="message">
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