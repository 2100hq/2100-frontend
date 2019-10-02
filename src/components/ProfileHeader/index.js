import React from 'react'
import ProfileImage from '../ProfileImage'
import { toDecimals } from '../../utils'
import {Row, Col} from 'react-bootstrap'
import './style.scss'

export default function ProfileHeader({token}){
  return (
    <div className='profile-header'>
      <Row className='align-items-center'>
        <Col md='7' className='image-area'>
          <div className='module'>
            <ProfileImage token={token}/>
          </div>
            <div className='token-name mt-2'>
              {token.name}
            </div>
            <div className='token-stakes'>
              <img src='/img/dai.png' style={{ width: '16px','vertical-align': 'baseline' }} /> {toDecimals(token.totalStakes, 2)} staking
            </div>
            <div className='token-url small mt-2'>
              <a className='text-muted' href={`https://twitter.com/${token.name}`}><i className="fab fa-twitter"></i> {`${token.name}`}</a>
            </div>
        </Col>
        <Col md='5' className='stakeholders-area'>

            <div className='top-holders'>
                <div className='top-label'>Top Holders</div>
                <ProfileImage token='brttb'/>
                <ProfileImage token='dapp_boi'/>
                <ProfileImage token='richmcateer'/>
                <ProfileImage token='stefancoolican'/>
                <ProfileImage token='nanexcool'/>
                <ProfileImage token='brianmosoff'/>
                <ProfileImage token='austingriffith'/>
            </div>
            <hr/>
            <div className='top-stakers'>
                <div className='top-label'>Top Stakers</div>
                <ProfileImage token='brttb'/>
                <ProfileImage token='dapp_boi'/>
                <ProfileImage token='richmcateer'/>
                <ProfileImage token='stefancoolican'/>
                <ProfileImage token='nanexcool'/>
                <ProfileImage token='brianmosoff'/>
                <ProfileImage token='austingriffith'/>
            </div>
        </Col>
      </Row>
    </div>
  )
}