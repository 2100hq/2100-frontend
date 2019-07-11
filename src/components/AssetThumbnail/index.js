import React, { Component } from 'react'
import './style.scss'

class AssetThumbnail extends Component {
    render() {
        return (
            <div className="AssetThumbnail">
                <img src={`https://res.cloudinary.com/dhvvhdndp/image/twitter_name/${this.props.username}`}></img>
                &nbsp;&nbsp;<i>@{this.props.username}</i>
            </div>
        )
    }
}

export default AssetThumbnail