import React, { useState, useEffect } from 'react'
import { BN, toDecimals, fromDecimals, convertToTwoDecimals } from '../../utils'
import { get } from 'lodash'
import { useStoreContext } from '../../contexts/Store'
import Dots from '../Dots'
import './style.scss'

const dotsConfig = [{
  'class': 'no-stake',
  tooltip: 'None'
},
{
  'class': 'min-stake',
  tooltip: 'A little'
},
{
  'class': 'max-stake',
  tooltip: 'A lot'
}]

export default function Allocator ({ token }) {
  const { state, dispatch, actions } = useStoreContext()
  const isDisabled = get(state, 'intents.allocating')
  const [uiLevel, setUiLevel] = useState(Number(token.level || '0'))
  const { available, total } = state.controller.balances

  const [commandId, setCommandId] = useState()
  const myCommand = commandId
    ? get(state, `private.myCommands.${commandId}`, { done: false })
    : { done: false }

  useEffect(() => {
    if (commandId == null) {
      return
    }
    if (!myCommand.done) return
    dispatch(actions.update('intents.allocating', false))
    setCommandId(null)
  }, [myCommand, commandId])

  useEffect(() => {
    if (token.level == null || isDisabled) return
    // console.log('setting', token.name, token.level)
    setUiLevel(Number(token.level || '0'))
  }, [token.level, uiLevel, isDisabled])

  async function handleClick (i) {
    if (isDisabled) return
    const newLevel = Number(i) > 0 && Number(i) === uiLevel ? uiLevel - 1 : Number(i)
    if (newLevel === uiLevel) return
    const oldLevel = uiLevel
    dispatch(actions.update('intents.allocating', true))
    console.log('clicked', token.name, newLevel, 'prev:', token.level)
    setUiLevel(newLevel)
    const resp = await dispatch(actions.setStakeLevel(token.id, newLevel))
    if (!resp) {
      setUiLevel(oldLevel)
      dispatch(actions.update('intents.allocating', false))
      return
    }
    setCommandId(resp.id)
  }

  return (
    <Dots total={state.config.stakeLevels} current={uiLevel} onClick={handleClick} isDisabled={isDisabled} />
  )
}
