import { set, uniqueId, keyBy } from 'lodash'

// Actions are either handled by AsyncHandlers or reducer
const actions = {
  unlockWallet: () => actionGenerator('UNLOCK_WALLET'),
  login: () => actionGenerator('LOGIN'),
  logout: () => actionGenerator('LOGOUT'),
  update: (path, data) => actionGenerator('UPDATE', { path, data }),
  approve: () => actionGenerator('APPROVE'),
  deposit: amount => actionGenerator('DEPOSIT', { amount }),
  withdraw: amount => actionGenerator('WITHDRAW', { amount }),
  error: (intent, message) => actionGenerator('ERROR', { [intent]: {message} })
  // signCreate: (username) => actionGenerator('SIGN_CREATE', { username }),
}

function actionGenerator (type, params, resp) {
  return {
    id: uniqueId(),
    type,
    params,
    resp
  }
}

export default actions