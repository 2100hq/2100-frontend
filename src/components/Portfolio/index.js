import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import * as d3 from 'd3'
import { isEqual } from 'lodash'

import Favorite from '../Favorite'
import Allocator from '../Allocator'

import './style.scss'

class Portfolio extends Component {
    constructor() {
        super()

        this.state = {}
    }

    renderChart() {
        d3.selectAll(`.piechart svg`).remove()
        // set the dimensions and margins of the graph
        const width = 750
        const height = 500
        const margin = 40
        // The radius of the pieplot is half the width or half the height (smallest one). I substract a bit of margin.
        const radius = Math.min(width, height) / 2 - margin
        // append the svg object to the div called 'my_dataviz'
        const svg = d3.select(".piechart")
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")

        // Create dummy data
        const data = this.props.user.stakes
        // const data = { "$twitter:vitalikbuterin": 9, "$twitter:gakonst": 20, "$twitter:panekkkk": 30, "$twitter:el33th4xor": 8, "$twitter:maurelian_": 12, "$twitter:mattgcondon": 3, "$twitter:tonysheng": 7, "$twitter:mattcorva": 14 }
        // set the color scale
        const color = d3.scaleOrdinal()
            .domain(["a", "b", "c", "d", "e", "f", "g", "h"])
            .range(d3.schemeSet1);

        // Compute the position of each group on the pie:
        const pie = d3.pie()
            .sort(null) // Do not sort group by size
            .value(d => d.value)

        const data_ready = pie(d3.entries(data))
        // The arc generator
        const arc = d3.arc()
            .innerRadius(radius * 0.7)         // This is the size of the donut hole
            .outerRadius(radius * 0.8)
        // Another arc that won't be drawn. Just for labels positionning
        const outerArc = d3.arc()
            .innerRadius(radius * 0.9)
            .outerRadius(radius * 0.9)
        // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
        svg
            .selectAll('allSlices')
            .data(data_ready)
            .enter()
            .append('path')
            .attr('d', arc)
            .attr('fill', d => color(d.data.key))
            .attr("stroke", "white")
            .style("stroke-width", "2px")
            .style("opacity", 0.7)
        // Add the polylines between chart and labels:
        svg
            .selectAll('allPolylines')
            .data(data_ready)
            .enter()
            .append('polyline')
            .attr("stroke", "black")
            .style("fill", "none")
            .attr("stroke-width", 1)
            .attr('points', d => {
                var posA = arc.centroid(d) // line insertion in the slice
                var posB = outerArc.centroid(d) // line break: we use the other arc generator that has been built only for that
                var posC = outerArc.centroid(d); // Label position = almost the same as posB
                var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2 // we need the angle to see if the X position will be at the extreme right or extreme left
                posC[0] = radius * 0.95 * (midangle < Math.PI ? 1 : -1); // multiply by 1 or -1 to put it on the right or on the left
                return [posA, posB, posC]
            })
        // Add the polylines between chart and labels:
        svg
            .selectAll('allLabels')
            .data(data_ready)
            .enter()
            .append('text')
            .text(d => d.data.key)
            .attr('transform', d => {
                var pos = outerArc.centroid(d);
                var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
                pos[0] = radius * 0.99 * (midangle < Math.PI ? 1 : -1);
                return 'translate(' + pos + ')';
            })
            .style('text-anchor', d => {
                var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
                return (midangle < Math.PI ? 'start' : 'end')
            })
    }

    componentDidMount() {
        this.renderChart()
    }

    componentDidUpdate(prevProps) {
        if (!isEqual(prevProps.user.stakes, this.props.user.stakes)) {
            this.renderChart()
        }
    }

    render() {
        return (
            <div className="Portfolio container-fluid">
                <div className="row">
                    <div className="col-md-8 Portfolio-piechart">
                        <div className="card">
                            <div className="card-body">
                                <div className="piechart">
                                    <ul className="nav nav-tabs">
                                        <li className="nav-item">
                                            <a className="nav-link active" href="#">Minting</a>
                                        </li>
                                        <li className="nav-item">
                                            <a className="nav-link" href="#">Hodling</a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4 Portfolio-table-view">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th scope="col">Asset</th>
                                    <th scope="col">Allocation</th>
                                    <th scope="col"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.entries(this.props.user.stakes).map(([username, stake]) => (
                                    <StakeRow username={username} stake={stake} {...this.props} key={username} />
                                ))}
                            </tbody>
                        </table>
                        <div className="add-asset-to-portfolio-view">
                            <input placeholder="search assets" className="tw100-input" />
                        </div> 
                    </div>
                </div>
            </div>
        )
    }
}

function StakeRow (props) {
    const asset = props.assets.find(a => a.asset === props.username)
    return (
        <tr>
            <td><Link to={`/a/${asset.asset}`}>@{asset.asset}</Link></td>
            <td><Allocator {...props} asset={asset} /></td>
            <td><Favorite {...props} asset={asset} /></td>
        </tr>
    )
}

export default Portfolio