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
  const { messages, tokenFeedMessages, actions, myToken, isSignedIn } = useFollowMeContext()
  const showForm = false //isSignedIn && myToken && myToken.id === token.id
  const tokenMessages = { ...(tokenFeedMessages[token.id] || {}), ...filterByToken(messages, token) }

  useEffect(() => {
    actions.getTokenFeed(token.id)
  }, [isSignedIn])

  return <FollowMe messages={tokenMessages} showForm={showForm} className='profile-feed'/>
}