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
  const {query} = useStoreContext()
  const { privateMessages, sentMessages, publicMessages, decodedMessages, tokenFeedMessages, actions, myToken, isSignedIn } = useFollowMeContext()
  const showForm = isSignedIn && myToken && myToken.id === token.id
  const messages = { ...(tokenFeedMessages[token.id] || {}), ...filterByToken({...publicMessages, ...privateMessages, ...decodedMessages, ...sentMessages}, token) }

  useEffect(() => {
    actions.getTokenFeed(token.id)
  }, [isSignedIn])

  return <FollowMe messages={messages} showForm={showForm} className='profile-feed'/>
}