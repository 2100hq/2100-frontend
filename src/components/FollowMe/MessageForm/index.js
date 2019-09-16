import React, {useState, useEffect} from 'react'
import { Form, Button, Row, Col, Container } from 'react-bootstrap'
import {useFollowMeContext} from '../../../contexts/FollowMe'
import {useStoreContext} from '../../../contexts/Store'

import Dots from '../../Dots'
import Meme from '../../Meme'
import memeTypes from '../memeTypes'
import percentile from '../../../utils/percentile'
import {BigNumber, toDecimals, fromDecimals, weiDecimals} from '../../../utils'
import HoldersProfiles from '../HoldersProfiles'
import MessageCard from '../MessageCard'

import './style.scss'


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
    const resp = await actions.sendMessage(message, hint, threshold.toString(), type)
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
    if (!hasToken) return 'Create your token to send messages'
    switch(type){
      case 'Post':
        return 'Decodable Text'
      case 'Link':
        return 'Decodable Url'
      case 'Meme':
        return 'Bottom Text'
    }
  }

  function PublicPlaceHolder(type = 'Post'){
    if (!hasToken) return ''
    switch(type){
      case 'Meme':
        return 'Top Text'
      default:
        return 'Public Hint'
    }
  }

  const tabMap = {
    Post: (type='Post') => <Form.Control as="textarea" rows="6" value={message || ''} onChange={changeData} disabled={isDisabled ? 'disabled' : null} placeholder={PrivatePlaceHolder(type)}/>,
    Link: (type='Link') => <Form.Control as="input" value={message || ''} onChange={changeData} disabled={isDisabled ? 'disabled' : null} placeholder={PrivatePlaceHolder(type)}/>,
    Meme: (type='Meme') => <Form.Control as="input" value={message || ''} onChange={changeData} disabled={isDisabled ? 'disabled' : null} placeholder={PrivatePlaceHolder(type)}/>
  }

  const [currentTab, setTab] = useState(Object.keys(tabMap)[2])

  const tabs = Object.keys(tabMap).map( tabName => <Tab currentTab={currentTab} tabName={tabName} setTab={setTab} key={tabName} /> )

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
                    <Form.Control as="input" value={hint || ''} onChange={changeData} disabled={isDisabled ? 'disabled' : null} maxlength={75} placeholder={publicHint}/>
                    <Form.Label className='small'>
                        <i className='fas fa-eye' /> Everyone
                    </Form.Label>
                  </Col>
                </Row>
              </Form.Group>

              <Form.Group controlId="message">
                <Row>
                  <Col>
                    {currentTab ? tabMap[hasToken ? currentTab : 'Link']() : null}
                    <Form.Label className='small'>
                      <i className='fas fa-eye' /> {footerText}
                    </Form.Label>
                  </Col>
                </Row>
              </Form.Group>

              <MemePreview {...{currentTab, memeTypes, memeType, setMemeType, hint, message}} />

              <Row className='align-items-center mt-3 mb-3'>
                <Col md='10'>
                  { hasToken && tokenRequirement }
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