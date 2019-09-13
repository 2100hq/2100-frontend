import React, { useState, useEffect } from 'react'
import { toDecimals } from '../../utils'
import { get } from 'lodash'
import BlockRewardMessage from './BlockRewardMessage'


export default function Block({blockNumber, commands = [], tokens = {}}){
  const [index, setIndex] = useState()

  useEffect(() => {
    if (commands.length === 0) return
    if (commands.length > 0) {
      if (Number(commands[0].created)%commands.length != index) setIndex(Number(commands[0].created)%commands.length)
    }
  }, [commands.length, commands[0]])

  let message = <p>Gathering stats about this block</p>
  if (index != null) {
    const command = commands[index]
    const token = get(tokens, [command.tokenid], {})
    message = <BlockRewardMessage command={command} token={token} />
  }




  return (
    <div className='fadein small'>
      {message}
      #{blockNumber}
    </div>
  )
}