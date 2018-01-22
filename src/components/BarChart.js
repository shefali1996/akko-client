import React, { Component } from 'react';
// import './App.css';
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
    this.createBarChart();
  }
  createBarChart() {
    const node = this.node;
    const svg = d3.select(node);
    let margin = {top: 20, right: 20, bottom: 30, left: 40},
      width = +svg.attr('width') - margin.left - margin.right,
      height = +svg.attr('height') - margin.top - margin.bottom;

    let x = d3.scaleBand().rangeRound([0, width]).padding(0.1),
      y = d3.scaleLinear().rangeRound([height, 0]);

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    d3.tsv('../constants/data.tsv', (d) => {
      d.frequency = +d.frequency;
      return d;
    }, (error, data) => {
      if (error) throw error;

      x.domain(data.map((d) => { return d.letter; }));
      y.domain([0, d3.max(data, (d) => { return d.frequency; })]);
      console.log('sssssssss', error, data);
      const labelG = g.append('g')
        .attr('class', 'axis axis--x')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(x));


      g.append('g')
        .attr('class', 'axis axis--y')
        .call(d3.axisLeft(y).ticks(10, '%'))
        .append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 6)
        .attr('dy', '0.71em')
        .attr('text-anchor', 'end')
        .text('Frequency');

      g.selectAll('.bar')
        .data(data)
        .enter().append('rect')
        .attr('class', 'bar')
        .attr('x', (d) => { return x(d.letter); })
        .attr('y', (d) => { return y(d.frequency); })
        .attr('width', x.bandwidth())
        .attr('height', (d) => { return height - y(d.frequency); });


      const a = d3.selectAll('.axis--x g');
      console.log('--------------------', a, a.length);
      labelG.selectAll('g')
        // .remove('text')
        .text((d) => { return ''; })
        .append('image')
        .attr('xlink:href', 'https://cdn.shopify.com/s/files/1/2374/4003/products/product-image-204525014.jpg?v=1506929542')
        .attr('height', 20)
        .attr('width', 20);
    });
    // .append((d, i) => {
    //   console.log('aaaaaaaaaaaaaaaa', d, i);
    //   // a[i].append('image')
    //   //   .attr('xlink:href', 'https://cdn.shopify.com/s/files/1/2374/4003/products/product-image-204525014.jpg?v=1506929542')
    //   //   .attr('height', 20)
    //   //   .attr('width', 20)
    //   //   .attr('x', function (d) {
    //   //     const bbox = this.parentNode.getBBox();
    //   //     return bbox.x;
    //   //   })
    //   //   .attr('y', function () {
    //   //     const bbox = this.parentNode.getBBox();
    //   //     return bbox.y;
    //   //   });
    //   return `${<image href="https://mdn.mozillademos.org/files/6457/mdn_logo_only_color.png" height="100" width="100" />}`;
    //
    // });

  }
  render() {
    return (<svg
      ref={node => this.node = node}
      width={1000}
      height={300} />);
  }
}
export default BarChart;
