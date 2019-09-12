import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import Main from './components/Main'
import Portfolio from './components/Portfolio'
import Profile from './components/Profile'
import Onboarding from './components/Onboarding'
import Nav from './components/Nav'
// import Wallet from './components/Wallet'
import Alerts from './components/Alerts'
import ErrorModal from './components/ErrorModal'
import Manage from './components/Manage'
import Admin from './components/Admin'
import BrowserClasses from './components/BrowserClasses'
import {Row, Col, Card} from 'react-bootstrap'
import Sidebar from './components/Sidebar'
import CreateMessageButton from './components/FollowMe/CreateMessageButton'
import Discover from './components/Discover'
import { extractUsernameAndMessageIdFromLocation,extractMessageIdFromUsernameRoute } from './utils'

import './App.scss'

class App extends Component {
  render () {
    return (
      <Router>
        <BrowserClasses>
          <div className='container-fluid'>
            <Row>
              <Col md='2' className='nav-column'>
                <Route path='' component={Nav} />
              </Col>
              <Col md='10'>
                <Switch>
                  <Route path='/portfolio' exact component={Portfolio} />
                  {/*<Route path='/wallet' exact component={Wallet} />*/}
                  <Route path='/manage' exact component={Manage} />
                  <Route path='/admin' exact component={Admin} />
                  
                  <Row className='main'>
                    <Col md='6' className='discover'>
                      <Discover />
                    </Col>
                    <Col md='6' className='followme'>
                        <div className='create-messages-button-fixed'>
                          <CreateMessageButton />
                        </div>

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
                </Switch>
              </Col>
            </Row>
            <Row>
              <Col md='12'>
                <Alerts />
                <ErrorModal />
              </Col>
            </Row>
          </div>
        </BrowserClasses>
      </Router>
    )
  }
}

export default App
