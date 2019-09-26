import React from 'react'
import ProfileImage from '../ProfileImage'
import { toDecimals } from '../../utils'

export default function ProfileHeader({token}){
  return (
    <div className='profile-header align-items-center justify-content-center'>
      <div className='col-auto'>
          <ProfileImage token={token}/>
          <div className='token-stakes'>
            <img src='/img/dai.png' style={{ width: '16px','vertical-align': 'baseline' }} /> {toDecimals(token.totalStakes)} staking
          </div>
          <div className='token-name'>
            {token.name}
          </div>
          <div className='token-url small text-muted'>
            <a href={`https://twitter.com/${token.name}`}>{`twitter.com/${token.name}`}</a>
          </div>
      </div>
    </div>
  )
}