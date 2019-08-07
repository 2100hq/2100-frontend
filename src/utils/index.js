import { utils } from 'ethers'
import { get } from 'lodash'
import Selectors from './selectors'

const oneDecimalRegExp = /\.\d{1,1}$/
const onlyOneDecimal = n => oneDecimalRegExp.test(n)

export const BN = utils.bigNumberify

export const toDecimals = (bn, Cast = String) => {
  let n = utils.formatEther(bn)
  n = convertToTwoDecimals(n)
  return Cast(n)
}

export const convertToTwoDecimals = n => (onlyOneDecimal(n) ? `${n}0` : n)

export const fromDecimals = utils.parseEther

export const balances = state => {
  const { controller } = state
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

export const daiBalances = state => {
  const { dai } = state
  const available = BN(dai.wallet.balance || 0)
  return {
    available,
    total: available
  }
}

export const unlimitedAllowance = BN(2)
  .pow(256)
  .sub(1)

export const isApproved = state => {
  const { dai } = state
  return BN(dai.wallet.allowance || 0).eq(unlimitedAllowance)
}

export const penny = BN(10).pow(16)
