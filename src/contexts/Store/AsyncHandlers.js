import { errors } from './utils'
import { set, uniqueId, keyBy } from 'lodash'
import { BN, unlimitedAllowance } from '../../utils'
import Selectors from '../../utils/selectors'
import actions from './actions'

export default function AsyncHandlers (libs = {}) {
  return {
    UNLOCK_WALLET: async action => {
      if (libs.web3.active) return true
      try {
        await libs.web3.setConnector('MetaMask', {
          suppressAndThrowErrors: true
        })
      } catch (e) {
        libs.dispatch(actions.error(action.type, e))
      }
    },
    LOGIN: async action => {
      if (!libs.web3.active || !libs.web3.account) {
        libs.dispatch(actions.error(action.type, errors.login.NOT_UNLOCKED))
      }
      let signed
      let token
      let resp
      try {
        token = await libs.socket.call('auth')('token')
        signed = await libs.web3.library
          .getSigner()
          .signMessage('2100 Login: ' + token)
        resp = await libs.socket.call('auth')(
          'authenticate',
          signed,
          libs.web3.account
        )
      } catch (e) {
        console.log(action.type, e)
        return libs.dispatch(actions.error(action.type, e))
      }
      // libs.web3.account

      console.log('LOGIN RESP', resp)
    },
    LOGOUT: async action => {
      console.log(action.type)
      const resp = await libs.socket.call('auth')('unauthenticate')
      console.log('LOGOUT RESP', resp)
    },
    APPROVE: async action => {
      const { dai, controller } = libs.state
      let resp = {}
      try {
        resp = await dai.contract.approve(
          controller.contract.address,
          unlimitedAllowance
        )
      } catch (e) {
        console.log(action.type, e)
        libs.dispatch(actions.error(action.type, e))
      }
      return resp
    },
    DEPOSIT: async action => {
      const { controller } = libs.state
      let resp = {}
      try {
        resp = await controller.contract.deposit(action.params.amount)
        libs.dispatch(
          actions.update(['private', 'myCommands', resp.hash], {
            created: Date.now(),
            done: false,
            id: resp.hash + Date.now(),
            state: 'Submitted',
            toWalletType: 'locked',
            tokenid: controller.contract.address,
            transactionHash: resp.hash,
            type: 'pendingDeposit',
            updated: Date.now(),
            value: action.params.amount.toString()
          })
        )
      } catch (e) {
        console.log(action.type, e)
        libs.dispatch(actions.error(action.type, e))
      }
      return resp
    },
    WITHDRAW: async action => {
      const { controller } = libs.state
      let resp = {}
      try {
        resp = await controller.contract.withdraw(action.params.amount)
        libs.dispatch(
          actions.update(['private', 'myCommands', resp.hash], {
            created: Date.now(),
            done: false,
            id: resp.hash + Date.now(),
            state: 'Submitted',
            toWalletType: 'locked',
            tokenid: controller.contract.address,
            transactionHash: resp.hash,
            type: 'withdrawPrimary',
            updated: Date.now(),
            value: action.params.amount.toString()
          })
        )
      } catch (e) {
        console.log(action.type, e)
        libs.dispatch(actions.error(action.type, e))
      }
      return resp
    },
    // SIGN_CREATE: async action => {
    //   if (!libs.web3.active || !libs.web3.account || !libs.web3.library) {
    //     libs.dispatch(actions.error(action.type, errors.auth.NOT_LOGGED_IN))
    //     return null
    //   }

    //   try {
    //     return await libs.web3.library
    //       .getSigner()
    //       .signMessage('I am @'+action.params.username.toLowerCase())

    //   } catch (e) {
    //     libs.dispatch(actions.error(action.type, e))
    //     return null
    //   }
    // },
    ALLOW_USERNAME: async action => {
      if (!libs.web3.active || !libs.web3.account || !libs.web3.library) {
        libs.dispatch(actions.error(action.type, errors.auth.NOT_LOGGED_IN))
        return false
      }

      try {
        await libs.socket.call('admin')('createToken', {
          name: action.params.username,
          ownerAddress: action.params.address
        })
        return true
      } catch (e) {
        console.log(action.type, e)
        libs.dispatch(actions.error(action.type, e))
        return false
      }
    },
    SET_ADMIN: async action => {
      if (!libs.web3.active || !libs.web3.account || !libs.web3.library) {
        libs.dispatch(actions.error(action.type, errors.auth.NOT_LOGGED_IN))
        return false
      }

      try {
        const channel = libs.state.private.me.isAdmin ? 'admin' : 'system'
        await libs.socket.call(channel)('setAdmin', {
          userid: action.params.address,
          isAdmin: action.params.isAdmin
        })
        return true
      } catch (e) {
        console.log(action.type, e)
        libs.dispatch(actions.error(action.type, e))
        return false
      }
    },
  }
}
