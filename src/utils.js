import { utils } from 'ethers'
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
export const daiAddress = process.env.REACT_APP_DAI_ADDRESS
