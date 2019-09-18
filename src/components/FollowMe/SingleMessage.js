import React, { useState, useEffect } from 'react'
import { useStoreContext } from '../../contexts/Store'
import { useFollowMeContext } from '../../contexts/FollowMe'
import MessageCard from './MessageCard'

export default function SingleMessage(props){
  const {messageid, token} = props
  const { query } = useStoreContext()
  const { myToken, actions, isSignedIn, messages } = useFollowMeContext()
  const [message, setMessage] = useState()
  const [loading, setLoading] = useState(true)
  useEffect( ()=> {
    // do this check only once
    if (loading) {
      setLoading(false)
      // search message archive by id or shortid
      const message = messages[messageid] || Object.values(messages).find(msg => msg.shortid === messageid)
      // don't load message from server if found in archive
      if (message) return setMessage(message)
    }
    actions.getMessage(messageid).then(setMessage)
  },[isSignedIn])

  if (!message) return null

  return <MessageCard token={token} myToken={myToken} actions={actions} message={message} isSignedIn={isSignedIn} {...props}/>
}