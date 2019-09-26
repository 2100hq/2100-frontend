import React, { useState, useEffect } from 'react'

import FollowMeSingleMessage from '../FollowMe/SingleMessage'
import { Link } from 'react-router-dom'
import { useStoreContext } from '../../contexts/Store'
import ProfileHeader from '../ProfileHeader'
import './style.scss'


/*
Loading states
  0: not connected to the network and loading
  1: connected to the network, but no data yet
  2: connected to the network, data, no token found
  3: connected to the network, data, found token
*/

export default function SingleMessagePage (props) {

  const { match } = props
  const [loadingState, setLoadingState] = useState(0)

  const { query } = useStoreContext()
  const username = match.params.username
  const messageid = match.params.messageid
  const isLoading = query.getIsLoading()
  const isConnected = query.getIsConnected()

  const token = query.getToken(username)

  useEffect( () => {
    if (loadingState === 3) return // token exists and loaded
    let id
    if (isConnected && (!token || !token.id)){
      setLoadingState(1)
      id = setTimeout(setLoadingState, 1000, 2) // token doesnt exist
    }
    if (isConnected && token && token.id) setLoadingState(3) // token exists
    return () => clearTimeout(id)
  }, [isConnected, token && token.id])

  if (loadingState==0 || loadingState==1) return <h1>Loading</h1>

  if (loadingState==2) return <h1>${username} is not a token</h1>

  return (
    <div className='single-message-page'>
      <span className='back-button'>
        <Link to='/'><i class="fas fa-arrow-circle-left"></i></Link> Single Message
      </span>
      <ProfileHeader token={token} />
      <div>
        <FollowMeSingleMessage token={token} messageid={messageid} />
      </div>
    </div>
  )
}