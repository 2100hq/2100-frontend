import React, {useState, useEffect, useMemo} from 'react'
import {useFollowMeContext} from '../../contexts/FollowMe'
import {useStoreContext} from '../../contexts/Store'
import { groupBy } from 'lodash'
import {BigNumber} from '../../utils'
import FollowMe from './'

export default function DecodingFeed({onChangePage}){
  const {query} = useStoreContext()
  let {messages, isSignedIn} = useFollowMeContext()

  const tokens = query.getTokens()
  const tokensHash = Object.values(tokens).map(t => t.id+t.balances.available+t.isStaking).join('')

  const messagesList = useMemo(()=>Object.values(messages), [messages,isSignedIn,tokensHash])
  const messagesHash = useMemo(()=>messagesList.map(m => m.id+m.hidden).join(''),[messagesList])
  const shownMessages = useMemo(()=>messagesList.filter(message => {
    if (!message.hidden && !message.decoded) return false // shown post hasn't recently been decoded
    if (tokens[message.tokenid] && tokens[message.tokenid].isStaking) return true
    return message.decodeable
  }),[messagesHash, tokensHash])

  return <FollowMe messages={shownMessages} className='decoding-feed' onChangePage={onChangePage}/>
}