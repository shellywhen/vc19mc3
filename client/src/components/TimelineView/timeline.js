/* global d3 */
let Timeline = function () {
  this.zone = ''
  this.start = ''
  this.end = ''
  this.interval = ''
}
Timeline.prototype.draw = function () {
  d3.math.max([1, 2])
  return this
}

let colorMap = function (datum) {
  let pos = datum.pos
  let neg = datum.neg
  let compound = datum.compound
  let v = d3.max([pos, neg, compound, datum.neu])
  if (v === neg || neg > 0.1) return '#d98c7d'
  if (v === compound) return '#e78b12'
  if (v === pos || pos > 0.5) return '#1d990a'
  return '#3fb0d6'
}

// let zoomed = function () {
//   if (d3.event.sourceEvent && d3.event.sourceEvent.type === 'brush') return; // ignore zoom-by-brush
//   var t = d3.event.transform;
//   // x.domain(t.rescaleX(x2).domain());
//   Line_chart.select('.line').attr('d', line)
//   focus.select('.axis--x').call(xAxis)
//   context.select('.brush').call(brush.move, x.range().map(t.invertX, t))
// }

Timeline.prototype.drawTimeline = function (sheet) {
  d3.select('#timeLine').html('')
  const parseTime = d3.timeParse('%Y-%m-%d %H:%M:%S')
  sheet.forEach(d => {
    d.timeobj = parseTime(d.time)
  })
  const xValue = d => d.timeobj
  const xLabel = 'Time'
  const yValue = d => d.re
  const yLabel = 'Post'
  const margin = { left: 20, right: 10, top: 10, bottom: 20 }

  const svg = d3.select('#timeLine')
  const width = svg.attr('width')
  const height = svg.attr('height')
  const innerWidth = width - margin.left - margin.right
  const innerHeight = height - margin.top - margin.bottom
  //
  // let zoom = d3.zoom()
  // .scaleExtent([1, Infinity])
  // .translateExtent([[0, 0], [width, height]])
  // .extent([[0, 0], [width, height]])
  // .on('zoom', zoomed)

  const g = svg.append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`)
  const xAxisG = g.append('g')
    .attr('transform', `translate(0, ${innerHeight})`)
  const yAxisG = g.append('g')

  xAxisG.append('text')
    .attr('class', 'axis-label')
    .attr('x', innerWidth / 2)
    .attr('y', 200)
    .text(xLabel)

  yAxisG.append('text')
    .attr('class', 'axis-label')
    .attr('x', innerHeight / 2)
    .attr('y', -60)
    .attr('transform', `rotate(-90)`)
    .style('text-anchor', 'middle')
    .text(yLabel)

  const xScale = d3.scaleTime()
  const yScale = d3.scaleLinear()

  const xAxis = d3.axisBottom()
    .scale(xScale)
    .tickSize(-innerHeight)

  const yAxis = d3.axisLeft()
    .scale(yScale)
    .tickSize(-innerWidth)

  xScale
    .domain(d3.extent(sheet, xValue))
    .range([0, innerWidth])

  yScale
    .domain(d3.extent(sheet, yValue))
    .range([innerHeight, 0])
    .nice()

  g.selectAll('circle').data(sheet)
    .enter().append('circle')
    .attr('cx', d => {
      return xScale(xValue(d))
    })
    .attr('cy', d => yScale(yValue(d)))
    .attr('fill-opacity', 0.6)
    .attr('fill', d => colorMap(d))
    .attr('r', d => Math.log(2 * d.re + 50))
    .on('mouseover', function (d) {
      d3.select('#textDetail').text(d.message + ' (' + d.account + ', ' + d.location + ')')
    })
    .on('mouseout', function (d) {
      // d3.select('#textDetail').text(' ')
    })
  xAxisG.call(xAxis)
  yAxisG.call(yAxis)
  svg.selectAll('.tick').select('line').attr('opacity', 0.2)
  svg.selectAll('.domain').remove()
}

Timeline.prototype.drawMatrix = function (data) {
  let datum = []
  let locationList = []
  let idx
  let vmax = 0
  for (let zone of data) {
    idx = 0
    locationList.push(zone['location'])
    for (let v of zone.count) {
      datum.push({'value': v, 'location': zone['location'], 'index': idx + 1})
      idx += 1
      vmax = Math.max(vmax, v)
    }
  }
  let idList = [...Array(idx).keys()].map(d => String(d + 1))
  d3.select('#matrix').html('')
  const margin = { left: 80, right: 10, top: 10, bottom: 20 }
  const svg = d3.select('#matrix')
  const width = svg.attr('width')
  const height = svg.attr('height')
  const innerWidth = width - margin.left - margin.right
  const innerHeight = height - margin.top - margin.bottom

  svg.append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
  let x = d3.scaleBand()
    .range([0, innerWidth])
    .domain(idList)
    .padding(0.05)
  svg.append('g')
    .style('font-size', 15)
    .attr('transform', 'translate(0,' + innerHeight + ')')
    .call(d3.axisBottom(x).tickValues(x.domain().filter((d, i) => (i % 10) === 9)))
    .select('.domain').remove()
  let y = d3.scaleBand()
    .range([ innerHeight, 0 ])
    .domain(locationList)
    .padding(0.05)
  svg.append('g')
    .style('font-size', 15)
    .call(d3.axisLeft(y))
    .attr('x', -innerHeight / 2)
    .attr('y', -60)
    .select('.domain').remove()
  svg.selectAll('.tick').select('line').remove()
  let mycolor = d3.scaleSequential().interpolator(d3.interpolateBlues).domain([1, vmax])
  svg.selectAll()
    .data(datum, d => d)
    .enter()
    .append('rect')
    .attr('x', d => x(String(d.index)))
    .attr('y', d => y(d.location))
    .attr('rx', 4)
    .attr('ry', 4)
    .attr('width', x.bandwidth())
    .attr('height', y.bandwidth())
    .style('fill', d => mycolor(d.value))
    .style('stroke-width', 4)
    .style('stroke', 'none')
    .style('opacity', 0.8)
}
export default Timeline
