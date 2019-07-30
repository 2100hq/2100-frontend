import { utils } from 'ethers'
import { get } from 'lodash'
import Selectors from './selectors'

const oneDecimalRegExp = /\.0$/
const onlyOneDecimal = n => oneDecimalRegExp.test(n)
export function findStake ({ user, asset }) {
  return (user.stakes.find(a => a.username === asset.username) || { amount: 0 })
    .amount
}

export const BN = utils.bigNumberify

export const toDecimals = bn => {
  let n = utils.formatEther(bn)
  if (onlyOneDecimal(n)) n = `${n}0`
  return n
}
export const fromDecimals = utils.parseEther

export const balances = (state, controller = Selectors(state).controller) => {
  console.log()
  console.log('balances', state, controller)

  const available = BN(controller.wallet.balance || 0)
  const used = Object.values(get(state, 'private.myStakes', [])).reduce(
    (sum, stake) => sum.add(stake.value),
    BN(0)
  )

  const total = used.add(available)

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

export const daiBalances = (state, dai = Selectors(state).dai) => {
  const available = BN(dai.wallet.balance || 0)
  return {
    available,
    total: available
  }
}

export const unlimitedAllowance = BN(2)
  .pow(256)
  .sub(1)

export const isApproved = (state, dai = Selectors(state).dai) => {
  return BN(dai.wallet.allowance || 0).eq(unlimitedAllowance)
}
