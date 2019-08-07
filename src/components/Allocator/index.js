import React, { useState, useEffect } from 'react'
import { BN, toDecimals, fromDecimals, convertToTwoDecimals } from '../../utils'
import { get } from 'lodash'
import { useStoreContext } from '../../contexts/Store'
import './style.scss'

export default function Allocator ({ token }) {
  const { state, dispatch, actions } = useStoreContext()
  const isDisabled = get(state, 'intents.allocating')

  const { available, total } = state.controller.balances
  const [value, setValue] = useState(toDecimals(token.myStake))
  const [commandId, setCommandId] = useState()
  const myCommand = commandId
    ? get(state, `private.myCommands.${commandId}`)
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
    setValue(toDecimals(token.myStake))
  }, [token.myStake])

  function stats (value) {
    const vals = {}
    vals.current = fromDecimals(value)
    vals.myStake = BN(token.myStake)
    vals.change = vals.current.sub(vals.myStake)
    return vals
  }

  function isMoreThanAvailable (value) {
    const { change } = stats(value)
    return change.gt(available) // change cant be greater than available balance
  }

  function handleChange (e) {
    const value = e.target.value
    if (isMoreThanAvailable(value)) return
    setValue(convertToTwoDecimals(value))
  }

  async function handleMouseUp (e) {
    const { current, myStake } = stats(e.target.value)
    if (current.eq(myStake)) return // new stake didnt change
    const address = token.id
    dispatch(actions.update('intents.allocating', true))
    const resp = await dispatch(actions.setStake(address, current.toString()))
    setCommandId(resp.id)
  }

  return (
    <form className='Allocator'>
      <div className='form-group'>
        <input
          type='range'
          className='form-control-range Allocator-input'
          id={`Allocator-${token.name}`}
          min='0'
          max={toDecimals(total)}
          value={value}
          onChange={handleChange}
          onMouseUp={handleMouseUp}
          step='0.01'
          disabled={isDisabled ? 'disabled' : ''}
        />
        {value}
      </div>
    </form>
  )
}
