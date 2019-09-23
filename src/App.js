import React, { useRef } from 'react'
import { Router, Route, Switch } from 'react-router-dom'
import { matchPath } from 'react-router'

import { Global, css } from "@emotion/core";

// import Breakpoints from './components/Breakpoints'
// import Main from './components/Main'
// import Onboarding from './components/Onboarding'
// import Wallet from './components/Wallet'
import { Row, Col, Card } from 'react-bootstrap'
import { useTheme } from "./components/ThemeProvider";
import Admin from './components/Admin'
import Alerts from './components/Alerts'
import BrowserClasses from './components/BrowserClasses'
import Countdown from './components/Countdown'
import CreateMessageButton from './components/FollowMe/CreateMessageButton'
import CreateMessageFixed from './components/FollowMe/CreateMessageFixed'
import Discover from './components/Discover'
import ErrorModal from './components/ErrorModal'
import FollowMeMessageModal from './components/FollowMe/MessageModal'
import Manage from './components/Manage'
import Nav from './components/Nav'
import Portfolio from './components/Portfolio'
import Profile from './components/Profile'
import Sidebar from './components/Sidebar'

import history from './utils/history'
import { routeConfigs } from './utils'

import './App.scss'

// Enable or disable countdown page as entrypoint.
const countdown = true

function App() {
  const node = useRef()
  const onChangePage = () => node.current.scrollTop = 0

  // themeState: { dark: boolean } determines the current theme setting.
  const themeState = useTheme();

  return (
    <Router history={history}>
    <Global
      styles={css`
        // Ensure there is no flash of unstyled background.
        html, body {
          background-color: ${themeState.dark ? `#161617` : `#F8F8F9`} !important;
        }
      `}
    />
      <BrowserClasses>
        {countdown ? <Countdown /> : <><div className='container-fluid'>
          <Row>
            <Col md='2' className='nav-column'>
              <Nav />
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
                  <Col md='6' className='followme' ref={node}>
                    <CreateMessageButton />
                    {/* follow me */}
                    <Switch>
                      <Route exact path='/:username([$].*)' render={
                        props => {
                          const isMessageMatch = matchPath(props.location.pathname, routeConfigs.message)
                          let { match } = props
                          if (isMessageMatch) match = isMessageMatch
                          props = { ...props, match }
                          return <Profile {...props} />
                        }
                      } />
                      <Route render={props => <Sidebar onChangePage={onChangePage} {...props} />} />
                    </Switch>
                  </Col>
                </Row>
              </Switch>
            </Col>
          </Row>
          <Route exact path='/:username([$]{1,1}[a-zA-Z0-9_]+)/:messageid' render={
            props => <FollowMeMessageModal {...props} />
          } />
        </div>
          <CreateMessageFixed />
          <Alerts />
          <ErrorModal /></>}
      </BrowserClasses>
    </Router>
  )
}

export default App
