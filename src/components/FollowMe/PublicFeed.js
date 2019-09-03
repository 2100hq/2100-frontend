import React, {useState, useEffect} from 'react'
import {useFollowMeContext} from '../../contexts/FollowMe'
import {useStoreContext} from '../../contexts/Store'
import FollowMe from './'

export default function PublicFeed(){
  const {query} = useStoreContext()
  const isSignedIn = query.getIsSignedIn()
  const { messages } = useFollowMeContext()

  return <FollowMe messages={messages} showForm={false} className='public-feed'/>
}