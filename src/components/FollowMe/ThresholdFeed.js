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

export default function ThresholdFeed({maxThreshold="2100", minThreshold="0"}){
  const {query} = useStoreContext()
  let { messages } = useFollowMeContext()
  maxThreshold = useMemo(()=>fromDecimals(maxThreshold), [maxThreshold])
  minThreshold = useMemo(()=>fromDecimals(minThreshold), [minThreshold])
  messages = Object.values(messages).filter( message => maxThreshold.gte(message.threshold) && minThreshold.lte(message.threshold) )

  return (
      <FollowMe messages={messages} showForm={false} className='threshold-feed'/>
  )
}