import React from 'react'
import {Row, Col, Card} from 'react-bootstrap'
import FollowMePublicFeed from '../FollowMe/PublicFeed'
import Discover from '../Discover'
import Onboarding from '../Onboarding'

export default function Main(){
  return (
    <Row className='main'>
      <Col md="8">
        <Row>
          <Col md="12">
            <Discover />
          </Col>
        </Row>
      </Col>
      <Col md="4">
        <Row>
          <Col md="12" style={{paddingLeft: '0'}}>
            {/* follow me */}
            <FollowMePublicFeed />
          </Col>
        </Row>
      </Col>
    </Row>
  )
}