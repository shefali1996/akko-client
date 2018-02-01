import React, { Component } from 'react';
import * as d3 from 'd3';
import { scaleLinear } from 'd3-scale';
import { max } from 'd3-array';
import { select } from 'd3-selection';
import $ from 'jquery';
import {isEqual} from 'lodash';
import {plotByOptions} from '../constants';

const elementResizeEvent = require('element-resize-event');

const OPTION_TIME = plotByOptions.time;
const OPTION_PRODUCT = plotByOptions.product;
const OPTION_CUSTOMER = plotByOptions.customer;
const METRICS_CARD = 'metrics_card';

class LineChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: this.props.data || []
    };
    this.createLineChartTime = this.createLineChartTime.bind(this);
  }
  componentDidMount() {
    const currentOption = this.props.selectedOption;
    this.setState({
      chart: <div id={`chart_${this.props.chartName}`} />
    }, () => {
      if (currentOption === OPTION_TIME) {
        this.createLineChartTime();
      } else if (currentOption === METRICS_CARD) {
        this.createLineChartTime();
        const element = document.getElementById('cardSection');
        elementResizeEvent(element, () => {
          this.createLineChartTime();
        });
      }
    });
  }
  componentWillReceiveProps(props) {
    if (!isEqual(props.data, this.state.data)) {
      this.setState({
        data:  props.data,
        chart: <div id={`chart_${this.props.chartName}`} />
      }, () => {
        this.createLineChartTime();
      });
    }
  }

  createLineChartTime() {
    $(`#chart_${this.props.chartName}`).empty();
    const currentOption = this.props.selectedOption;
    const fullwidth = document.getElementById(`chart_${this.props.chartName}`).offsetWidth;
    let fullHeight = this.props.fullHeight;
    const data = this.state.data;
    const margin = {top: 20, right: 20, bottom: 50, left: 50};
    if (currentOption === OPTION_TIME) {
      fullHeight *= 0.33;
    } else if (currentOption === METRICS_CARD) {
      fullHeight = fullwidth * 0.5;
    }
    const svg = d3.select(`#chart_${this.props.chartName}`).append('svg')
      .attr('width', fullwidth)
      .attr('height', fullHeight);

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
      .attr('x', (d, i) => {
        if (data.length > 1) {
          return -(x(data[1].label) - x(data[0].label)) / 2;
        }
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

    // ---------------------Draw Line ------------------
    const valueline = d3.line()
      .x((d) => { return x(d.label); })
      .y((d) => { return y(d.value); });

    // Add the valueline path.
    g.append('path')
      .data([data])
      .attr('class', 'draw-line')
      .attr('d', valueline(data));

    g.selectAll('.dot')
      .data(data)
      .enter().append('circle') // Uses the enter().append() method
      .attr('class', 'dot') // Assign a class for styling
      .attr('cx', (d, i) => { return x(d.label); })
      .attr('cy', (d) => { return y(d.value); })
      .attr('r', 5)
      .on('mouseover', (d) => {
        const point = d3.event.target.getBoundingClientRect();
        const prefix = d.prefix || '';
        const postfix = d.postfix || '';
        const value = d.value.toFixed(2);
        tooltip.html(`<span>${prefix}${value}${postfix}</span>`);
        const left = point.left - ($('.toolTip').width() / 2) + (point.width / 2);
        const top = point.top - ($('.toolTip').height() + 15);
        tooltip.style('left', `${left}px`)
          .style('top', `${top}px`)
          .style('opacity', 1)
          .style('transition', 'left .5s, top .5s');
      })
      .on('mouseout', () => {
        tooltip.style('opacity', 0).style('transition', 'opacity .5s');
      });

  }

  render() {
    return (
      <div>{this.state.chart}</div>
    );
  }
}
export default LineChart;
