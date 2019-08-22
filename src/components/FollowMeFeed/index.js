import React, {useState, useEffect} from 'react'
import {useFollowMeContext} from '../../contexts/FollowMe'
import {useStoreContext} from '../../contexts/Store'
import {get, sortBy} from 'lodash'
import { Form, Button } from 'react-bootstrap'
import { BigNumber, toDecimals } from '../../utils'
import MessageForm from './MessageForm'
import ms from 'ms'
import './style.scss'
const weiDecimals = BigNumber(10).pow(18)

function getToken(state, tokenid){
  if (!tokenid) return {}
  if (tokenid.tokenid || tokenid.id) tokenid=tokenid.tokenid || tokenid.id
  return get(state, `public.tokens.active.${tokenid}`, {})
}

function getTokenName(state, tokenid){
  if (!tokenid) return
  if (tokenid.tokenid || tokenid.id) tokenid=tokenid.tokenid || tokenid.id
  return get(state, `public.tokens.active.${tokenid}.name`)
}

function invisibleSubtext({name, token, message, isSignedIn, state, decodeMessage=()=>{}}){
  const defaultSubtext = <span>holders of {toDecimals(message.threshold,3,0)} <span className='token-name'>{name}</span></span>
  if (!isSignedIn) return defaultSubtext

  const available = get(token, 'balances.available', "0")
  const diff = BigNumber(message.threshold).minus(available)
  let timeToDecode = null

  function handleClick(e){
    e.preventDefault()
    decodeMessage(message.id)
  }

  if (BigNumber(token.myStake).gt(0) && diff.gt(0)){
    const divisor = BigNumber(token.myStake).div(token.totalStakes).times(0.9).times(0.00021).times(weiDecimals)
    const blocks = diff.div(divisor).dp(0,0).toNumber()
    timeToDecode = (<span>({ms(blocks*15000)} to go)</span>)
  }
  if (diff.gt(0)) return <span>need {toDecimals(diff, 3, 0)} <span className='token-name'>{name}</span> {timeToDecode}</span>
  return <span>you have enough {name} to <a href="#" onClick={handleClick}>decode</a></span>
}

function visibleSubtext(name, message, myToken){
  let count = message.recipientcount
  const isOwner = myToken && myToken.id === message.tokenid
  const displayName = isOwner ? 'your token' : <span className='token-name'>{name}</span>

  // didnt store recipient count
  if (count == null) return <span>some holders of <span className='token-name'>{name}</span></span>

  count = isOwner ? count : `${count === 0 ? 'no' : count-1} other`

  return <span>{count} holders of {displayName}</span>
}

function MessageCard({message, myToken, state, isSignedIn, actions}){
  const [decoding, setDecoding] = useState(false)
  async function decodeMessage(id){
    setDecoding(true)
    const message = await actions.getMessage(id)
    setDecoding(false)
  }

  const token = getToken(state, message.tokenid)
  const name = token.name || 'unknown'
  const text = message.hidden ? '■■■■■■■■■■■■' : message.message
  const subtext = decoding ? 'decoding...' : message.hidden ? invisibleSubtext({name, token, message, isSignedIn, decodeMessage}) : visibleSubtext(name, message, myToken)
  return (
    <div className='message card' key={message.id}>
      <div className={`card-body ${message.hidden ? 'text-muted more-text-muted' : ''}`}>
        <div className='message-header text-muted'>
          <span className='token-name'>{name}</span>
          <span className='message-divider'> · </span>
          <span className='message-time text-muted'>{ms(Date.now()-message.created)}</span>
        </div>
        <div className='message-body'>
          <p>{text}</p>
        </div>
        <div className='message-footer small text-muted'>
            <i className='fas fa-eye' />  {subtext}
        </div>
      </div>
    </div>
   )
}

export default function FollowMeFeed(){
  const {state} = useStoreContext()
  let { api, isSignedIn, myToken, messages = {}, publicMessages = {}, decodedMessages = {}, followers = {}, actions } = useFollowMeContext()

  messages = { ...publicMessages, ...messages, ...decodedMessages }
  messages = Object.values(sortBy(messages, msg => msg.created * -1))
  messages = messages.map( message => <MessageCard message={message} myToken={myToken} state={state} isSignedIn={isSignedIn} actions={actions} key={message.id+(message.hidden||'visible')}/>)

  return (
    <div>
        { state.private.isSignedIn && <MessageForm myTokenName={getTokenName(state, myToken)}/> }
        <div className="card">
          <div className="card-body">
            {messages}
          </div>
        </div>
    </div>
  )
}