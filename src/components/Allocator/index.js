import React, { useState, useEffect } from 'react'
import {
  BN,
  toDecimals,
  fromDecimals,
  balances,
  onlyOneDecimal
} from '../../utils'
import { get } from 'lodash'
import { useStoreContext } from '../../contexts/Store'
import './style.scss'

// class Allocator extends Component {
//   constructor () {
//     super()
//     this.state = {
//       preview: 0
//     }
//   }

//   componentDidMount () {
//     const asset = this.props.asset
//     const stake = findStake({ ...this.props, asset })
//     if (asset && stake) {
//       this.setState({ preview: stake })
//     }
//   }

//   componentDidUpdate (prevProps) {
//     const asset = this.props.asset
//     const stake = findStake({ ...this.props, asset })
//     if (asset && !isEqual(stake, findStake({ ...prevProps, asset }))) {
//       this.setState({ preview: stake })
//     }
//   }

//   updatePreview = e => {
//     this.setState({ preview: e.target.value })
//   }

//   moveSlider (e, asset) {
//     const newVal = Number(e.target.value)
//     const success = this.props.actions.updateAllocation(newVal, asset)
//     if (!success) {
//       const preview = findStake({ ...this.props, asset })
//       e.target.value = preview
//       this.setState({ preview })
//     }
//   }

//   render () {
//     return (
//       <form className='Allocator'>
//         <div className='form-group'>
//           <input
//             type='range'
//             className='form-control-range Allocator-input'
//             id={`Allocator-${this.props.asset.username}`}
//             min='0'
//             max={this.props.user.total}
//             defaultValue={findStake(this.props)}
//             onMouseUp={e => this.moveSlider(e, this.props.asset)}
//             onChange={this.updatePreview}
//             step='5'
//           />
//         </div>
//       </form>
//     )
//   }
// }

export default function Allocator ({ token }) {
  const { state, dispatch, actions } = useStoreContext()
  const isDisabled = get(state, 'intents.allocating')

  const { available, total } = balances(state)
  const [value, setValue] = useState(toDecimals(token.myStake))
  const [commandId, setCommandId] = useState()

  useEffect(() => {
    if (commandId == null) {
      return
    }
    const command = get(state, ['private', 'myCommands', commandId], {
      done: false
    })
    if (!command.done) return
    dispatch(actions.update('intents.allocating', false))
    setCommandId(null)
  }, [get(state, ['private', 'myCommands', commandId || 'x']), commandId])

  useEffect(() => {
    setValue(toDecimals(token.myStake))
  }, [token.myStake])

  function isMoreThanAvailable (e) {
    const current = fromDecimals(e.target.value) // current input value (in wei)
    const change = current.sub(BN(token.myStake)) // change from current stake (in wei)
    return change.gt(available) // change cant be greater than available balance
  }

  function handleChange (e) {
    if (isMoreThanAvailable(e)) return
    const value = e.target.value === '0' ? '0.00' : e.target.value
    setValue(value)
  }

  async function handleMouseUp (e) {
    const newStake = fromDecimals(e.target.value)
    if (newStake.eq(BN(token.myStake))) return // new stake didnt change
    const address = token.id
    dispatch(actions.update('intents.allocating', true))
    const resp = await dispatch(actions.setStake(address, newStake.toString()))
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
