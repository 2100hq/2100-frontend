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

const cheap = fromDecimals("0.00021")

export default function CheapFeed(){
  const {query} = useStoreContext()
  let { messages } = useFollowMeContext()
  let cheapMessages = Object.values(messages).filter( message => cheap.gte(message.threshold) )

  return (
      <FollowMe messages={cheapMessages} showForm={false} className='cheap-feed'/>
  )
}