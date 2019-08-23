import React, {useState, useEffect} from 'react'
import {useFollowMeContext} from '../../contexts/FollowMe'
import {useStoreContext} from '../../contexts/Store'
import FollowMe from './'

export default function PublicFeed(){
  const {query} = useStoreContext()
  const isSignedIn = query.getIsSignedIn()
  const { publicMessages, privateMessages, decodedMessages } = useFollowMeContext()
  const messages = { ...publicMessages, ...privateMessages, ...decodedMessages }

  return <FollowMe messages={messages} showForm={isSignedIn} className='public-feed'/>
}