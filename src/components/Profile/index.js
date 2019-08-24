import React, { useState, useEffect } from 'react'
import FollowMeProfileFeed from '../FollowMe/ProfileFeed'
import Allocator from '../Allocator'
import { toDecimals } from '../../utils'
import { Redirect }  from 'react-router-dom'
import { useStoreContext } from '../../contexts/Store'

/*
Loading states
  0: not connected to the network and loading
  1: connected to the network, but no data yet
  2: connected to the network, data, no token found
  3: connected to the network, data, found token
*/

export default function Profile ({match}) {
  const [loadingState, setLoadingState] = useState(0)

  const { query } = useStoreContext()
  const username = match.params.username.replace(/^\$/,'')
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

  const isSignedIn = query.getIsSignedIn()

  const stakeText = isSignedIn ? <>{toDecimals(token.myStake)} / {toDecimals(token.totalStakes)}</> : toDecimals(token.totalStakes)

  return (
    <div className='row justify-content-center'>
    	<div className='col-md-6'>
    		<div style={{marginTop:'2rem'}}>
					<h1><span className='token-name'>{token.name}</span></h1>
					<p class="token-description">Use my token to get sweet rewards.</p>
					{isSignedIn && <Allocator token={token}/> }
					<div>
        <img src='../img/dai.png' style={{ width: '14px','vertical-align': 'baseline' }} /> <span className='text-muted'>{stakeText}</span>
					</div>
					<hr/>
					<FollowMeProfileFeed token={token} />
    		</div>
    	</div>
    </div>
  )
}