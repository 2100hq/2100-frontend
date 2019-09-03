import React, {useState, useEffect} from 'react'
import { Form, Button } from 'react-bootstrap'
import {useFollowMeContext} from '../../../contexts/FollowMe'
import {useStoreContext} from '../../../contexts/Store'

import Dots from '../../Dots'
import percentile from '../../../utils/percentile'
import {BigNumber, toDecimals, fromDecimals, weiDecimals} from '../../../utils'

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

export default function MessageForm({onSubmitted}){
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
    const resp = await actions.sendMessage(message, hint, threshold.toString())
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
    const holdings = Object.values(followers)
    let count = hasFollowers ? holdings.length : 0

    if (threshold != null && threshold !== "1"){
      count = holdings.filter( amount => {
        return BigNumber(amount).gte(threshold)
      }).length
    }

    setRecipientCount(count)

  }, [threshold, followers])

  const tokenRequirement = (
    <div style={{marginTop: '1rem'}}>
      <ThresholdInput defaultThreshold={toDecimals(threshold,15)} onChange={handleSetThreshold} /> ${myTokenName} required to decode
    </div>
  )

  function inputPlaceHolder(type = 'Post'){
    return !hasToken ? 'Create your token to send messages' : type === 'Post' ? 'Decodable Text' : 'Decodable Url'
  }

  const tabMap = {
    Post: (type='Post') => <Form.Control as="textarea" rows="6" value={message || ''} onChange={changeData} disabled={isDisabled ? 'disabled' : null} placeholder={inputPlaceHolder(type)}/>,
    Link: (type='Link') => <Form.Control as="input" value={message || ''} onChange={changeData} disabled={isDisabled ? 'disabled' : null} placeholder={inputPlaceHolder(type)}/>
  }

  const [currentTab, setTab] = useState(Object.keys(tabMap)[0])

  const tabs = Object.keys(tabMap).map( tabName => <Tab currentTab={currentTab} tabName={tabName} setTab={setTab} key={tabName} /> )

  return (
      <div className='message-form card'>
        <div className='card-body'>
          {hasToken && <ul className='nav nav-tabs'>{tabs}</ul> }
          <Form>
            <Form.Group controlId="hint" className='form-group-hint'>
              <Form.Control as="input" value={hint || ''} onChange={changeData} disabled={isDisabled ? 'disabled' : null} maxlength={75} placeholder='Public hint'/>
              <Form.Label className='small'>
                  <i className='fas fa-eye' /> Everyone
              </Form.Label>
              {/*<Form.Label className='char-count'>
                  {(hint || '').length}/{maxlength}
              </Form.Label>*/}
            </Form.Group>
            <Form.Group controlId="message">
              {currentTab ? tabMap[hasToken ? currentTab : 'Link']() : null}
              <Form.Label className='small'>
                <i className='fas fa-eye' /> {hasToken && hasFollowers && recipientCount === 0 ? 'Future' : !hasToken ? 0 : `${recipientCount}/${followerCount}`} holders
              </Form.Label>
            </Form.Group>

            <div className='clearfix'>
              <div className='float-left'>
                <div className="small">{ hasToken && tokenRequirement }</div>
              </div>
              <div className='float-right'>
                <Button variant="primary" disabled={isDisabled || isEmpty(message) ? 'disabled' : null}  onClick={handleSend}>
                  { submitting ? 'Sending' : 'Send' }
                </Button>
              </div>
            </div>
          </Form>
      </div>
    </div>
  )
}