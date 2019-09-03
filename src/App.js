import React, { Component } from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { merge } from 'lodash'

import Main from './components/Main'
import Asset from './components/Asset'
import Settle from './components/Settle'
import Portfolio from './components/Portfolio'
import Profile from './components/Profile'
import Nav from './components/Nav'
import Wallet from './components/Wallet'
import Alerts from './components/Alerts'
import ErrorModal from './components/ErrorModal'
import Manage from './components/Manage'
import Admin from './components/Admin'

// import API from './api'
import { findStake } from './utils'

import './App.scss'

class App extends Component {
  render () {
    return (
      <Router>
        <Route path='' component={Nav} />
        <Main />
        <Alerts />
        <ErrorModal />
      </Router>
    )
    // return (
    //   <Router>
    //     <Route path='' component={Nav} />
    //     <div className='container-fluid'>
    //       <Route exact path='/' component={Main} />
    //       <Route exact path='/:username([$].*)' render = {
    //         props => {
    //           const {match} = props
    //           const [username, messageid] = match.params.username.split('/')
    //           match.params.username = username
    //           match.params.messageid = messageid
    //           return <Profile {...props} />
    //         }
    //       } />
    //       <Route path='/portfolio' component={Portfolio} />
    //       <Route path='/wallet' component={Wallet} />
    //       <Route path='/manage' component={Manage} />
    //       <Route path='/admin' component={Admin} />
    //       <Alerts />
    //       <ErrorModal />
    //     </div>
    //   </Router>
    // )
  }
}

export default App
