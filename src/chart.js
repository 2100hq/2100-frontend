import * as d3 from 'd3'

export function initResponsive (el, margins) {
  const wrapper = document.querySelector(el)
  const height = wrapper.clientHeight
  const width = wrapper.clientWidth

  d3.selectAll(`${el} svg`).remove()

  const svg = d3
    .select(el)
    .append('svg')
    .attr('width', '100%')
    .attr('height', '100%')
    .attr(
      'viewBox',
      '0 0 ' + Math.min(width, height) + ' ' + Math.min(width, height)
    )
    .attr('preserveAspectRatio', 'xMinYMin')

  const chartWidth = width - margins.left - margins.right
  const chartHeight = height - margins.top - margins.bottom

  const g = svg
    .append('g')
    .attr('transform', 'translate(' + margins.left + ',' + margins.top + ')')

  return { g, chartHeight, chartWidth, svg }
}
