import React, { useState, useEffect } from 'react'
import { useStoreContext } from '../../contexts/Store'
import { useFollowMeContext } from '../../contexts/FollowMe'
import MessageCard from './MessageCard'

export default function SingleMessage(props){
  const {messageid, token} = props
  const { query, state } = useStoreContext()
  const { myToken, actions, isSignedIn, messages, showCreate } = useFollowMeContext()
  const [message, setMessage] = useState()
  const [loading, setLoading] = useState(true)
  function getMessage(){
    actions.getMessage(messageid).then(setMessage)
  }
  useEffect(() => {
    getMessage()
    const id = setTimeout(getMessage, state.config.followMePoll)
    return () => clearTimeout(id)
  },[isSignedIn, Boolean(showCreate) === false]) // when create window closes, fetch

  if (!message) return null
  let comments = null
  if (message.children){
    comments = message.children.map( comment => (
      <div className="message-comments">
        <MessageCard token={token} myToken={myToken} actions={actions} message={comment} isSignedIn={isSignedIn} {...props} />
      </div>
      )
    )
  }
  return(
    <div>
      <MessageCard token={token} myToken={myToken} actions={actions} message={message} isSignedIn={isSignedIn} {...props}/>
      {comments}
    </div>
  )
}