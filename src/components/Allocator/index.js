import React, { useState, useEffect, useRef, useMemo } from 'react'
import { BigNumber, toDecimals, fromDecimals, convertToTwoDecimals } from '../../utils'
import { get } from 'lodash'
import { useStoreContext } from '../../contexts/Store'
import {Form} from 'react-bootstrap'
import Slider from '@material-ui/core/Slider';
import './style.scss'


export default function Allocator ({ token, className, onComplete=()=>{}, onClickOutside=()=>{} }) {
  const node = useRef()
  const { state, query, dispatch, actions } = useStoreContext()
  const isSignedIn = query.getIsSignedIn()
  const isAllocating = query.getIsAllocating()
  const isDisabled = isAllocating
  const isAllocatingToken = isAllocating && isAllocating.tokenid === token.id
  const total = useMemo( () => Number(toDecimals(state.controller.balances.total)), [state.controller.balances.total])
  const available = useMemo( () => Number(toDecimals(state.controller.balances.available)), [state.controller.balances.available])

  const [commandId, setCommandId] = useState()
  const myCommand = commandId
    ? get(state, `private.myCommands.${commandId}`, { done: false })
    : { done: false }

  const myStake = useMemo( () => toDecimals(token.myStake || 0), [token.myStake] )

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
    onComplete()
  }, [myCommand, commandId])

  // detect clicks outside of this node; needs to re-bind when allocating happens
  useEffect(() => {
    function handleDocumentClick (e) {
     if (node.current.contains(e.target)) return
     if (isAllocatingToken) return // in the process of allocating this token
     onClickOutside()
    }

    document.addEventListener("mousedown", handleDocumentClick);

    return () => {
      document.removeEventListener("mousedown", handleDocumentClick);
    }
  }, [isAllocatingToken])


  function handleChange(e, val){
    const newVal = val //e.target.value
    const oldVal = myStake
    const diff = BigNumber(newVal).minus(oldVal)
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
        /> {sliderVal}
  */
  const marks = []
  if (available+myStake > total*0.1){
    marks.push({
      value: available+myStake,
      label: 'max'
    })
  }
  return (
    <div className={className} ref={node}>
      <Slider
         min={0}
         max={total}
         step={0.01}
         value={Number(sliderVal)}
         onChange={handleChange}
         onChangeCommitted={handleMouseUp}
         valueLabelDisplay="on"
         disabled={isDisabled}
         marks = {marks}
        />
      <div className='available text-muted small'>{convertToTwoDecimals(remaining)}/{total} available</div>
    </div>
  )
}
