import React, { useState, useEffect } from 'react'
import { BigNumber, toDecimals, fromDecimals, convertToTwoDecimals } from '../../utils'
import { get } from 'lodash'
import { useStoreContext } from '../../contexts/Store'
import {Form} from 'react-bootstrap'
import './style.scss'


export default function Allocator ({ token }) {
  const { state, query, dispatch, actions } = useStoreContext()
  const isSignedIn = query.getIsSignedIn()
  const isDisabled = get(state, 'intents.allocating')

  const total = toDecimals(state.controller.balances.total)
  const available = toDecimals(state.controller.balances.available)

  const [commandId, setCommandId] = useState()
  const myCommand = commandId
    ? get(state, `private.myCommands.${commandId}`, { done: false })
    : { done: false }

  const myStake = toDecimals(token.myStake || 0)

  const [sliderVal, setSliderVal] = useState(myStake)
  useEffect( () => {
    setSliderVal(myStake)
  },[myStake])

  async function handleMouseUp(){
    if (isDisabled) return
    if (BigNumber(sliderVal).eq(myStake)) return
    dispatch(actions.update('intents.allocating', true))

    const resp = await dispatch(actions.setStake(token.id, fromDecimals(sliderVal).toString()))
      if (!resp) {
        setSliderVal(myStake)
        dispatch(actions.update('intents.allocating', false))
        return
      }
      setCommandId(resp.id)
  }
  useEffect(() => {
    if (commandId == null) {
      return
    }
    if (!myCommand.done) return
    dispatch(actions.update('intents.allocating', false))
    setCommandId(null)
  }, [myCommand, commandId])


  function handleChange(e){
    const newVal = e.target.value
    const oldVal = myStake
    const diff = BigNumber(newVal).minus(myStake)

    if (diff.gt(available)) return
    setSliderVal(newVal)

  }
  return (
     <input type='range' min="0" max={total} step="0.01" value={sliderVal} onChange={handleChange} onMouseUp={handleMouseUp} disabled={isDisabled}/>
  )
}
