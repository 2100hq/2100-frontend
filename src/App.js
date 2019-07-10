import React, { Component } from 'react'
import Assets from './components/Assets'
// import Asset from './components/Asset'

import { merge } from 'lodash'
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
        favorites: ['balajis', 'ThinkingUSD']
      },
      assets: [
        {
          asset: 'VitalikButerin',
          staked: 43000,
          categories: ['Crypto Twitter']
        },
        {
          asset: 'elonmusk',
          staked: 30000,
          categories: []
        },
        {
          asset: 'ThinkingUSD',
          staked: 25000,
          categories: ['Traders']
        },
        {
          asset: 'glenweyl',
          staked: 7000,
          categories: ['Crypto Twitter', 'Politics']
        },
        {
          asset: 'SatoshiLite',
          staked: 15000,
          categories: ['Crypto Twitter']
        },
        {
          asset: 'naval',
          staked: 15000,
          categories: ['Crypto Twitter']
        },
        {
          asset: 'aantonop',
          staked: 11000,
          categories: ['Crypto Twitter']
        },
        {
          asset: 'NickSzabo4',
          staked: 36000,
          categories: ['Crypto Twitter']
        },
        {
          asset: 'ErikVoorhees',
          staked: 17500,
          categories: ['Crypto Twitter']
        },
        {
          asset: 'balajis',
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
      this.setState(merge(this.state, { user: newAlloc }), () => console.log(this.state))
      return true
    }
  }

  render() {
    return (
      <div className="App">
        <header className="Header">
          <span className="brand">2100</span>
          <span className="nav-pill">Discover</span>
          <span className="nav-pill">Portfolio</span>
          <span className="balance">{this.state.user.used} / {this.state.user.total} DAI</span>
        </header>
        <Assets {...this.state} 
          updateAllocation={this.updateAllocation} 
          toggleFav={this.toggleFav} />
      </div>
    )
  }
}

export default App;
