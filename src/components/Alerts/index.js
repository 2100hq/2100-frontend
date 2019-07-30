import React from 'react'
import { get, sortBy } from 'lodash'
import { useStoreContext } from '../../contexts/Store'
import Alert from './Alert'
import './style.scss'
export default function Alerts () {
  const { state } = useStoreContext()
  let commands = Object.values(get(state, ['private', 'myCommands'], {}))
  commands = sortBy(commands, command => command.updated * -1)
  const alerts = commands.map((command, index) => (
    <Alert
      index={index + 1}
      total={commands.length}
      command={command}
      key={command.id}
    />
  ))
  return <div className='col-md-5 alert-fixed'>{alerts}</div>
}
