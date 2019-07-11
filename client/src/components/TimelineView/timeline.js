/* global d3 */
let Timeline = function (component) {
  this.zone = ''
  this.start = ''
  this.end = ''
  this.interval = ''
  this.component = component
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

Timeline.prototype.drawTimeline = function (sheet, interval = 60) {
  d3.select('#timeLine').html('')
  const parseTime = d3.timeParse('%Y-%m-%d %H:%M:%S')
  sheet.forEach(d => {
    d.timeobj = parseTime(d.time)
  })
  const xValue = d => d.timeobj
  const xLabel = 'Time'
  const yValue = d => d.re
  const yLabel = 'Post'
  const margin = { left: 30, right: 10, top: 60, bottom: 20 }
  const margin2 = { left: 30, right: 10, top: 10, bottom: 240 }

  const svg = d3.select('#timeLine')
  const width = svg.attr('width')
  const height = svg.attr('height')
  const innerWidth = width - margin.left - margin.right
  const innerHeight = height - margin.top - margin.bottom
  const innerHeight2 = height - margin2.top - margin2.bottom
  let focus = svg.append('g')
    .attr('class', '')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
    .attr('clip-path', 'url(#clip)')

  let context = svg.append('g')
    .attr('class', 'context')
    .attr('transform', 'translate(' + margin2.left + ',' + margin2.top + ')')

  const xScale = d3.scaleTime().domain(d3.extent(sheet, xValue)).range([0, innerWidth])
  const xScale2 = d3.scaleTime().domain(xScale.domain()).range([0, innerWidth])
  let timeRange = xScale.domain()
  this.start = timeRange[0]
  this.end = timeRange[1]
  let thresh = timeRange[0]
  let thresholds = []
  while (thresh < timeRange[1]) {
    thresh.setTime(thresh.getTime() + interval * 60 * 1000)
    thresholds.push(new Date(thresh))
  }
  let histogram = d3.histogram()
    .value(d => xValue(d))
    .domain(xScale.domain())
    .thresholds(thresholds)
  let bins = histogram(sheet)
  const yScale = d3.scaleLinear().domain(d3.extent(sheet, yValue)).range([innerHeight, 0]).nice()
  const yScale2 = d3.scaleLinear().domain([0, d3.max(bins, d => d.length)]).range([innerHeight2, 0]).nice()

  const xAxis = d3.axisBottom().scale(xScale).tickSize(-innerHeight)
  const xAxis2 = d3.axisBottom().scale(xScale2).tickSize(-innerHeight2)
  const yAxis = d3.axisLeft().scale(yScale).tickSize(-innerWidth)
  const yAxis2 = d3.axisLeft().scale(yScale2).ticks(3)

  let zoomed = function () {
    if (d3.event.sourceEvent && d3.event.sourceEvent.type === 'brush') return
    let t = d3.event.transform
    xScale.domain(t.rescaleX(xScale2).domain())
    focus.select('.axis--x').call(xAxis)
    context.select('.brush').call(brush.move, xScale.range().map(t.invertX, t))
  }

  let zoom = d3.zoom()
    .scaleExtent([1, Infinity])
    .translateExtent([[0, 0], [innerWidth, innerHeight]])
    .extent([[0, 0], [innerWidth, innerHeight]])
    .on('zoom', zoomed)

  svg.append('defs')
    .append('svg:clipPath')
    .attr('id', 'clip')
    .append('svg:rect')
    .attr('width', String(innerWidth + 20))
    .attr('height', String(innerHeight + 50))
    .attr('x', -15)
    .attr('y', -20)

  let timeline = this
  let brushed = function () {
    if (d3.event.sourceEvent && d3.event.sourceEvent.type === 'zoom') return // ignore brush-by-zoom
    var s = d3.event.selection || xScale2.range()
    xScale.domain(s.map(xScale2.invert, xScale2.invert))
    focus.select('.axis--x').call(xAxis)
    svg.select('.zoom').call(zoom.transform, d3.zoomIdentity
      .scale(innerWidth / (s[1] - s[0]))
      .translate(-s[0], 0))
    focus.selectAll('circle').attr('cx', d => xScale(xValue(d)))
    svg.selectAll('.tick').select('line').attr('opacity', 0.2)
    svg.selectAll('.domain').remove()
    timeline.component.$store.commit('set', {'field': 'period', 'data': xScale.domain()})
  }

  let brush = d3.brushX()
    .extent([[0, 0], [innerWidth, innerHeight2]])
    .on('brush end', brushed)

  focus.selectAll('circle').data(sheet)
    .enter().append('circle')
    .attr('cx', d => {
      return xScale(xValue(d))
    })
    .attr('cy', d => yScale(yValue(d)))
    .attr('fill-opacity', 0.6)
    .attr('fill', d => colorMap(d))
    .attr('r', d => Math.log(3 * d.re + 80))
    .on('mouseover', function (d) {
      d3.select('#textDetail').text(d.message + ' (' + d.account + ', ' + d.location + ')')
    })
    .on('mouseout', function (d) {
    })
  context.selectAll('rect')
    .data(bins)
    .enter().append('rect')
    .attr('class', 'bar')
    .attr('x', 1)
    .attr('transform', d => 'translate(' + xScale2(d.x0) + ',' + yScale2(d.length) + ')')
    .attr('width', d => xScale2(d.x1) - xScale2(d.x0) - 1)
    .attr('height', d => innerHeight2 - yScale2(d.length))
    .style('fill', '#119ecf')

  const xAxisG = focus.append('g')
    .attr('transform', `translate(0, ${innerHeight})`)
    .attr('class', 'axis axis--x')
  const xAxisG2 = context.append('g')
    .attr('transform', `translate(0, ${innerHeight2})`)
    .attr('class', 'axis axis--x')
  const yAxisG = focus.append('g')
    .attr('class', 'axis axis--y')
  const yAxisG2 = context.append('g')
    .attr('class', 'axis axis--y')

  xAxisG.append('text')
    .attr('class', 'axis-label')
    .attr('x', innerWidth / 2)
    .attr('y', 200)
    .text(xLabel)
  xAxisG.call(xAxis)
  xAxisG2.append('text')
    .attr('class', 'axis-label')
    .attr('x', innerWidth / 2)
    .attr('y', 200)
    .text(xLabel)
  xAxisG2.call(xAxis2)
  yAxisG.append('text')
    .attr('class', 'axis-label')
    .attr('x', innerHeight / 2)
    .attr('y', -60)
    .attr('transform', `rotate(-90)`)
    .style('text-anchor', 'middle')
    .text(yLabel)
  yAxisG.call(yAxis)
  yAxisG2.append('text')
    .attr('class', 'axis-label')
    .attr('x', innerHeight2 / 2)
    .attr('y', -60)
    .attr('transform', `rotate(-90)`)
    .style('text-anchor', 'middle')
    .text(yLabel)
  yAxisG2.call(yAxis2)

  context.append('g')
    .attr('class', 'brush')
    .call(brush)
    .call(brush.move, xScale2.range())

  svg.selectAll('.tick').select('line').attr('opacity', 0.2)
  svg.selectAll('.domain').remove()
}

Timeline.prototype.drawMatrix = function (data, interval = 15) {
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
  const margin = { left: 180, right: 20, top: 10, bottom: 0 }
  const svg = d3.select('#matrix')
  const width = svg.attr('width')
  const height = svg.attr('height')
  const innerWidth = width - margin.left - margin.right
  const innerHeight = height - margin.top - margin.bottom
  let y = d3.scaleBand()
    .range([ innerHeight, 0 ])
    .domain(locationList)
    .padding(0.05)
  svg.append('g')
    .attr('transform', 'translate(' + margin.left + ',0)')
    .style('font-size', 15)
    .call(d3.axisLeft(y))
    .select('.domain').remove()
  let x = d3.scaleBand()
    .range([0, innerWidth])
    .domain(idList)
    .padding(0.05)
  // svg.append('g')
  //   .style('font-size', 15)
  //   .attr('transform', 'translate(' + margin.left + ',' + innerHeight + ')')
  //   .call(d3.axisBottom(x).tickValues(x.domain().filter((d, i) => (i % 10) === 9)))
  //   .select('.domain').remove()

  svg.selectAll('.tick').select('line').remove()
  let mycolor = d3.scaleSequential().interpolator(d3.interpolateBlues).domain([1, vmax])
  let self = this
  svg.append('g').selectAll()
    .data(datum, d => d)
    .enter()
    .append('rect')
    .attr('transform', 'translate(' + margin.left + ',0)')
    .attr('x', d => x(String(d.index)))
    .attr('y', d => y(d.location))
    .attr('rx', 4)
    .attr('ry', 4)
    .attr('width', x.bandwidth())
    .attr('height', y.bandwidth())
    .on('mouseover', function (d) {
      let start = new Date(self.start)
      let timestart = new Date(start.setTime(start.getTime() + d.index * (interval - 1) * 60 * 1000))
      let timeend = new Date(start.setTime(start.getTime() + interval * 60 * 1000))
      let startstr = timestart.getMonth() + '/' + (timestart.getDate() + 1) + ' ' + timestart.getHours() + ':' + timestart.getMinutes()
      let endstr = timeend.getHours() + ':' + timeend.getMinutes()
      d3.select('#valueDetail').text(d.value + ' messages, ' + startstr + '~' + endstr)
    })
    .style('fill', d => mycolor(d.value))
    .style('stroke-width', 4)
    .style('stroke', 'none')
    .style('opacity', 0.8)
}
export default Timeline
