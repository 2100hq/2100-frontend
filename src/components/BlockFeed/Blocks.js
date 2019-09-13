import React, { useState, useEffect, useRef } from 'react'
import { get, sortBy, cloneDeep, groupBy } from 'lodash'
import { useStoreContext } from '../../contexts/Store'
import Block from './Block'

export default function Blocks({commands}){
  const { state } = useStoreContext()
  const tokens = get(state, 'public.tokens.active', {})
  commands = sortBy(Object.entries(commands), ([blockNumber]) => blockNumber*-1).splice(0,6)
  return commands.map( ([blockNumber,commands]) => {
    return <Block blockNumber={blockNumber} key={blockNumber} commands={commands} tokens={tokens}/>
  })
}