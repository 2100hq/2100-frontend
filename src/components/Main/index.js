import React from 'react'
import {Row, Col, Card} from 'react-bootstrap'
import FollowMeFeed from '../FollowMeFeed'
import Discover from '../Discover'

export default function Main(){
  return (
    <Row className='main'>
      <Col md="8">
        <Row>
          <Col md="12">
            <Card>
              <Card.Body>
                <Discover />
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Col>
      <Col md="4">
        <Row>
          <Col md="12">
            {/* follow me */}
            <FollowMeFeed />
          </Col>
        </Row>
      </Col>
    </Row>
  )
}