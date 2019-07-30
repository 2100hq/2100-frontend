import { get } from 'lodash'
import assert from 'assert'

const artifacts = [
  require('2100-contracts/build/contracts/Controller'),
  require('2100-contracts/build/contracts/ERC20')
]

export const networkId = process.env.REACT_APP_NETWORK_ID
export const host = process.env.REACT_APP_SOCKET_URL

assert(networkId != null, 'A networkId is required')
assert(host != null, 'A host is required')

export const contracts = artifacts.reduce((contracts, artifact) => {
  contracts[artifact.contractName] = {
    contractName: artifact.contractName,
    abi: artifact.abi,
    address: get(artifact, ['networks', networkId, 'address'])
  }
  return contracts
}, {})

export default {
  networkId,
  host,
  contracts
}
