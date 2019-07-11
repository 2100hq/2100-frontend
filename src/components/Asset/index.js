import React, { Component } from 'react'
import AssetThumbnail from '../AssetThumbnail'
import Allocator from '../Allocator'
import './style.scss'

class Asset extends Component {
    constructor() {
        super()
        this.state = {
            similarAssets: ['elonmusk', 'ThinkingUSD', 'glenweyl', 'SatoshiLite', 'naval'],
            asset: {}
        }
    }

    componentDidMount() {
        const asset = this.props.assets.find(a => a.asset === this.props.match.params.username)
        this.setState({ asset })
    }

    render() {
        return (
            <div className="Asset container-fluid">
                <div className="row">
                    <div className="col-sm-4">
                        <div className="profile col-sm-10">
                            <span><img src={`https://pbs.twimg.com/profile_images/977496875887558661/L86xyLF4_400x400.jpg`}></img></span>
                            <span className="profile-info">
                                <div className="profile-name">Vitalik Non-giver of Ether</div>
                                <div className="profile-username"> @{this.state.asset.asset}</div>
                            </span>
                        </div>
                        <div className="minting-stats">
                            <div className="total-minted">234 minted [small chart]</div>
                            <div className="total-minting">◈ 30k minting [rank]</div>
                            <div className="total-user-minting">
                                <span>◈ {this.props.user.stakes[this.state.asset.asset] || 0} minting</span> 
                                <Allocator {...this.props} asset={this.state.asset} />
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-6">
                        <div className="emissions">
                            <div className="chart"></div>
                        </div>
                    </div>
                    <div className="col-sm-2 Related-assets">
                        <div className="related-header">Related Assets</div>
                        {this.state.similarAssets.map(asset => (
                            <AssetThumbnail username={asset} />
                        ))}
                    </div>
                </div>
            </div>
        )
    }
}

export default Asset