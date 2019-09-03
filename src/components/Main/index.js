import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import {Row, Col, Card} from 'react-bootstrap'
import FollowMePublicFeed from '../FollowMe/PublicFeed'
import Discover from '../Discover'
import Onboarding from '../Onboarding'
import Profile from '../Profile'
import { withRouter, matchPath } from "react-router";
import { extractUsernameAndMessageIdFromLocation,extractMessageIdFromUsernameRoute } from '../../utils'

function Main({location}){
  const {username, messageid} = extractUsernameAndMessageIdFromLocation(location)
  return (
    <div className='container-fluid'>
      <Row className='main'>
        <Col md="8">
          <Row>
            <Col md="12">
              <Discover />
            </Col>
          </Row>
        </Col>
        <Col md="4" className='followme'>
          <Row>
            <Col md="12">
              {/* follow me */}
              <Route exact path='/' component={FollowMePublicFeed} />
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
      </Row>
    </div>
  )
}

export default withRouter(Main)