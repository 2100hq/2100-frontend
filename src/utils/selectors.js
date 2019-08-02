import { get, keyBy } from 'lodash'

function selectPending (state) {
  const pending = keyBy(get(state, ['public', 'tokens', 'pending'], {}), 'name') // key both by name
  const createCoupons = get(state, ['public', 'coupons', 'create'], {})
  Object.values(pending).forEach(token => {
    token.pending = true
    token.coupon = get(createCoupons, [token.couponid, 'data'], {})
  })
  return pending
}

function selectActive (state) {
  const active = keyBy(get(state, ['public', 'tokens', 'active'], {}), 'name') // key both by name

  const stakes = get(state, ['public', 'stakes'], {})
  const myStakes = get(state, ['public', 'myStakes'], {})

  Object.values(active).forEach(token => {
    token.stakes = stakes[token.id] || { balance: '0' }
    token.myStake = myStakes[token.id] || { balance: '0' }
  })

  return active
}

function selectTokens (state) {
  const active = selectActive(state)
  const pending = selectPending(state)
  const tokens = { ...pending, ...active }
  return { tokens }
}

function selectContracts (state) {
  const controller = {}
  controller.contract = get(state, 'config.contracts.controller')
  controller.walletPath = [
    'private',
    'myWallets',
    'available',
    (controller.contract || {}).address
  ]
  controller.wallet = get(state, controller.walletPath, {})

  const dai = {}
  dai.contract = get(state, 'config.contracts.dai')
  dai.walletPath = [
    'private',
    'myWallets',
    'available',
    (dai.contract || {}).address
  ]
  dai.wallet = get(state, dai.walletPath, {})
  return { dai, controller }
}

export default function Selectors (state) {
  const contracts = selectContracts(state)

  const tokens = selectTokens(state)

  return {
    ...contracts,
    ...tokens
  }
}
