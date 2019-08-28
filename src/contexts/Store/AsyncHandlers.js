import { errors } from './utils'
import { set, uniqueId, keyBy } from 'lodash'
import { BN, unlimitedAllowance, updateStakeAmountsFromLevels } from '../../utils'
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
    VALIDATE: async action => {
      if (!libs.state.auth.token) return false
      try {
        await libs.socket.auth('validate', libs.state.auth.token)
        return true
      } catch(e){
        console.log(action.type, e)
        libs.dispatch(actions.update('auth.token', null))
        return false
      }
    },
    LOGIN: async action => {
      if (!libs.web3.active || !libs.web3.account) {
        libs.dispatch(actions.error(action.type, errors.login.NOT_UNLOCKED))
      }

      if (await libs.dispatch(actions.validate())) return
      console.log(action.type)
      try {
        const authtoken = await libs.socket.auth('token')
        const signed = await libs.web3.library
          .getSigner()
          .signMessage('2100 Login: ' + authtoken)
        await libs.socket.auth('authenticate', signed, libs.web3.account)
        libs.dispatch(actions.update('auth.token', authtoken))
      } catch (e) {
        console.log(action.type, e)
        if (/you are already logged in/.test(e)){
          await libs.dispatch(actions.logout())
          return libs.dispatch(actions.login())
        }
        libs.dispatch(actions.error(action.type, e))
        return false
      }
    },
    LOGOUT: async action => {
      console.log(action.type)
      libs.dispatch(actions.update(['private'], {}))
      libs.dispatch(actions.update(['auth'], {}))
      const resp = await libs.socket.auth('unauthenticate').catch(()=>{})
      libs.dispatch(actions.update(['auth'], {}))
      libs.dispatch(actions.update(['private'], {}))
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
        await libs.socket.admin('createToken', {
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
        await libs.socket[channel]('setAdmin', {
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
    USE_CREATE_COUPON: async action => {
      if (
        !libs.web3.active ||
        !libs.web3.account ||
        !libs.web3.library ||
        !libs.state.private.isSignedIn
      ) {
        libs.dispatch(actions.error(action.type, errors.auth.NOT_LOGGED_IN))
        return false
      }
      const { controller } = libs.state
      const { symbol, messageId, v, r, s } = action.params
      try {
        await controller.contract.create(symbol, messageId, v, r, s)
      } catch (e) {
        console.log(action.type, e)
        libs.dispatch(actions.error(action.type, e))
      }
    },
    SET_STAKE_LEVEL: async action => {
      if (!libs.state.private.isSignedIn) {
        libs.dispatch(actions.error(action.type, errors.auth.NOT_LOGGED_IN))
        return false
      }
      console.log()
      console.log(action)
      const newStakes = updateStakeAmountsFromLevels(libs.state, action.params)
      const newAction = libs.actions.setStakes(newStakes)
      return AsyncHandlers(libs)[newAction.type](newAction)
    },
    SET_STAKE: async action => {
      if (!libs.state.private.isSignedIn) {
        libs.dispatch(actions.error(action.type, errors.auth.NOT_LOGGED_IN))
        return false
      }
      if (BN(libs.state.controller.balances.total).isZero()) {
        libs.dispatch(actions.error(action.type, errors.staking.NO_DEPOSIT_BALANCE))
        return false
      }
      console.log()
      console.log(action)

      try {
        const resp = await libs.socket.private('stake', action.params)
        return resp
      } catch (e) {
        console.log(action.type, e)
        libs.dispatch(actions.error(action.type, e))
        return false
      }
    }
  }
}
