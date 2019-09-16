import React, {useState, useEffect} from 'react'
import { Form, Button, Row, Col, Container, InputGroup } from 'react-bootstrap'
import {useFollowMeContext} from '../../../contexts/FollowMe'
import {useStoreContext} from '../../../contexts/Store'
import { Link } from 'react-router-dom'

import Dots from '../../Dots'
import Meme from '../../Meme'
import memeTypes from '../memeTypes'
import percentile from '../../../utils/percentile'
import {BigNumber, toDecimals, fromDecimals, weiDecimals} from '../../../utils'
import HoldersProfiles from '../HoldersProfiles'
import MessageCard from '../MessageCard'

import './style.scss'

const giftHintText = "I am gifting"
const giftRdedeemText = "To redeem"

function isEmpty(message){
  if (!message) return true
  return message.replace(/\s+/, '') === ''
}

const percentiles = [0, 5, 25, 50, 95]

function ThresholdInput({defaultThreshold, onChange = ()=>{}}){
  return <input type='number' step="0.01" min="0" className="threshold-input" defaultValue={defaultThreshold} onChange={ (e) => onChange(e.target.value)} />
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

export default function MessageForm({onSubmitted, replyid}){
  const {query} = useStoreContext()

  let { api, isSignedIn, myToken, messages = {}, publicMessages = {}, followers = {}, actions } = useFollowMeContext()

  const myTokenName=query.getTokenName(myToken)

  const followerCount = Object.keys(followers).length
  const [submitting, setSubmitting] = useState(false)

  const [data, setData] = useState({})
  const { message, hint } = data
  const [error, setError] = useState()
  const [level, setLevel] = useState(0)
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
    if (isEmpty(message)) return
    setSubmitting(true)
    const type = /meme/i.test(currentTab) ? `meme:${memeTypes[memeType].key}` : currentTab.toLowerCase()
    const _hint = /gift/i.test(currentTab) ? `${giftHintText} ${hint}` : hint
    const _message = /gift/i.test(currentTab) ? `${giftRdedeemText} ${message}` : message

    const resp = await actions.sendMessage(_message, _hint, threshold.toString(), type)
    setSubmitting(false)
    if (resp) {
      setData({})
      onSubmitted && onSubmitted(resp)
    }
  }

  function handleSetLevel(i){
    setLevel(Number(i))
  }

  function handleSetThreshold(val){
    let newThresh = BigNumber(val).times(weiDecimals)
    if (newThresh.eq(0)){
      newThresh = "1"
    }
    setThreshold(newThresh.toString())
  }

  useEffect( () => {
    const holdings = Object.entries(followers)
    let count = hasFollowers ? holdings.length : 0
    let recipients = []
    if (threshold != null){
      recipients = holdings.filter( ([address, amount]) => {
        return BigNumber(amount).gte(threshold)
      }).map( ([address]) => address )
      count = recipients.length
    }
    setRecipients(recipients)
    setRecipientCount(count)

  }, [threshold, followers])

  const tokenRequirement = (
    <div>
      <ThresholdInput defaultThreshold={toDecimals(threshold,15)} onChange={handleSetThreshold} /> ${myTokenName} required to decode
    </div>
  )

  function PrivatePlaceHolder(type = 'Post'){
    switch(type){
      case 'Post':
        return 'Decodable Text'
      case 'Image':
        return 'Link to image'
      case 'Video':
        return 'Link to video'
      case 'Link':
        return 'Decodable Url'
      case 'Meme':
        return 'Bottom Text'
      case 'Gift':
        return 'DM me with the message I HODL YOU'
    }
  }

  function PublicPlaceHolder(type = 'Post'){
    switch(type){
      case 'Meme':
        return 'Top Text'
      case 'Gift':
        return 'a free T-shirt'
      default:
        return 'Public Hint'
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
    'Post', 'Image', 'Video', 'Link', 'Meme', 'Gift'
  ]

  const [currentTab, setTab] = useState(tabNames[2])

  const tabs = tabNames.map( tabName => <Tab currentTab={currentTab} tabName={tabName} setTab={setTab} key={tabName} /> )

  let footerText = null

  if (hasToken && hasFollowers && recipientCount === 0){
     footerText = 'Future holders'
  } else if (hasToken) {
    footerText = <HoldersProfiles holders={recipients} prefix="Visible to " />
  } else {
    footerText = '0 holders'
  }

  const publicHint = PublicPlaceHolder(currentTab)

  const [memeType, setMemeType] = useState(0)

  const MemeSelect = function ({memeTypes, memeType, onChange=()=>{}}){
    function handleChange(e){
      e.preventDefault()
      onChange(e.target.value)
    }

    const options = memeTypes.map( (data,i)=>{


      return <option value={i} selected={i === memeType}>{memeTypes[i].name}</option>
    })
    return (
      <select defaultValue={memeType} onChange={handleChange}>
        {options}
      </select>
    )
  }


  function MemePreview({currentTab, memeTypes, memeType, setMemeType, hint, message}){
    if (currentTab !== 'Meme') return null
    return [
      <MemeSelect memeTypes={memeTypes} memeType={memeType} onChange={setMemeType} key='meme-select'/>,
      <Meme toptext={hint} bottomtext={message} url={memeTypes[memeType].url} key='meme-image'/>
    ]
  }

  return (
        <>
            { replyid && <div style={{width: '50%'}}><MessageCard {...{message: messages[replyid], myToken, token: query.getToken(messages[replyid].tokenid), isSignedIn, actions, canCopyUrl:false, canLinkToProfile:false, canComment: false, showFooter: false}} /></div> }


            { <ul className='nav nav-pills mt-3 mb-3'>{tabs}</ul> }

            <Form>
              <Form.Group controlId="hint" className='form-group-hint'>
                <Row>
                  <Col>
                    <InputGroup>
                      <Prepend type={currentTab} isHint={true} />
                      <Form.Control as="input" value={hint || ''} onChange={changeData} disabled={isDisabled ? 'disabled' : null} maxlength={75} placeholder={publicHint}/>
                    </InputGroup>
                    <Form.Label className='small'>
                        <i className='fas fa-eye' /> Everyone
                    </Form.Label>
                  </Col>
                </Row>
              </Form.Group>

              <Form.Group controlId="message">
                <Row>
                  <Col>
                    <InputGroup>
                      <Prepend type={currentTab} isHint={false} />
                      <Form.Control as={PrivateControlType(currentTab)} rows="6" value={message || ''} onChange={changeData} disabled={isDisabled ? 'disabled' : null} placeholder={PrivatePlaceHolder(currentTab)}/>
                    </InputGroup>
                    <Form.Label className='small'>
                      <i className='fas fa-eye' /> {footerText}
                    </Form.Label>
                  </Col>
                </Row>
              </Form.Group>

              <MemePreview {...{currentTab, memeTypes, memeType, setMemeType, hint, message}} />

              <Row className='align-items-center mt-3 mb-3'>
                <Col md='10'>
                  { hasToken ? tokenRequirement : <Link className="create-token-message" to={ isSignedIn ? "/manage" : '/' }><i class="fas fa-bolt"></i> {isSignedIn ? 'Create your token to' : 'Sign in to'} send messages</Link> }
                </Col>
                <Col md='2'>
                  <Button variant="primary" disabled={isDisabled || isEmpty(message) ? 'disabled' : null} type="submit" onSubmit={handleSend} onClick={handleSend}>
                    { submitting ? 'Sending' : 'Send' }
                  </Button>
                </Col>
              </Row>
            </Form>
      </>
  )
}