import React, { useState, useEffect } from 'react'
import { BigNumber, toDecimals, fromDecimals, convertToTwoDecimals } from '../../utils'
import { get } from 'lodash'
import { useStoreContext } from '../../contexts/Store'
import {Form} from 'react-bootstrap'
import Slider from '@material-ui/core/Slider';
import './style.scss'


export default function Allocator ({ token, className }) {
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
  const [remaining, setRemaining] = useState(available)

  useEffect( () => {
    setSliderVal(myStake)
  },[myStake])

  useEffect( () => {
    const newVal = sliderVal
    const oldVal = myStake
    const diff = BigNumber(newVal).minus(oldVal)
    setRemaining( BigNumber(available).minus(diff).toNumber())
  },[sliderVal, available, myStake])

  async function handleMouseUp(e, val){
    if (isDisabled) return
    if (BigNumber(sliderVal).eq(myStake)) return
    dispatch(actions.update('intents.allocating', {tokenid:token.id,val:sliderVal}))

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


  function handleChange(e, val){
    // if(/bieb/.test(token.name)) console.log('handleChange',val)
    const newVal = e.target.value
    const oldVal = myStake
    const diff = BigNumber(newVal).minus(oldVal)
    console.log(newVal, oldVal, diff.gt(available))
    if (diff.gt(available)) return

    setSliderVal(newVal)
  }

  // if(/bieb/.test(token.name)) console.log(sliderVal)
  /*<Slider
   min={0}
   max={Number(total)}
   step={0.01}
   value={Number(sliderVal)}
   onChange={handleChange}
   onChangeCommitted={handleMouseUp}
   valueLabelDisplay="on"
   disabled={isDisabled}
  />*/
  /*
  <input
   type="range"
   min={0}
   max={Number(total)}
   step={0.01}
   value={Number(sliderVal)}
   onChange={handleChange}
   onMouseUp={handleMouseUp}
   valueLabelDisplay="on"
   disabled={isDisabled}
  />
  */
  return (
    <div className={className}>
      <Slider
         min={0}
         max={Number(total)}
         step={0.01}
         value={Number(sliderVal)}
         onChange={handleChange}
         onChangeCommitted={handleMouseUp}
         valueLabelDisplay="on"
         disabled={isDisabled}
        />
    <div className='available'>{convertToTwoDecimals(remaining)} available</div>
    </div>
  )
}
