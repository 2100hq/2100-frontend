import React, {useState, useEffect} from 'react'
import {useFollowMeContext} from '../../contexts/FollowMe'
import {useStoreContext} from '../../contexts/Store'
import {get, sortBy} from 'lodash'
import { Form, Button } from 'react-bootstrap'
import { BigNumber, toDecimals } from '../../utils'
import MessageForm from './MessageForm'
import './style.scss'

function getTokenName(state, tokenid){
  if (!tokenid) return
  if (tokenid.tokenid || tokenid.id) tokenid=tokenid.tokenid || tokenid.id
  return get(state, `public.tokens.active.${tokenid}.name`)
}

function getDisplayName(state, tokenid){
  const name = getTokenName(state,tokenid)
  return <span><span className='text-muted'>$</span>{name}</span>
}


function invisibleSubtext(name, message){
  return <span>holders of {toDecimals(message.threshold,3,0)} {name}</span>
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

function MessageCard({message, myToken, state}){
  const name = getDisplayName(state, message.tokenid)
  const text = message.hidden ? '■■■■■■■■■■■■' : message.message
  const subtext = message.hidden ? invisibleSubtext(name, message) : visibleSubtext(name, message, myToken)

  return (
    <div className='card' key={message.id}>
      <div className={`card-body ${message.hidden ? 'text-muted more-text-muted' : ''}`}>
        <h5 className='card-title'>{name} <span className='small'>3m</span></h5>
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
  let { api, isSignedIn, myToken, messages = {}, publicMessages = {}, followers = {}, actions } = useFollowMeContext()

  messages = { ...publicMessages, ...messages }
  messages = Object.values(sortBy(messages, msg => msg.created * -1))
  messages = messages.map( message => <MessageCard message={message} myToken={myToken} state={state} />)

  return (
    <div>
        { state.private.isSignedIn && <MessageForm myTokenName={getTokenName(state, myToken)}/> }
        {messages}
    </div>
  )
}