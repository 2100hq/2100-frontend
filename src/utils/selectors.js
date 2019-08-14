import { get, keyBy } from 'lodash'
import { BN, BigNumber } from './'
function selectPending (state) {
  const pending = keyBy(get(state, ['public', 'tokens', 'pending'], {}), 'name') // key both by name
  const createCoupons = get(state, ['public', 'coupons', 'create'], {})
  Object.values(pending).forEach(token => {
    token.pending = true
    token.coupon = get(createCoupons, [token.couponid, 'data'], {})
  })
  return pending
}

function getStakeLevels (state) {
  let myStakes = Object.entries(getMyStakes(state)).filter(([address, stake]) => BN(stake).gt(0))
  if (myStakes.length === 0) return {}
  const totalStaked = getTotalStaked(state)
  // console.log();
  // console.log('totalStaked',totalStaked.toString());

  if (totalStaked.eq(0)) return {}
  const maxStake = myStakes.reduce((max, [address, stake]) => BN(stake).gt(max) ? stake : max, '0')
  // console.log('maxStake',maxStake.toString());
  const minStake = myStakes.reduce((min, [address, stake]) => BN(stake).eq(min) ? min : BN(stake).lt(min) ? stake : min, maxStake)
  // console.log('minStake',minStake.toString());
  const minPercent = BigNumber(minStake).div(totalStaked.toString()) // 3
  // console.log('minPercent',minPercent.toString());
  const maxPercent = BigNumber(maxStake).div(totalStaked.toString()) // 3
  // console.log('maxPercent',maxPercent.toString());
  const multiplier = BigNumber(2).div(maxPercent) // 3
  // console.log('multiplier',multiplier.toString());

  return myStakes.reduce((buttons, [address, stake]) => {
    buttons[address] = BigNumber(stake).div(totalStaked).times(multiplier).dp(0, 6).toNumber()
    return buttons
  }, {})
}

function selectActive (state) {
  const active = keyBy(get(state, ['public', 'tokens', 'active'], {}), 'name') // key both by name

  const allStakes = get(state, ['public', 'stakes'], {})
  const myStakes = get(state, ['private', 'myStakes'], {})

  const stakeLevels = getStakeLevels(state)
  // console.log();
  // console.log('stakeLevels', stakeLevels);

  Object.values(active).forEach(token => {
    const tokenStakes = get(allStakes, token.id, {})
    token.totalStakes = Object.values(tokenStakes).reduce((sum, stake) => {
      return sum.add(BN(stake))
    }, BN(0)).toString()
    token.myStake = get(myStakes, token.id, '0')
    token.level = get(stakeLevels, token.id, '0')
    token.balances = {
      available: get(state, ['private', 'myWallets', 'available', token.id, 'balance'], '0'),
      locked: get(state, ['private', 'myWallets', 'locked', token.id, 'balance'], '0')
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

function getControllerContract (state) {
  return get(state, 'config.contracts.controller', {})
}

function getMyStakes (state) {
  const controller = getControllerContract(state)
  if (!controller.address) return []
  return Object.entries(get(state, 'private.myStakes', {}))
    .filter(([address, stake]) => address != controller.address)
    .reduce((obj, [address, stake]) => {
      obj[address] = stake
      return obj
    }, {})
}
function getTotalStaked (state) {
  const myStakes = getMyStakes(state)
  // console.log();
  // console.log('myStakes', myStakes);

  return Object.values(myStakes).reduce(
    (sum, stake) => {
      return sum.add(stake)
    },
    BN(0)
  )
}

function controllerBalances (state, controller) {
  const total = BN(controller.wallet.balance || '0')

  const used = getTotalStaked(state)
  const available = total.sub(used)

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
    used,
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
  controller.contract = getControllerContract(state)
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

function selectCommands (state) {
  return Object.values({...get(state, 'private.myCommands', {}), ...get(state, 'private.myCommandHistory', {})})
}

export default function Selectors (state) {
  const contracts = selectContracts(state)

  const tokens = selectTokens(state)

  const commands = selectCommands(state)
  return {
    ...contracts,
    ...tokens,
    commands
  }
}
