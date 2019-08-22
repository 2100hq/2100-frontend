import React, {useState, useEffect} from 'react'
import {useFollowMeContext} from '../../contexts/FollowMe'
import {useStoreContext} from '../../contexts/Store'
import {get, sortBy} from 'lodash'
import { Form, Button } from 'react-bootstrap'
import { BigNumber, toDecimals } from '../../utils'
import MessageForm from './MessageForm'
import './style.scss'

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

function getDisplayName(state, tokenid){
  const name = getTokenName(state,tokenid)
  return <span>${name}</span>
}


function invisibleSubtext({name, token, message, isSignedIn, state, decodeMessage=()=>{}}){
  const defaultSubtext = <span>holders of {toDecimals(message.threshold,3,0)} {name}</span>
  if (!isSignedIn) return defaultSubtext

  const available = get(token, 'balances.available', "0")
  const diff = BigNumber(message.threshold).minus(available)
  function handleClick(e){
    e.preventDefault()
    decodeMessage(message.id)
  }
  if (diff.gt(0)) return <span>get {toDecimals(diff, 3, 0)} {name} to see</span>
  return <span>you have enough {name} to <a href="#" onClick={handleClick}>decode</a></span>
}

function visibleSubtext(name, message, myToken){
  let count = message.recipientcount
  const isOwner = myToken && myToken.id === message.tokenid
  name = isOwner ? 'your token' : name

  // didnt store recipient count
  if (count == null) return <span>some holders of {name}</span>

  count = isOwner ? count : `${count-1} other`

  return <span>{count} holders of {name}</span>
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
    <div className='card' key={message.id}>
      <div className={`card-body ${message.hidden ? 'text-muted more-text-muted' : ''}`}>
        <div><span className='token-name medium'>{name}</span> <span className='small'>3m</span></div>
        <p className='card-text'>{text}</p>
        <h6 className='card-subtitle mb-2 text-muted small'>
          <i className='fas fa-eye' />  {subtext}
        </h6>
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
        {messages}
    </div>
  )
}