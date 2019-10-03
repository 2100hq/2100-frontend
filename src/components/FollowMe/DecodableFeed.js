import React, {useState, useEffect, useMemo} from 'react'
import {useFollowMeContext} from '../../contexts/FollowMe'
import {useStoreContext} from '../../contexts/Store'
import { groupBy } from 'lodash'
import {BigNumber} from '../../utils'
import FollowMe from './'

export default function DecodableFeed({onChangePage}){
  let {messages, isSignedIn} = useFollowMeContext()

  const messagesList = useMemo(()=>Object.values(messages), [messages,isSignedIn])
  const messagesHash = useMemo(()=>messagesList.map(m => m.id+m.hidden+m.decodeable).join(''),[messagesList])
  const shownMessages = useMemo(()=>messagesList.filter(message => message.decodable || message.decoded),[messagesHash])

  return <FollowMe messages={shownMessages} className='decodable-feed' onChangePage={onChangePage}/>
}