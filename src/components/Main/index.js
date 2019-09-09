import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import {Row, Col, Card} from 'react-bootstrap'
import Sidebar from '../Sidebar'
import CreateMessageButton from '../FollowMe/CreateMessageButton'
import Discover from '../Discover'
import Header from '../Header'
import Onboarding from '../Onboarding'
import Profile from '../Profile'
import Feed from '../Feed'
import { withRouter, matchPath } from "react-router";
import { extractUsernameAndMessageIdFromLocation,extractMessageIdFromUsernameRoute } from '../../utils'

function Main({location}){
  const {username, messageid} = extractUsernameAndMessageIdFromLocation(location)
  return (
    <>  
    <div className='container-fluid'>
      <Row className='main'>
        <Col className='discover'>
          <Row>
            <Col md="12">
              <Discover />
            </Col>
          </Row>
        </Col>
        <Col className='followme'>
            <div className='create-messages-button-fixed'>
              <CreateMessageButton />
            </div>
            <Row>
              <Col md="12">
                {/* follow me */}
                <Route exact path='/' component={Sidebar} />
                <Route exact path='/:username([$].*)' render = {
                  props => {
                    let {match} = props
                    const {username, messageid} = extractMessageIdFromUsernameRoute(match)
                    match = {...match, params: {...match.params, username, messageid }}
                    props = {...props, match}
                    return <Profile {...props} />
                  }
                } />
              </Col>
            </Row>
        </Col>
        <Col md='1' className='feed'>
          <Feed />
        </Col>
      </Row>
    </div>
    </>
  )
}

export default withRouter(Main)