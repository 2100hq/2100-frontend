import React, { useRef } from 'react'
import { Router, Route, Switch } from 'react-router-dom'
import { matchPath } from 'react-router'

import Main from './components/Main'
import Portfolio from './components/Portfolio'
import Profile from './components/Profile'
import Onboarding from './components/Onboarding'
import Nav from './components/Nav'
import Breakpoints from './components/Breakpoints'
// import Wallet from './components/Wallet'
import Alerts from './components/Alerts'
import ErrorModal from './components/ErrorModal'
import Manage from './components/Manage'
import Admin from './components/Admin'
import BrowserClasses from './components/BrowserClasses'
import {Row, Col, Card} from 'react-bootstrap'
import Sidebar from './components/Sidebar'
import CreateMessageButton from './components/FollowMe/CreateMessageButton'
import CreateMessageFixed from './components/FollowMe/CreateMessageFixed'
import FollowMeMessageModal from './components/FollowMe/MessageModal'

import Discover from './components/Discover'
import history from './utils/history'

import { routeConfigs } from './utils'

import './App.scss'

function App(){
  const node = useRef()
  const onChangePage = () => node.current.scrollTop = 0
  return (
    <Router history={history}>
      <BrowserClasses>
        {/*<Breakpoints />*/}
        <div className='container-fluid'>
          <Row className='no-gutters'>
            <Col md='1' className='nav-column'>
              <Nav />
            </Col>
            <Col md='11'>
              <Switch>
                <Route path='/portfolio' exact component={Portfolio} />
                {/*<Route path='/wallet' exact component={Wallet} />*/}
                <Route path='/manage' exact component={Manage} />
                <Route path='/admin' exact component={Admin} />

                <Row className='no-gutters main'>
                  <Col md='6' className='discover'>
                    <Discover />
                  </Col>
                  <Col md='6' className='followme' ref={node}>
                        <CreateMessageButton />
                      {/* follow me */}
                      <Switch>
                        <Route exact path='/:username([$].*)' render = {
                          props => {
                            const isMessageMatch = matchPath(props.location.pathname, routeConfigs.message)
                            let {match} = props
                            if (isMessageMatch) match = isMessageMatch
                            props = {...props, match}
                            return <Profile {...props} />
                          }
                        } />
                        <Route render={ props => <Sidebar onChangePage={onChangePage} {...props} /> } />
                      </Switch>
                  </Col>
                </Row>
              </Switch>
            </Col>
          </Row>
          <Route exact path='/:username([$]{1,1}[a-zA-Z0-9_]+)/:messageid' render= {
            props => <FollowMeMessageModal {...props} />
          } />
        </div>
        <CreateMessageFixed />
        <Alerts />
        <ErrorModal />
      </BrowserClasses>
    </Router>
  )
}

export default App
