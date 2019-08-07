import { get, keyBy } from 'lodash'
import { BN } from './'
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
  const myStakes = get(state, ['private', 'myStakes'], {})

  Object.values(active).forEach(token => {
    token.stakes = get(stakes, token.id, '0')
    token.myStake = get(myStakes, token.id, '0')
    token.balances = {
      available: get(state, ['private', 'myWallets', 'available', token.id,  'balance'], '0'),
      locked: get(state, ['private', 'myWallets',  'locked',  token.id, 'balance'], '0')
    }
  })

  return active
}

function selectTokens (state) {
  const active = selectActive(state)
  const pending = selectPending(state)
  const tokens = { ...pending, ...active }
  return { tokens }
}

function controllerBalances (state, controller) {
  const total = BN(controller.wallet.balance || '0')

  const available = total.sub(
    Object.entries(get(state, 'private.myStakes', {})).reduce(
      (sum, [address, stake]) => {
        if (address === controller.address) return sum
        return sum.add(stake)
      },
      BN(0)
    )
  )

  get(state, ['private', 'myStakes', controller.address], '0')

  const pending = Object.values(get(state, 'private.myCommands', {})).reduce(
    (sum, command) => {
      if (command.done) return sum
      if (/pendingDeposit/.test(command.type)) return sum.add(command.value)
      if (/withdrawPrimary/.test(command.type)) return sum.sub(command.value)
      return sum
    },
    BN(0)
  )
  // console.log('PENDING',pending.toString())
  return {
    available,
    pending,
    total
  }
}

function daiBalances (state, dai) {
  const available = BN(dai.wallet.balance || 0)
  return {
    available,
    total: available
  }
}

function selectContracts (state) {
  const controller = {}
  controller.contract = get(state, 'config.contracts.controller')
  controller.address = (controller.contract || {}).address
  controller.walletPath = [
    'private',
    'myWallets',
    'available',
    (controller.contract || {}).address
  ]
  controller.wallet = get(state, controller.walletPath, {})
  controller.balances = controllerBalances(state, controller)

  const dai = {}
  dai.contract = get(state, 'config.contracts.dai')
  dai.address = (dai.contract || {}).address
  dai.walletPath = [
    'private',
    'myWallets',
    'available',
    (dai.contract || {}).address
  ]
  dai.wallet = get(state, dai.walletPath, {})
  dai.balances = daiBalances(state, dai)
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
