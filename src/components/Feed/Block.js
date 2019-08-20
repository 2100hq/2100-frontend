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
    <div className='card fadein'>
      <div className='card-body'>
      {message}
      <h6 className='card-subtitle text-muted mb-2 small'>#{blockNumber}</h6>
      </div>
    </div>
  )
}