import React, {useState, useEffect} from 'react'
import {useFollowMeContext} from '../../contexts/FollowMe'
import {useStoreContext} from '../../contexts/Store'
import FollowMe from './'

export default function MyFeed(){
  const state = useFollowMeContext()

  return (
      <FollowMe messages={state.private.messages} showForm={false} className='my-feed'/>
  )
}