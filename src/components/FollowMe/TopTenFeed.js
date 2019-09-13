import React, {useState, useEffect} from 'react'
import {useFollowMeContext} from '../../contexts/FollowMe'
import {useStoreContext} from '../../contexts/Store'
import FollowMe from './'

function filterByTokens(messages, tokens = []){
  const tokenids = tokens.map( token => token.id )
  const tokenMessages = Object.values(messages).filter( message => tokenids.includes(message.tokenid) )
  return tokenMessages.reduce( (obj, message) => {
    obj[message.id] = message
    return obj
  }, {})
}

export default function TopTenFeed(){
  const {query} = useStoreContext()
  let { messages } = useFollowMeContext()
  const tokens = query.getTopTenTokensArray()
  messages = filterByTokens(messages, tokens)
  return (
      <FollowMe messages={messages} showForm={false} className='top-ten-feed'/>
  )
}