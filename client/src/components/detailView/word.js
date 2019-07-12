/* global d3 */
import * as cloud from 'd3-cloud'
let Word = function () {
  this.countList = []
  this.author = 'Shelly'
}
Word.prototype.updatePeriod = function (per) {
  let start = new Date(per[0])
  let end = new Date(per[1])
  let startstr = String(start.getMonth() + 1) + '/' + (start.getDate()) + ' ' + start.getHours() + ':' + start.getMinutes()
  let endstr = String(start.getMonth() + 1) + '/' + (start.getDate()) + ' ' + end.getHours() + ':' + end.getMinutes()
  d3.select('#timePeriod').style('color', '#828282').text('Time Range: ' + startstr + '——' + endstr)
}
Word.prototype.drawCloud = function (countList) {
  for (let item of countList) {
    item['text'] = item['word']
    item['size'] = Math.sqrt(item['count'])
  }
  this.countList = countList
  if (countList.length === 0) return
  d3.select('#wordView').html('')
  const margin = {top: 20, right: 10, bottom: 0, left: 10}
  let svg = d3.select('#wordView')
  const width = svg.attr('width') - margin.left - margin.right
  const height = svg.attr('height') - margin.top - margin.bottom
  let wordCloud = svg.append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
    .append('g')
    .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')')
  let layout = cloud()
    .size([width, height])
    .words(this.countList)
    .fontSize(d => Math.sqrt(d.count) * 5 + 10)
    .padding(10)
    .rotate(d => 0)
    .spiral('rectangular')
    .on('end', function (data) {
    })
  layout.start()
  wordCloud.selectAll('text')
    .data(this.countList, d => d)
    .enter()
    .append('text')
    .style('font-size', d => Math.sqrt(d.count) * 5 + 10)
    .style('fill', '#44a8e0')
    .attr('text-anchor', 'middle')
    .style('font-family', 'sans-serif')
    .attr('transform', d => 'translate(' + [d.x, d.y] + ')')
    .text(d => d.word)
}
export default Word
