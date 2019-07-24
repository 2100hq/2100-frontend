import React, { Component } from 'react'
import { isEqual } from 'lodash'
import { findStake } from '../../utils'

import './style.scss'

class Allocator extends Component {
  constructor () {
    super()
    this.state = {
      preview: 0
    }
  }

  componentDidMount () {
    const asset = this.props.asset
    const stake = findStake({ ...this.props, asset })
    if (asset && stake) {
      this.setState({ preview: stake })
    }
  }

  componentDidUpdate (prevProps) {
    const asset = this.props.asset
    const stake = findStake({ ...this.props, asset })
    if (asset && !isEqual(stake, findStake({ ...prevProps, asset }))) {
      this.setState({ preview: stake })
    }
  }

  updatePreview = e => {
    this.setState({ preview: e.target.value })
  }

  moveSlider (e, asset) {
    const newVal = Number(e.target.value)
    const success = this.props.actions.updateAllocation(newVal, asset)
    if (!success) {
      const preview = findStake({ ...this.props, asset })
      e.target.value = preview
      this.setState({ preview })
    }
  }

  render () {
    return (
      <form className='Allocator'>
        <div className='form-group'>
          <input
            type='range'
            className='form-control-range Allocator-input'
            id={`Allocator-${this.props.asset.username}`}
            min='0'
            max={this.props.user.total}
            defaultValue={findStake(this.props)}
            onMouseUp={e => this.moveSlider(e, this.props.asset)}
            onChange={this.updatePreview}
            step='5'
          />
        </div>
      </form>
    )
  }
}

export default Allocator
