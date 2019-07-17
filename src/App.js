import React, { Component } from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { merge } from 'lodash'

import Assets from './components/Assets'
import Asset from './components/Asset'
import Settle from './components/Settle'
import Portfolio from './components/Portfolio'
import Header from './components/Header'
import Sync from './components/Sync'

import './App.scss'

class App extends Component {
  constructor() {
    super()

    this.state = {
      user: {
        total: 2100,
        used: 1625,
        stakes: {
          'ThinkingUSD': 250,
          'naval': 1000,
          'SatoshiLite': 375
        },
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
        username: "VitalikButerin",
        description: "Creator of the Ethereum Smart Contract Platform",
        followers: 130000,
        minting: 25000
      },
      assets: [
        {
          asset: 'VitalikButerin',
          displayName: 'Vitalik Non-giver of Ether',
          followers: 870300,
          staked: 43000,
          categories: ['Crypto Twitter']
        },
        {
          asset: 'elonmusk',
          displayName: 'Elon Musk',
          followers: 27400000,
          staked: 30000,
          categories: []
        },
        {
          asset: 'ThinkingUSD',
          displayName: 'Flood [BitMEX]',
          followers: 71800,
          staked: 25000,
          categories: ['Traders']
        },
        {
          asset: 'glenweyl',
          displayName: '(((E. Glen Weyl)))',
          followers: 14300,
          staked: 7000,
          categories: ['Crypto Twitter', 'Politics']
        },
        {
          asset: 'SatoshiLite',
          displayName: 'Charlie Lee [LTC⚡]',
          followers: 829100,
          staked: 15000,
          categories: ['Crypto Twitter']
        },
        {
          asset: 'naval',
          displayName: 'Naval',
          followers: 658400,
          staked: 15000,
          categories: ['Crypto Twitter']
        },
        {
          asset: 'aantonop',
          displayName: 'Andreas M. Antonopoulos',
          followers: 493900,
          staked: 11000,
          categories: ['Crypto Twitter']
        },
        {
          asset: 'NickSzabo4',
          displayName: 'Nick Szabo 🔑',
          followers: 238300,
          staked: 36000,
          categories: ['Crypto Twitter']
        },
        {
          asset: 'ErikVoorhees',
          displayName: 'Erik Voorhees',
          followers: 349600,
          staked: 17500,
          categories: ['Crypto Twitter']
        },
        {
          asset: 'balajis',
          displayName: 'Balaji S. Srinivasan',
          followers: 108000,
          staked: 27600,
          categories: ['Crypto Twitter']
        }
      ]
    }
  }

  async componentDidMount() {
    this.props.web3.setFirstValidConnector(['MetaMask'])
    
    // can only save signer once library instantiated
    if (this.props.web3.library) {
      const signer = this.props.web3.library.getSigner()
      this.setState({ signer })
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

  updateAllocation = (newVal, asset) => {
    const prevVal = this.state.user.stakes[asset] || 0
    if (newVal - prevVal + this.state.user.used > this.state.user.total) {
      console.log("OVER ALLOCATED! No state changes")
      return false
    } else {
      const newAlloc = {
        used: this.state.user.used + newVal - prevVal,
        stakes: {
          [asset]: newVal
        }
      }
      this.setState(merge({}, this.state, { user: newAlloc }))
      return true
    }
  }

  render() {
    const actions = { updateAllocation: this.updateAllocation, toggleFav: this.toggleFav }

    return (
      <Router>
      <div className="App">        
        <Header {...this.state} />

        <Route 
          exact 
          path="/" 
          render={
            () => 
              <Assets {...this.state}
                actions={actions}
                updateAllocation={this.updateAllocation}
                toggleFav={this.toggleFav} />
          } 
        />

        <Route 
          path="/portfolio"
          render={
            props => 
              <Portfolio {...this.state} {...props} actions={actions} />
          } 
        /> 

        <Route 
          path="/settle"
          render={
            props => 
              <Settle {...this.state} {...props} actions={actions} />
          } 
        />

        <Route 
          path="/sync"
          render={
            props => 
              <Sync {...this.state} {...props} actions={actions} />
          } 
        /> 
        
        <Route 
          path="/a/:username"
          render={
            props => 
              <Asset {...this.state} {...props} actions={actions} />
          } 
        />  
      </div>
      </Router>
    )
  }
}

export default App;
