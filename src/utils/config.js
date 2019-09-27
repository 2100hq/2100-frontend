import { get } from 'lodash'
import assert from 'assert'

// const artifacts = [
//   require('2100-contracts/build/contracts/Controller'),
//   require('2100-contracts/build/contracts/ERC20')
// ]

export const networkId = process.env.REACT_APP_NETWORK_ID
export const x2100host = process.env.REACT_APP_SOCKET_URL
export const followmehost = process.env.REACT_APP_FOLLOW_ME_SOCKET_URL

assert(networkId != null, 'A networkId is required')
assert(x2100host != null, 'A 2100 socket url is required')
assert(followmehost != null, 'A follow me socket url is required')

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

const views = ['New', 'Following', 'Cheap', 'Premium', 'Gifts']
const defaultView = 'New'

const followMePerPage = Number(process.env.REACT_APP_FOLLOW_ME_PER_PAGE  || 10)

export default {
  networkName: networkNames[networkId.toString()],
  networkId,
  x2100host,
  followmehost,
  stakeLevels,
  contracts,
  followMeUrl,
  followMePoll,
  followMePerPage,
  views,
  defaultView
}
