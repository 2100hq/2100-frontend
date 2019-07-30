import { set, uniqueId, keyBy } from 'lodash'
import { BN, unlimitedAllowance } from '../../utils'
import Selectors from '../../utils/selectors'

export const errors = {
  login: {
    NOT_UNLOCKED: 'Please unlock your Ethereum wallet before logging in'
  }
}

export const initialState = {
  public: {},
  private: {},
  admin: {},
  error: {},
  intents: {},
  network: {
    loading: true,
    connected: false,
    error: null
  },
  web3: {}
}

// Actions are either handled by AsyncHandlers or reducer
export const actions = {
  unlockWallet: () => actionGenerator('UNLOCK_WALLET'),
  login: () => actionGenerator('LOGIN'),
  logout: () => actionGenerator('LOGOUT'),
  update: (path, data) => actionGenerator('UPDATE', { path, data }),
  approve: () => actionGenerator('APPROVE'),
  deposit: amount => actionGenerator('DEPOSIT', { amount }),
  withdraw: amount => actionGenerator('WITHDRAW', { amount }),
  error: (intent, message) => actionGenerator('ERROR', { [intent]: message })
}

function actionGenerator (type, params, resp) {
  return {
    id: uniqueId(),
    type,
    params,
    resp
  }
}

/*
 * Remaps `private.myCommand` commands to be keyed by transactionHash if available
 */
function remapPrivateData (action) {
  let { path, data } = action.params
  if (typeof path === 'string') path = path.split('.')
  // ['private']
  if (path.length === 1) {
    if (data.myCommands) {
      data.myCommands = keyBy(
        Object.values(data.myCommands),
        command => command.transactionHash || command.id
      )
    }
  }
  // ['private', 'myCommands']
  if (path.length === 2 && path[1] === 'myCommands') {
    data = keyBy(
      Object.values(data),
      command => command.transactionHash || command.id
    )
  }

  // ['private', 'myCommands', 'id123']
  if (path.length === 3 && path[1] === 'myCommands') {
    path[2] = data.transactionHash || data.id
  }

  return {
    ...action,
    params: {
      ...action.params,
      path,
      data
    }
  }
}

function isPrivateUpdate (action) {
  return (
    (Array.isArray(action.params.path) &&
      action.params.path[0] === 'private') ||
    /^private/.test(action.params.path)
  )
}

export function reducer (state, action) {
  switch (action.type) {
    case 'UPDATE':
      if (isPrivateUpdate) {
        action = remapPrivateData(action)
      }
      console.log(action.params.path, action.params.data)
      return { ...set(state, action.params.path, action.params.data) }
    case 'ERROR': {
      return { ...state, error: action.params }
    }
    default:
      throw new Error(`Reducer does not handle ${action.type}`)
  }
}

function AsyncHandlers (libs = {}) {
  return {
    UNLOCK_WALLET: async action => {
      if (libs.web3.active) return true
      await libs.web3.setConnector('MetaMask', { suppressAndThrowErrors: true })
    },
    LOGIN: async action => {
      if (!libs.web3.active || !libs.web3.account) {
        libs.dispatch(actions.error('login', errors.login.NOT_UNLOCKED))
      }
      let signed
      let token
      let resp
      try {
        token = await libs.socket.call('auth')('token')
        signed = token
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
        return libs.dispatch(actions.error(action.type, e.message))
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
      const { dai, controller } = Selectors(libs.state)
      let resp = {}
      try {
        resp = await dai.contract.approve(
          controller.contract.address,
          unlimitedAllowance
        )
      } catch (e) {
        console.log(action.type, e)
        libs.dispatch(actions.error(action.type, e.message))
      }
      return resp
    },
    DEPOSIT: async action => {
      const { controller } = Selectors(libs.state)
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
        libs.dispatch(actions.error(action.type, e.message))
      }
      return resp
    },
    WITHDRAW: async action => {
      const { controller } = Selectors(libs.state)
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
        libs.dispatch(actions.error(action.type, e.message))
      }
      return resp
    }
  }
}

export default function Dispatcher (libs) {
  const asyncHandlers = AsyncHandlers(libs)
  return async action => {
    if (!action) return
    console.log('ACTION >', action.type, action.params)
    if (asyncHandlers[action.type]) return asyncHandlers[action.type](action)
    libs.dispatch(action)
  }
}
