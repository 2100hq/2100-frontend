import React, {useState, useEffect} from 'react'
import {useFollowMeContext} from '../../contexts/FollowMe'
import {useStoreContext} from '../../contexts/Store'
import FollowMe from './'

function filterByToken(messages, token){
  const tokenMessages = Object.values(messages).filter( message => message.tokenid === token.id )
  if (tokenMessages.length === 0) return {}
  return tokenMessages.reduce( (obj, message) => {
    obj[message.id] = message
    return obj
  }, {})
}

export default function ProfileFeed({token}){
  const [messages, setMessages] = useState({})
  const [decodedTokenMessages, setDecodedTokenMessages] = useState({})
  const {query} = useStoreContext()
  const { privateMessages, sentMessages, publicMessages, decodedMessages, actions, myToken, isSignedIn } = useFollowMeContext()
  const showForm = isSignedIn && myToken && myToken.id === token.id

  useEffect(() => {
    actions.getTokenFeed(token.id).then( feed => {
      feed = feed || {}
      setMessages({ ...messages, ...feed})
    })
  }, [isSignedIn])

  useEffect( () => {
   setMessages({ ...messages, ...filterByToken({...publicMessages, ...privateMessages, ...decodedMessages, ...sentMessages}, token) })
  }, [Object.keys(decodedMessages), Object.keys(privateMessages), Object.keys(publicMessages)])

  return <FollowMe messages={messages} showForm={showForm} className='profile-feed'/>
}