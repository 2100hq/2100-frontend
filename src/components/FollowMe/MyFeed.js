import React, {useState, useEffect} from 'react'
import {useFollowMeContext} from '../../contexts/FollowMe'
import {useStoreContext} from '../../contexts/Store'
import FollowMe from './'

export default function MyFeed(){
  const { privateMessages } = useFollowMeContext()

  return (
      <FollowMe messages={privateMessages} showForm={false} className='my-feed'/>
  )
}