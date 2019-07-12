import React, { Component } from 'react'
import * as d3 from 'd3'
import AssetThumbnail from '../AssetThumbnail'
import Allocator from '../Allocator'

import { initResponsive } from '../../chart.js'
import './style.scss'

function decayCurve(block) {
    return 1 / block
}

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
        this.renderChart()
    }

    renderChart() {
        const blocks = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
        const data = blocks.map(block => {
            return { block, value: decayCurve(block) }
        })

        const margins = { top: 25, right: 50, bottom: 50, left: 60 }
        const { g, chartHeight, chartWidth } = initResponsive("#emissions-chart", margins)

        const x = d3.scaleLinear()
            .range([0, chartWidth])
            .domain(d3.extent(data, d => d.block))

        const y = d3.scaleLinear()
            .range([chartHeight, 0])
            .domain([0, d3.max(data, d => d.value)])

        const line = d3.line()
            .curve(d3.curveBasis)
            .x(d => x(d.block))
            .y(d => y(d.value))
        
        g.append("g")
            .attr("class", "emissions-axis emissions-axis-y")
            .attr("transform", "translate(-2, 0)")
            .call(d3.axisLeft(y))

        g.append("g")
            .attr("class", "emissions-chart-axis")
            .attr("transform", `translate(0, ${chartHeight})`)
            .call(d3.axisBottom(x))
        
        // text label for the x axis
        g.append("text")
            .attr("transform", "translate(" + (chartWidth / 2) + " ," + (chartHeight + margins.top + 10) + ")")
            .style("text-anchor", "middle")
            .text("Block")

        g.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margins.left + 10)
            .attr("x", 0 - (chartHeight / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text("Emission Rate")

        g.append("path")
            .datum(data)
            .attr("class", "emissions-line")
            .attr("stroke-linejoin", "round")
            .attr("stroke-linecap", "round")
            .attr("stroke-width", 1.5)
            .attr("stroke", "#6059a2")
            .attr("d", line)

        g.append("path")
            .datum([{ block: 4, value: decayCurve(4) }, { block: 4, value: 0}])
            .attr("class", "emissions-line")
            .attr("stroke-linejoin", "round")
            .attr("stroke-linecap", "round")
            .attr("stroke-width", 1.5)
            .attr("stroke", "red")
            .style("stroke-dasharray", ("3, 3"))
            .attr("d", line)
        
    }

    render() {
        return (
            <div className="Asset container-fluid">
                <div className="row">
                    <div className="col-sm-4">
                        <div className="profile col-sm-6">
                            <span><img src={`https://res.cloudinary.com/dhvvhdndp/image/twitter_name/${this.state.asset.asset}`}></img></span>
                            <span className="profile-info">
                                {/*<div className="profile-name">Vitalik Non-giver of Ether</div>*/}
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
                            <div className="chart" id="emissions-chart"></div>
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