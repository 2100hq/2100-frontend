import React, { Component } from 'react'
import { isEqual } from 'lodash'

import './style.scss'

class Allocator extends Component {
    constructor() {
        super()
        this.state = {
            preview: 0
        }
    }

    componentDidMount() {
        const asset = this.props.asset
        if (asset && this.props.user.stakes[asset.asset]) {
            this.setState({ 
                preview: this.props.user.stakes[asset.asset],
                width: document.getElementById(`Allocator-${this.props.asset.asset}`).clientWidth
            })
        }
    }

    componentDidUpdate(prevProps) {
        const asset = this.props.asset

        // asset set
        if (!prevProps.asset.asset && this.props.asset.asset) {
            this.setState({ width: document.getElementById(`Allocator-${this.props.asset.asset}`).clientWidth })  
        }

        if (asset && !isEqual(this.props.user.stakes[asset.asset], prevProps.user.stakes[asset.asset])) {
            this.setState({ preview: this.props.user.stakes[asset.asset] })
        }
    }

    updatePreview = e => {
        const preview = e.target.value
        const previewPadding = `${(preview / this.props.user.total) * this.state.width - 10}px`
        this.setState({ preview, previewPadding })
    }

    moveSlider(e, asset) {
        const newVal = Number(e.target.value)
        const success = this.props.actions.updateAllocation(newVal, asset.asset)
        if (!success) {
            const preview = this.props.user.stakes[asset.asset] || 0
            e.target.value = preview
            this.setState({ 
                preview, 
                previewPadding: `${((this.props.user.stakes[asset.asset] || 0) / this.props.user.total) * this.state.width - 10}px` 
            })
        }
    }

    render() {
        return (
            <form className="Allocator">
                <div className="form-group">
                    <input type="range"
                        className="form-control-range Allocator-input"
                        id={`Allocator-${this.props.asset.asset}`}
                        min="0"
                        max={this.props.user.total}
                        defaultValue={this.props.user.stakes[this.props.asset.asset] || 0}
                        onMouseUp={e => this.moveSlider(e, this.props.asset)}
                        onChange={this.updatePreview}
                        step="5" />
                    {/*<div className="preview" style={{ paddingLeft: this.state.previewPadding }}>{this.state.preview}</div>*/}
                </div>
            </form>
        )
    }
}

export default Allocator