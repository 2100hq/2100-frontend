import React, { Component } from 'react'

class Allocator extends Component {
    moveSlider(e, asset) {
        const newVal = Number(e.target.value)
        const success = this.props.actions.updateAllocation(newVal, asset.asset)
        if (!success) {
            e.target.value = this.props.user.stakes[asset.asset] || "0"
        }
    }

    render() {
        return (
            <form className="Allocator">
                <div className="form-group">
                    <input type="range"
                        className="form-control-range"
                        min="0"
                        max={this.props.user.total}
                        defaultValue={this.props.user.stakes[this.props.asset.asset] || "0"}
                        onMouseUp={e => this.moveSlider(e, this.props.asset)}
                        step="1"
                        id="formControlRange" />
                </div>
            </form>
        )
    }
}

export default Allocator