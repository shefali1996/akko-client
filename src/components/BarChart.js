import React, { Component } from 'react';
import * as d3 from 'd3';
import { scaleLinear } from 'd3-scale';
import { max } from 'd3-array';
import { select } from 'd3-selection';

class BarChart extends Component {
  constructor(props) {
    super(props);
    this.createBarChart = this.createBarChart.bind(this);
    this.onMouseOver = this.onMouseOver.bind(this);
    this.onMouseOut = this.onMouseOut.bind(this);
  }
  componentDidMount() {
    this.createBarChart();
  }
  componentDidUpdate() {
    document.getElementById('barChart').innerHTML = '';
    this.createBarChart();
  }
  onMouseOver(d, i) {
    this.props.showDetailOnHover(d.label);
  }
  onMouseOut(d, i) {
    this.props.hideDetail();
  }
  createBarChart() {
    const width1 = document.getElementById('barChart').offsetWidth;
    const fullHeight = this.props.fullHeight;

    const svg = d3.select('#barChart').append('svg')
      .attr('width', width1)
      .attr('height', fullHeight * 0.33);

    // const svg = d3.select(this.node);
    const margin = {top: 20, right: 20, bottom: 50, left: 50};
    const width = +svg.attr('width') - margin.left - margin.right;
    const height = +svg.attr('height') - margin.top - margin.bottom;

    const x = d3.scaleBand().rangeRound([0, width]).padding(0.1);
    const y = d3.scaleLinear().rangeRound([height, 0]);

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const data = this.props.data;
    x.domain(data.map((d) => { return d.label; }));
    y.domain([0, d3.max(data, (d) => { return d.value; })]);

    // ----------------Grid lines---------------------

    // add the X gridlines
    const xgrid = g.append('g')
      .attr('class', 'grid')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x)
        .tickSize(-height)
        .tickFormat('')
      );

    // add the Y gridlines
    g.append('g')
      .attr('class', 'grid')
      .call(d3.axisLeft(y)
        .ticks(5)
        .tickSize(-width)
        .tickFormat('')
      );
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
      .attr('xlink:href', (d, i) => { return data[i].image; })
      .attr('x', -20)
      .attr('y', 8)
      .attr('height', 40)
      .attr('width', 40);
    // ----------------Y labels---------------------
    const labelY = g.append('g')
      .attr('class', 'axis axis--y')
      .call(d3.axisLeft(y).ticks(5));

    labelY.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 6)
      .attr('dy', '0.71em')
      .attr('text-anchor', 'end')
      .text('Y axis');
    labelY.selectAll('g')
      .select('text')
      .text((d) => {
        const prefix = data[0].prefix || '';
        const postfix = data[0].postfix || '';
        return `${prefix}${d}${postfix}`;
      }
      );

    // ---------------------Draw Bar ------------------
    // const tip = d3.tip()
    //   .attr('class', 'd3-tip')
    //   .offset([-10, 0])
    //   .html((d) => {
    //     return `<strong>Frequency:</strong> <span style='color:red'>${d.label}</span>`;
    //   });
    // g.call(tip);
    const bar = g.selectAll('.bar')
      .data(data)
      .enter().append('rect')
      .attr('class', 'bar')
      .attr('x', (d) => { return x(d.label); })
      .attr('y', (d) => { return y(d.value); })
      .attr('width', x.bandwidth())
      .attr('height', (d) => {
        // console.log('******************', height - y(d.value), height, y(d.value), d.value);
        return height - y(d.value);
      });
      // .on('mouseover', tip.show)
      // .on('mouseout', tip.hide);
    bar.on('mouseover', (d, i) => {
      // this.onMouseOver(d, i);
      tooltip.style('display', 'block');
    });
    bar.on('mouseout', () => {
      this.onMouseOut();
      tooltip.style('display', 'none');
    });
    bar.on('mousemove', function (d) {
      const xPosition = d3.mouse(this)[0] - 5;
      const yPosition = d3.mouse(this)[1] - 5;
      tooltip.attr('transform', `translate(${xPosition},${yPosition})`);
      tooltip.select('text').text('Tooltip Text');
    });

    // ----------------Tooltip------------------

    const tooltip = g.append('g')
      .style('display', 'none');

    tooltip.append('rect')
      .attr('class', 'tip')
      .attr('width', 100)
      .attr('height', 30)
      .style('opacity', 0)
      .style('radius', 5);

    tooltip.append('text')
      .attr('x', 30)
      .attr('dy', '1.2em')
      .style('text-anchor', 'middle')
      .attr('font-size', '12px')
      .attr('font-weight', 'bold');


  }
  render() {
    return (
      <div id="barChart" />
    );
  }
}
export default BarChart;
