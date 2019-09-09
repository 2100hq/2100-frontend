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

import './App.scss'

class App extends Component {
  render () {
    return (
      <Router>
        <BrowserClasses>
          <Route path='' component={Nav} />
          <div className='container-fluid'>
            <Switch>
              <Route path='/portfolio' exact component={Portfolio} />
              {/*<Route path='/wallet' exact component={Wallet} />*/}
              <Route path='/manage' exact component={Manage} />
              <Route path='/admin' exact component={Admin} />
              <Route component={Main} />
            </Switch>
          </div>
          <Alerts />
          <ErrorModal />
        </BrowserClasses>
      </Router>
    )
  }
}

export default App
