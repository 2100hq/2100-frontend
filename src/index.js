import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import * as serviceWorker from './serviceWorker'
import 'bootstrap/dist/css/bootstrap.css'

// ethereum instantiation
import Web3Provider, { Connectors, Web3Consumer } from 'web3-react'
const MetaMask = new Connectors.InjectedConnector({ supportedNetworks: [1, 4] })

ReactDOM.render(
    <Web3Provider connectors={{ MetaMask }}
      libraryName={'ethers.js'}>
        <Web3Consumer>
            {web3 => <App web3={web3} />}
        </Web3Consumer> 
    </Web3Provider>, 
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
