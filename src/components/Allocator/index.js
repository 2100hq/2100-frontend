import React, { useState, useEffect, useMemo } from 'react'
import { BigNumber, toDecimals, fromDecimals, convertToTwoDecimals } from '../../utils'
import { get } from 'lodash'
import { useStoreContext } from '../../contexts/Store'
import {Row, Col, Container} from 'react-bootstrap'
import Slider from '@material-ui/core/Slider';
import './style.scss'


export default function Allocator ({ token, className='', onComplete=()=>{}, onClickOutside=()=>{}, onChange=()=>{} }) {
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

  const myStake = useMemo( () => Number(toDecimals(token.myStake || 0)), [token.myStake] )

  const [sliderVal, setSliderVal] = useState(myStake)
  const [remaining, setRemaining] = useState(available)

  const pool = useMemo( ()=>{
    const useraddress = query.getUserAddress().toLowerCase()
    const amounts = Object.entries(token.stakes || {}).filter( ([address]) => address != useraddress).map( ([_,amount])=>amount)
    return toDecimals(amounts.reduce( (sum, amount) => sum.plus(amount), BigNumber(0)))
  },[token.stakes])

  const percentOfPool = useMemo( () =>{
     const total = BigNumber(pool).plus(sliderVal)
     return BigNumber(sliderVal).div(total).times(100).dp(1).toNumber().toFixed(1)
  },[pool, sliderVal])


  useEffect( () => {
    setSliderVal(myStake)
  },[myStake])

  useEffect( () => {
    const newVal = sliderVal
    const oldVal = myStake
    const diff = BigNumber(newVal).minus(oldVal)
    setRemaining( BigNumber(available).minus(diff).toNumber())
  },[sliderVal, available, myStake])

  async function handleMouseUp(e){
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


  function handleChange(e, val){
    const newVal = Number(e.target.value)
    const oldVal = myStake
    const diff = BigNumber(newVal).minus(oldVal)
    if (diff.gt(available)) return
    onChange(token.id, newVal)
    setSliderVal(newVal)
  }

  const color = remaining < 1.00 ? remaining < 0.05 ? 'low' : 'medium' : 'high'

  return (
    <Container className={`${className} ${color}`}>
      <Row>
        <Col xs={8}>
          <input
           type="range"
           min={0}
           max={Number(total)}
           step={0.01}
           value={Number(sliderVal)}
           onChange={handleChange}
           onMouseUp={handleMouseUp}
           disabled={isDisabled}
          />
        </Col>
        <Col xs={4}>
          <strong>{convertToTwoDecimals(String(sliderVal))}</strong> ({percentOfPool}% of reward)
        </Col>
      </Row>
    </Container>
  )
}
