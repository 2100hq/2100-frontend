import React, {useState, useEffect} from 'react'
import {useFollowMeContext} from '../../contexts/FollowMe'
import {useStoreContext} from '../../contexts/Store'
import {get, sortBy} from 'lodash'
import { Form, Button } from 'react-bootstrap'
import { toDecimals } from '../../utils'
import MessageForm from './MessageForm'
import './style.scss'

function getUserName(state, tokenid){
  const token = get(state, `public.tokens.active.${tokenid}`)
  // if (get(state, 'private.me.id').toLowerCase() === token.ownerAddress.toLowerCase()) return 'You'
  return <span><span className='text-muted'>$</span>{token.name}</span>
}


function invisibleMessage(name, message){
  return `holders of ${toDecimals(message.threshold)} ${name}`
}

function MessageCard({message, state}){
  const name = getUserName(state, message.tokenid)
  const text = message.hidden ? '■■■■■■■■■■■■' : message.message
  const context = message.hidden ? invisibleMessage(name, message) : <span>{(message.recipientcount || 99)-1} other holders of {name}</span>
  const className = message.hidden ? 'hidden-message' : 'visible-message'
  return (
    <div className='card' key={message.id}>
      <div className={`card-body ${message.hidden ? 'text-muted more-text-muted' : ''}`}>
        <h5 className='card-title'>{name} <span className='small'>3m</span></h5>
        <p className='card-text'>{text}</p>
        <h6 className='card-subtitle mb-2 text-muted small'>
          <i className='fas fa-eye' />  {context}
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
  messages = messages.map( message => <MessageCard message={message} state={state} />)

  return (
    <div>
        { state.private.isSignedIn && <MessageForm /> }
        {messages}
    </div>
  )
}