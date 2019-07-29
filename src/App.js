import React, { Component } from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { merge } from 'lodash'

import Assets from './components/Assets'
import Asset from './components/Asset'
import Settle from './components/Settle'
import Portfolio from './components/Portfolio'
import Nav from './components/Nav'
import Wallet from './components/Wallet'

// import API from './api'
import { findStake } from './utils'

import './App.scss'

class App extends Component {
  constructor () {
    super()

    this.state = {
      conn: null,
      user: {
        total: 2100,
        used: 1625,
        // stakes: {
        //   'ThinkingUSD': 250,
        //   'naval': 1000,
        //   'SatoshiLite': 375
        // },
        stakes: [
          { username: 'ThinkingUSD', amount: 250 },
          { username: 'naval', amount: 1000 },
          { username: 'SatoshiLite', amount: 375 }
        ],
        favorites: ['balajis', 'ThinkingUSD'],
        minted: {
          ThinkingUSD: {
            available: 10,
            pending: 5,
            total: 20
          },
          naval: {
            available: 6,
            pending: 0,
            total: 10
          },
          VitalikButerin: {
            available: 0,
            pending: 0,
            total: 100
          }
        }
      },
      featured: {
        username: 'VitalikButerin',
        description: 'Creator of the Ethereum Smart Contract Platform',
        followers: 130000,
        minting: 25000
      },
      assets: [
        {
          username: 'VitalikButerin',
          displayName: 'Vitalik Non-giver of Ether',
          followers: 870300,
          staked: 43000,
          categories: ['Crypto Twitter']
        },
        {
          username: 'elonmusk',
          displayName: 'Elon Musk',
          followers: 27400000,
          staked: 30000,
          categories: []
        },
        {
          username: 'ThinkingUSD',
          displayName: 'Flood [BitMEX]',
          followers: 71800,
          staked: 25000,
          categories: ['Traders']
        },
        {
          username: 'glenweyl',
          displayName: '(((E. Glen Weyl)))',
          followers: 14300,
          staked: 7000,
          categories: ['Crypto Twitter', 'Politics']
        },
        {
          username: 'SatoshiLite',
          displayName: 'Charlie Lee [LTC⚡]',
          followers: 829100,
          staked: 15000,
          categories: ['Crypto Twitter']
        },
        {
          username: 'naval',
          displayName: 'Naval',
          followers: 658400,
          staked: 15000,
          categories: ['Crypto Twitter']
        },
        {
          username: 'aantonop',
          displayName: 'Andreas M. Antonopoulos',
          followers: 493900,
          staked: 11000,
          categories: ['Crypto Twitter']
        },
        {
          username: 'NickSzabo4',
          displayName: 'Nick Szabo 🔑',
          followers: 238300,
          staked: 36000,
          categories: ['Crypto Twitter']
        },
        {
          username: 'ErikVoorhees',
          displayName: 'Erik Voorhees',
          followers: 349600,
          staked: 17500,
          categories: ['Crypto Twitter']
        },
        {
          username: 'balajis',
          displayName: 'Balaji S. Srinivasan',
          followers: 108000,
          staked: 27600,
          categories: ['Crypto Twitter']
        }
      ]
    }
  }

  toggleFav = asset => {
    this.setState(s => {
      if (s.user.favorites.includes(asset)) {
        const i = s.user.favorites.indexOf(asset)
        s.user.favorites.splice(i, 1)
      } else {
        s.user.favorites.push(asset)
      }
      return s
    })
  }

  updateAllocation = (amount, asset) => {
    const prevAmount = findStake({ ...this.state, asset })
    if (amount - prevAmount + this.state.user.used > this.state.user.total) {
      console.log('OVER ALLOCATED! No state changes')
      return false
    } else {
      const { username } = asset
      const user = { ...this.state.user }
      user.used = this.state.user.used + amount - prevAmount

      // has to be immutable update
      const i = this.state.user.stakes.findIndex(s => s.username === username)
      user.stakes =
        i === -1
          ? [...this.state.user.stakes, { username, amount }]
          : Object.assign([], this.state.user.stakes, {
              [i]: { username, amount }
            })

      this.setState({ user })
      return true
    }
  }

  render () {
    const actions = {
      updateAllocation: this.updateAllocation,
      toggleFav: this.toggleFav
    }

    return (
      <Router>
        <div className='App'>
          <Nav />
          <Route
            exact
            path='/'
            render={() => (
              <Assets
                {...this.state}
                actions={actions}
                updateAllocation={this.updateAllocation}
                toggleFav={this.toggleFav}
              />
            )}
          />

          <Route path='/wallet' component={Wallet} />

          <Route
            path='/portfolio'
            render={props => (
              <Portfolio {...this.state} {...props} actions={actions} />
            )}
          />

          <Route
            path='/settle'
            render={props => (
              <Settle {...this.state} {...props} actions={actions} />
            )}
          />

          <Route
            path='/a/:username'
            render={props => (
              <Asset {...this.state} {...props} actions={actions} />
            )}
          />
        </div>
      </Router>
    )
  }
}

export default App
