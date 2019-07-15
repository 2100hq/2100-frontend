import React, { Component } from 'react'
import * as d3 from 'd3'
import AssetThumbnail from '../AssetThumbnail'
import Allocator from '../Allocator'
import { faAngleDoubleUp } from '@fortawesome/free-solid-svg-icons'

import { initResponsive } from '../../chart.js'
import './style.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

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

        // retrieve minting history
        const day = 60000 * 60 * 24
        const now = Date.now()
        const data = [
            {
                timestamp: now - (30 * day),
                value: 13000
            },
            {
                timestamp: now - (25 * day),
                value: 14000
            },
            {
                timestamp: now - (20 * day),
                value: 20000
            },
            {
                timestamp: now - (15 * day),
                value: 18000
            },
            {
                timestamp: now - (10 * day),
                value: 26000
            },
            {
                timestamp: now - (5 * day),
                value: 32000
            },
            {
                timestamp: now,
                value: 30000
            }
        ]
        this.renderStakingChart(data)
    }

    renderStakingChart(data) {
        const margins = { top: 25, right: 25, bottom: 40, left: 40 }
        const { g, chartHeight, chartWidth } = initResponsive("#asset-minting-chart", margins)

        const x = d3.scaleTime()
            .rangeRound([0, chartWidth])
            .domain(d3.extent(data, d => new Date(d.timestamp)))

        const y = d3.scaleLinear()
            .range([chartHeight, 0])
            .domain([0, d3.max(data, d => d.value)])

        const line = d3.area()
            .curve(d3.curveBasis)
            .x(d => x(d.timestamp))
            .y1(d => y(d.value))
            .y0(d => y(0))

        g.append("g")
            .attr("class", "asset-staking-chart-axis asset-staking-chart-axis-y")
            .attr("transform", "translate(-2, 0)")
            .call(d3.axisLeft(y).tickFormat(d3.format(".1s")))

        g.append("g")
            .attr("class", "asset-staking-chart-axis")
            .attr("transform", `translate(0, ${chartHeight})`)
            .call(d3.axisBottom(x))
            .selectAll("text")
            .attr("transform", "rotate(-45)")
            .style("text-anchor", "end")

        g.append("path")
            .datum(data)
            .attr("class", "asset-staking-line")
            .attr("stroke-linejoin", "round")
            .attr("stroke-linecap", "round")
            .attr("stroke-width", 1.5)
            .attr("d", line)
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
            .attr("class", "emissions-chart-axis emissions-chart-axis-y")
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
            .attr("d", line)

        const currentBlock = 4
        const userRatio = 0.3
        const userEmissions = data.map(d => {
            d.userValue = d.value * userRatio
            return d
        }).filter(d => d.block >= currentBlock)

        const area = d3.area()
            .curve(d3.curveBasis)
            .x(d => x(d.block))
            .y1(d => y(d.value))
            .y0(d => y(d.value - d.userValue))

        g.append("path")
            .datum(userEmissions)
            .attr("class", "user-emissions-line")
            .attr("stroke-linejoin", "round")
            .attr("stroke-linecap", "round")
            .attr("stroke-width", 0)
            .attr("d", area)

        g.append("path")
            .datum([{ block: currentBlock, value: decayCurve(currentBlock) }, { block: currentBlock, value: 0}])
            .attr("class", "emissions-hline")
            .attr("stroke-linejoin", "round")
            .attr("stroke-linecap", "round")
            .attr("stroke-width", 1.5)
            .style("stroke-dasharray", ("3, 3"))
            .attr("d", line)       
    }

    render() {
        return (
            <div className="Asset container-fluid">
                <div className="row">
                    <div className="col-sm-4">
                        <div className="profile">
                            <span><img src={`https://res.cloudinary.com/dhvvhdndp/image/twitter_name/${this.state.asset.asset}`}></img></span>
                            <span className="profile-info">
                                <div className="profile-name">{this.state.asset.displayName}</div>
                                <div className="profile-username"> @{this.state.asset.asset}</div>
                            </span>
                        </div>
                        <div className="minting-stats">
                            <div className="total-minted">
                                <div>677 minted</div>
                                <div class="progress">
                                    <div class="progress-bar" style={{ width: `${677 / 21}%` }}>{`${Math.round(677 / 21)}%`}</div>
                                </div>
                            </div>
                            <div className="total-user-minting">
                                <span>◈ {this.props.user.stakes[this.state.asset.asset] || 0} minting</span>
                                <Allocator {...this.props} asset={this.state.asset} />
                            </div>
                            <div className="total-minting">
                                <div>◈ 30k minting &nbsp;<FontAwesomeIcon icon={faAngleDoubleUp} /></div> 
                                <div id="asset-minting-chart"></div>
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