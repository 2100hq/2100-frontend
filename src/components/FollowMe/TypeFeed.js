import React, {useState, useEffect, useMemo} from 'react'
import {useFollowMeContext} from '../../contexts/FollowMe'
import {useStoreContext} from '../../contexts/Store'
import FollowMe from './'
import {fromDecimals} from '../../utils'

function filterByTokens(messages, tokens = []){
  const tokenids = tokens.map( token => token.id )
  const tokenMessages = Object.values(messages).filter( message => tokenids.includes(message.tokenid) )
  return tokenMessages.reduce( (obj, message) => {
    obj[message.id] = message
    return obj
  }, {})
}

export default function ThresholdFeed({type}){
  const {query} = useStoreContext()
  let { messages } = useFollowMeContext()
  type = new RegExp(type,'i')
  messages = Object.values(messages)
  const messagesHash = messages.map(msg =>`${msg.id}+${msg.hidden}`).join('')

  const typeMessages = useMemo(()=>{
    return Object.values(messages).filter( message => type.test(message.type) )
  }, [messagesHash])

  return (
      <FollowMe messages={typeMessages} showForm={false} className='threshold-feed'/>
  )
}