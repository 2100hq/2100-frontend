import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import * as serviceWorker from './serviceWorker'
import 'bootstrap/dist/css/bootstrap.css'

import Web3Provider, { Connectors, Web3Consumer } from 'web3-react'
import SocketProvider from './contexts/Socket'
import StoreProvider from './contexts/Store'

const MetaMask = new Connectors.InjectedConnector({
  supportedNetworks: [Number(process.env.REACT_APP_NETWORK_ID)]
})

ReactDOM.render(
  <Web3Provider connectors={{ MetaMask }} libraryName={'ethers.js'}>
    <SocketProvider>
      <StoreProvider>
        <App />
      </StoreProvider>
    </SocketProvider>
  </Web3Provider>,
  document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
