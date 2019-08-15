import React from 'react'
import { toDecimals } from '../../utils'

export default function BlockRewardMessage ({command = {}, token = {}}) {
  let action
  let relationship

  switch (command.type) {
    case 'transferOwnerReward':
      action = 'Owners reward'
      relationship = 'owning'
      break
    case 'transferStakeReward':
      action = 'Staking reward'
      relationship = 'staking on'
      break
    case 'transferCreatorReward':
      action = 'Creators reward'
      relationship = 'creating'
      break
    default:
      throw new Error(`Unknown type ${command.type}`)
  }

  let amount = toDecimals(command.amount).split('.')
  amount = `${amount[0]}.${amount[1].slice(0, 6)}`

  const name = `$${token.name}`
  const messages = [
    <p>You just earned some {name}</p>,
    <p>{action} incoming for {name}</p>,
    <p>{amount} added for {relationship} {name}</p>
  ]
  const index = command.created%messages.length

  return messages[index]
}