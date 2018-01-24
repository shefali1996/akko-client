import React, { Component } from 'react';
import * as d3 from 'd3';
import { scaleLinear } from 'd3-scale';
import { max } from 'd3-array';
import { select } from 'd3-selection';

class BarChart extends Component {
  constructor(props) {
    super(props);
    this.createBarChart = this.createBarChart.bind(this);
  }
  componentDidMount() {
    this.createBarChart();
  }
  componentDidUpdate() {
    document.getElementById('barChart').innerHTML = '';
    this.createBarChart();
  }
  createBarChart() {
    const width1 = document.getElementById('barChart').offsetWidth;
    const fullHeight = this.props.fullHeight;

    const svg = d3.select('#barChart').append('svg')
      .attr('width', width1)
      .attr('height', fullHeight * 0.33);
    // .append("g")
    // .attr("transform", "translate(" + Math.min(width,height) / 2 + "," + Math.min(width,height) / 2 + ")");
    // const svg = d3.select(this.node);
    const margin = {top: 20, right: 20, bottom: 50, left: 50};
    const width = +svg.attr('width') - margin.left - margin.right;
    const height = +svg.attr('height') - margin.top - margin.bottom;

    const x = d3.scaleBand().rangeRound([0, width]).padding(0.1);
    const y = d3.scaleLinear().rangeRound([height, 0]);

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)
      .attr('overflow', 'visible');

    const data = this.props.data;
    x.domain(data.map((d) => { return d.label; }));
    y.domain([0, d3.max(data, (d) => { return d.value; })]);
    console.log('sssssssss', data);
    // ---------------x labels-----------------------------
    const labelX = g.append('g')
      .attr('class', 'axis axis--x')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x));
    labelX.selectAll('g')
      .select('text')
      .text((d) => { return ''; });
    labelX.selectAll('g')
      .append('image')
      .attr('xlink:href', (d, i) => {
        console.log('ddddddddd', d, i, data[i]);
        return data[i].image;
      })
      .attr('x', -20)
      .attr('y', 8)
      .attr('height', 40)
      .attr('width', 40);
    // ----------------Y labels---------------------
    const labelY = g.append('g')
      .attr('class', 'axis axis--y')
      .attr('transform', 'translate(7,0)')
      .attr('width', 70)
      .call(d3.axisLeft(y).ticks(5));

    labelY.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 6)
      .attr('dy', '0.71em')
      .attr('text-anchor', 'end')
      .text('Frequency');
    labelY.selectAll('g')
      .select('text')
      .attr('font-size', 20)
      .attr('color', 'gray');

    g.selectAll('.bar')
      .data(data)
      .enter().append('rect')
      .attr('class', 'bar')
      .attr('x', (d) => { return x(d.label); })
      .attr('y', (d) => { return y(d.value); })
      .attr('width', x.bandwidth())
      .attr('height', (d) => { return height - y(d.value); });
  }
  render() {
    return (
      <div id="barChart" />
    );
  }
}
export default BarChart;
