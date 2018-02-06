import React, { Component } from 'react';
import * as d3 from 'd3';
import { scaleLinear } from 'd3-scale';
import { max } from 'd3-array';
import { select } from 'd3-selection';
import $ from 'jquery';
import {plotByOptions} from '../constants';

const OPTION_TIME = plotByOptions.time;
const OPTION_PRODUCT = plotByOptions.product;
const OPTION_CUSTOMER = plotByOptions.customer;

class BarChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: this.props.data || []
    };
    this.createBarChartProduct = this.createBarChartProduct.bind(this);
    this.createBarChartCustomer = this.createBarChartCustomer.bind(this);
    this.onMouseOver = this.onMouseOver.bind(this);
    this.onMouseOut = this.onMouseOut.bind(this);
  }
  componentDidMount() {
    const currentOption = this.props.selectedOption;
    if (currentOption === OPTION_PRODUCT) {
      this.createBarChartProduct();
    } else if (currentOption === OPTION_CUSTOMER) {
      this.createBarChartCustomer();
    }
  }
  componentWillReceiveProps(props) {
    if (props.data !== this.state.data) {
      this.setState({
        data: props.data
      }, () => {
        const currentOption = props.selectedOption;
        if (currentOption === OPTION_PRODUCT) {
          this.createBarChartProduct();
        } else if (currentOption === OPTION_CUSTOMER) {
          this.createBarChartCustomer();
        }
      });
    }
  }

  onMouseOver(label) {
    this.props.showDetailOnHover(label);
  }
  onMouseOut() {
    this.props.hideDetail();
  }
  createBarChartCustomer() {
    $('#barChart').empty();
    const currentOption = this.props.selectedOption;
    const fullwidth = document.getElementById('barChart').offsetWidth;
    const fullHeight = this.props.fullHeight;
    const data = this.state.data;
    const margin = {top: 20, right: 20, bottom: 50, left: 50};

    const svg = d3.select('#barChart').append('svg')
      .attr('width', fullwidth)
      .attr('height', fullHeight * 0.33);

    const width = +svg.attr('width') - margin.left - margin.right;
    const height = +svg.attr('height') - margin.top - margin.bottom;

    const x = d3.scaleBand().rangeRound([0, width]).padding(0.1);
    const y = d3.scaleLinear().rangeRound([height, 0]);
    x.domain(data.map((d) => { return d.email; }));
    y.domain([0, d3.max(data, (d) => { return d.value; }) + 100]);

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // ----------------Tooltip------------------
    $(`.tooltip_${this.props.chartName}`).remove();
    const tooltip = d3.select('body').append('div').attr('class', `toolTip tooltip_${this.props.chartName}`);

    // ----------------Grid lines---------------------

    // add the X gridlines
    // const xgrid = g.append('g')
    //   .attr('class', 'grid')
    //   .attr('transform', `translate(0,${height})`)
    //   .call(d3.axisBottom(x)
    //     .tickSize(-height)
    //     .tickFormat('')
    //   );

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
      .text((d, i) => { return data[i].label; });

    labelX.selectAll('g')
      .on('mouseover', (d) => {
        this.onMouseOver(d);
      })
      .on('mouseout', (d) => {
        this.onMouseOut();
      });
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
    const bar = g.selectAll('.bar')
      .data(data)
      .enter().append('rect')
      .attr('class', 'bar')
      .attr('x', (d) => { return x(d.email); })
      .attr('y', (d) => { return y(d.value); })
      .attr('width', x.bandwidth())
      .attr('height', (d) => { return height - y(d.value) < 0 ? 0 : height - y(d.value); })
      .on('mouseover', (d) => {
        const rect = d3.event.target.getBoundingClientRect();
        const prefix = d.prefix || '';
        const postfix = d.postfix || '';
        const value = d.value.toFixed(2);
        tooltip.html(`<span>${prefix}${value}${postfix}</span>`);
        const top = rect.left - ($('.toolTip').width() / 2) + (rect.width / 2);
        const left = rect.top - ($('.toolTip').height() + 15);
        tooltip.style('left', `${top}px`)
          .style('top', `${left}px`)
          .style('opacity', 1)
          .style('transition', 'left .5s, top .5s');
        this.onMouseOver(d.label);
      })
      .on('mouseout', () => {
        this.onMouseOut();
        tooltip.style('opacity', 0).style('transition', 'opacity .5s');
      });

  }
  createBarChartProduct() {
    $('#barChart').empty();
    const fullwidth = document.getElementById('barChart').offsetWidth;
    const fullHeight = this.props.fullHeight;
    const data = this.state.data;
    const margin = {top: 20, right: 20, bottom: 50, left: 50};

    const svg = d3.select('#barChart').append('svg')
      .attr('width', fullwidth)
      .attr('height', fullHeight * 0.33);

    const width = +svg.attr('width') - margin.left - margin.right;
    const height = +svg.attr('height') - margin.top - margin.bottom;

    const x = d3.scaleBand().rangeRound([0, width]).padding(0.1);
    const y = d3.scaleLinear().rangeRound([height, 0]);
    x.domain(data.map((d) => { return d.label; }));
    y.domain([0, d3.max(data, (d) => { return d.value; }) + 100]);

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // ----------------Tooltip------------------
    $(`.tooltip_${this.props.chartName}`).remove();
    const tooltip = d3.select('body').append('div').attr('class', `toolTip tooltip_${this.props.chartName}`);

    // ----------------Grid lines---------------------

    // add the X gridlines
    // const xgrid = g.append('g')
    //   .attr('class', 'grid')
    //   .attr('transform', `translate(0,${height})`)
    //   .call(d3.axisBottom(x)
    //     .tickSize(-height)
    //     .tickFormat('')
    //   );

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

    labelX.selectAll('g')
      .on('mouseover', (d) => {
        this.onMouseOver(d);
      })
      .on('mouseout', (d) => {
        this.onMouseOut();
      });
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
    const bar = g.selectAll('.bar')
      .data(data)
      .enter().append('rect')
      .attr('class', 'bar')
      .attr('x', (d) => { return x(d.label); })
      .attr('y', (d) => { return y(d.value); })
      .attr('width', x.bandwidth())
      .attr('height', (d) => { return height - y(d.value) < 0 ? 0 : height - y(d.value); })
      .on('mouseover', (d) => {
        const rect = d3.event.target.getBoundingClientRect();
        const prefix = d.prefix || '';
        const postfix = d.postfix || '';
        const value = d.value.toFixed(2);
        tooltip.html(`<span>${prefix}${value}${postfix}</span>`);
        const left = rect.left + (rect.width / 2) - ($('.toolTip').width() / 2);
        const top = rect.top - ($('.toolTip').height() + 15);
        tooltip.style('left', `${left}px`)
          .style('top', `${top}px`)
          .style('opacity', 1)
          .style('transition', 'left .5s, top .5s');
        this.onMouseOver(d.label);
      })
      .on('mouseout', () => {
        this.onMouseOut();
        tooltip.style('opacity', 0).style('transition', 'opacity .5s');
      });

  }
  render() {
    return (
      <div id="barChart" />
    );
  }
}
export default BarChart;
