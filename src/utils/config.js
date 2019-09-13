import { get } from 'lodash'
import assert from 'assert'

// const artifacts = [
//   require('2100-contracts/build/contracts/Controller'),
//   require('2100-contracts/build/contracts/ERC20')
// ]

export const networkId = process.env.REACT_APP_NETWORK_ID
export const host = process.env.REACT_APP_SOCKET_URL

assert(networkId != null, 'A networkId is required')
assert(host != null, 'A host is required')

// export const contracts = artifacts.reduce((contracts, artifact) => {
//   contracts[artifact.contractName] = {
//     contractName: artifact.contractName,
//     abi: artifact.abi,
//     address: get(artifact, ['networks', networkId, 'address'])
//   }
//   return contracts
// }, {})

const primaryTokenAddress = process.env.REACT_APP_PRIMARY_TOKEN
assert(primaryTokenAddress != null, 'A primary token address is required')
export const contracts = {
  controller: {
    address: primaryTokenAddress
  }
}

const networkNames = {
  '2100': 'Artax Testnet',
  '1': 'Ethereum Mainnet'
}

const stakeLevels = Number(process.env.REACT_APP_STAKE_LEVELS || 2)

const followMeUrl = process.env.REACT_APP_FOLLOWME_URL
const followMePoll = Number(process.env.REACT_APP_FOLLOWME_POLL || 2000)

const views = ['All', 'Holding']
const defaultView = 'All'

export default {
  networkName: networkNames[networkId.toString()],
  networkId,
  host,
  stakeLevels,
  contracts,
  followMeUrl,
  followMePoll,
  views,
  defaultView
}
