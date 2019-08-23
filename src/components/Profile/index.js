import React, { useState } from 'react'
import FollowMeFeed from '../FollowMeFeed'
import Allocator from '../Allocator'
import { toDecimals } from '../../utils'


export default function Profile (token) {
  return (
    <div className='row justify-content-center'>
    	<div className='col-md-6'>
    		<div style={{marginTop:'2rem'}}>
					<h1><span className='token-name'>benjmnr2</span></h1>
					<p class="token-description">Use my token to get sweet rewards.</p>
					<span>** when signed in**</span>
					<Allocator token={token}/>
					<div>
        <img src='../img/dai.png' style={{ width: '14px','vertical-align': 'baseline' }} /> <span className='text-muted'>{toDecimals(token.myStake)} / {toDecimals(token.totalStakes)}</span>
					</div>
					<hr/>
					<span>** when signed in and owner**</span>
					<FollowMeFeed />
    		</div>
    	</div>
    </div>
  )
}