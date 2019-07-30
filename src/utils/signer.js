/*
 * Uniswap Signer
 * https://raw.githubusercontent.com/Uniswap/uniswap-frontend/beta/src/utils/signer.js
 */
import * as ethers from 'ethers'

export default class UncheckedJsonRpcSigner extends ethers.Signer {
  constructor (signer) {
    super()
    ethers.utils.defineReadOnly(this, 'signer', signer)
    ethers.utils.defineReadOnly(this, 'provider', signer.provider)
  }

  getAddress () {
    return this.signer.getAddress()
  }

  sendTransaction (transaction) {
    return this.signer.sendUncheckedTransaction(transaction).then(hash => {
      return {
        hash: hash,
        nonce: null,
        gasLimit: null,
        gasPrice: null,
        data: null,
        value: null,
        chainId: null,
        confirmations: 0,
        from: null,
        mined: () =>
          new Promise(resolve => this.signer.provider.once(hash, resolve)),
        wait: confirmations => {
          return this.signer.provider.waitForTransaction(hash, confirmations)
        }
      }
    })
  }

  signMessage (message) {
    return this.signer.signMessage(message)
  }
}
