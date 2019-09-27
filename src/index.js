import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import * as serviceWorker from './serviceWorker'
import { x2100host, followmehost } from './utils/config'

import Web3Provider, { Connectors, Web3Consumer } from 'web3-react'
import SocketProvider from './contexts/Socket'
import FollowMeSocketProvider from './contexts/FollowMeSocket'
import StoreProvider from './contexts/Store'
import FollowMeProvider from './contexts/FollowMe'

const supportedNetworks = process.env.REACT_APP_NETWORK_ID === '*' ? undefined: [Number(process.env.REACT_APP_NETWORK_ID)]
const MetaMask = new Connectors.InjectedConnector({
  supportedNetworks
})

ReactDOM.render(
  <Web3Provider connectors={{ MetaMask }} libraryName={'ethers.js'}>
    <SocketProvider host={x2100host}>
      <StoreProvider>
        <FollowMeSocketProvider host={followmehost}>
            <FollowMeProvider>
            <App />
          </FollowMeProvider>
        </FollowMeSocketProvider>
      </StoreProvider>
    </SocketProvider>
  </Web3Provider>,
  document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
