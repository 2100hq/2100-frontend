import { matchPath } from "react-router";
import { utils } from 'ethers'
import { get } from 'lodash'
import Selectors from './selectors'
import _BigNumber from 'bignumber.js'
_BigNumber.config({ EXPONENTIAL_AT: 1e+9, DECIMAL_PLACES: 18})

const oneDecimalRegExp = /\.\d{1,1}$/
const onlyOneDecimal = n => oneDecimalRegExp.test(n)

export const BN = utils.bigNumberify
export const BigNumber = n => new _BigNumber(n)

export const toDecimals = (bn, dp=6, round=1) => {
  let n = BigNumber(bn).div(weiDecimals).dp(dp, round)
  n = convertToTwoDecimals(n)
  return n.toString()
}

export const convertToTwoDecimals = n => (onlyOneDecimal(n) ? `${n}0` : n === 0 || n === "0" ? "0.00" : n)

export const fromDecimals = n => BigNumber(n).times(weiDecimals)

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

export function updateStakeAmountsFromLevels (state, newLevels = {}) {
  // merge in new levels
  let totalLevels = 0
  // console.log()
  // console.log('Object.values(state.tokens)', Object.values(state.tokens))

  const tokens = Object.values(state.tokens).filter(token => !token.pending).map(token => {
    const level = newLevels[token.id] == null ? token.level : newLevels[token.id]
    totalLevels = totalLevels + Number(level)
    return {
      id: token.id,
      level: level
    }
  })
  const total = state.controller.balances.total
  // console.log('totalLevels', totalLevels.toString())
  // console.log('tokens', tokens)

  // console.log('total', total.toString())
  return tokens.reduce((stakes, token) => {
    const percent = totalLevels > 0 ? BigNumber(token.level).div(totalLevels) : BigNumber(0)
    const newStake = percent.times(total)
    const remainder = newStake.mod(penny)
    stakes[token.id] = newStake.minus(remainder).toString()
    // console.log(token.id, percent.toString(), newStake.toString())
    return stakes
  }, {})
}


export const weiDecimals = BigNumber(10).pow(18)


export const usernameRoute = {
  exact:true,
  path:'/:username([$].*)'
}

export function extractMessageIdFromUsernameRoute (match){
  if (!match || !match.params) return {}
  const [username, messageid] = match.params.username.split('/')

  return {username: username.replace(/^\$/,''), messageid}
}

export function extractUsernameAndMessageIdFromLocation(location = window.location){
  return extractMessageIdFromUsernameRoute(matchPath(location.pathname, usernameRoute))
}