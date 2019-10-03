import React, {useState, useMemo} from 'react'
import {useFollowMeContext} from '../../contexts/FollowMe'
import {useStoreContext} from '../../contexts/Store'
import FollowMe from './'
import CreateMessageButton from './CreateMessageButton'

export default function NewFeed({onChangePage}){
  const {query} = useStoreContext()
  const isSignedIn = query.getIsSignedIn()
  const { messages } = useFollowMeContext()
  const myToken = query.getMyToken() || {}
  const messagesList = useMemo(()=>Object.values(messages), [messages,isSignedIn])
  const messagesHash = useMemo(()=>messagesList.map(m => m.id+m.hidden+m.decoded).join(''),[messagesList])
  const shownMessages = useMemo(()=>messagesList.filter(message => !isSignedIn || message.hidden || message.decoded || message.tokenid === myToken.id),[messagesHash])
  return (
      <FollowMe messages={messagesList} className='new-feed' onChangePage={onChangePage}/>
  )
}