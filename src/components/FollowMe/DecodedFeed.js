import React, {useMemo} from 'react'
import {useFollowMeContext} from '../../contexts/FollowMe'
import FollowMe from './'

export default function DecodedFeed({onChangePage}){
  let {messages, isSignedIn} = useFollowMeContext()
  const messagesList = useMemo(()=>Object.values(messages), [messages,isSignedIn])
  const messagesHash = useMemo(()=>messagesList.map(m => m.id+m.hidden).join(''),[messagesList])
  const shownMessages = useMemo(()=>messagesList.filter(m => !m.hidden),[messagesHash])

  return <FollowMe messages={shownMessages} className='decoded-feed' onChangePage={onChangePage}/>
}