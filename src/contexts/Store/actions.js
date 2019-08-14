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
  // signCreate: (username) => actionGenerator('SIGN_CREATE', { username }),
  allowUsername: data => actionGenerator('ALLOW_USERNAME', data),
  setAdmin: data => actionGenerator('SET_ADMIN', data),
  useCreateCoupon: coupon => actionGenerator('USE_CREATE_COUPON', coupon),
  setStake: (address, stake) =>
    actionGenerator('SET_STAKE', { [address]: stake }),
  setStakes: (stakes) =>
    actionGenerator('SET_STAKE', stakes),
  setStakeLevel: (address, level) =>
    actionGenerator('SET_STAKE_LEVEL', { [address]: level }),
  error: (intent, error) => actionGenerator('ERROR', { [intent]: error })
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
