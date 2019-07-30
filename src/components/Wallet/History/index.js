import React, { useState, useEffect } from 'react'
import { useStoreContext } from '../../../contexts/Store'
import { toDecimals } from '../../../utils'
import { get, sortBy } from 'lodash'

function Entry ({ command, latestBlock }) {
  let action
  let token
  let value = toDecimals(command.value)
  let meta
  if (/pendingDeposit/.test(command.type)) {
    token = 'DAI'
    if (command.done) {
      action = 'Deposited'
    } else if (command.state === 'Submitted') {
      action = 'Depositing'
      meta = '(not mined)'
    } else {
      action = 'Depositing'
      meta = `(${latestBlock - command.blockNumber}/${command.confirmations +
        1} confirmations)`
    }
  }

  if (/withdrawPrimary/.test(command.type)) {
    token = 'DAI'
    if (command.done) {
      action = 'Withdrew'
    } else {
      action = 'Withdrawing'
      if (command.state === 'Submitted') meta = '(not mined)'
    }
  }
  const date = new Date(command.created).toLocaleDateString()
  const time = new Date(command.created).toLocaleTimeString()
  return (
    <tr>
      <td>
        {date} {time}
      </td>
      <td>
        {action} {value} {token} {meta}
      </td>
    </tr>
  )
}

export default function History () {
  const { state } = useStoreContext()
  const commands = Object.values(get(state, 'private.myCommands', {}))
  const latestBlock = get(state, 'public.latestBlock.number')
  const Entries = sortBy(commands, command => command.created * -1).map(
    command => (
      <Entry command={command} latestBlock={latestBlock} key={command.id} />
    )
  )
  return (
    <table className='table table-sm'>
      <thead>
        <tr>
          <th scope='col'>Date</th>
          <th scope='col'>Action</th>
        </tr>
      </thead>
      <tbody>{Entries}</tbody>
    </table>
  )
}
