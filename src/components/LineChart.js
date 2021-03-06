import React, { Component } from "react";
import * as d3 from "d3";
import { scaleLinear } from "d3-scale";
import { max } from "d3-array";
import { select } from "d3-selection";
import $ from "jquery";
import isEqual from "lodash/isEqual"
import cloneDeep from "lodash/cloneDeep"
import sortBy from "lodash/sortBy"
import { plotByOptions, numberFormatter,bandwidthSize } from "../constants";
import style from 'styles/global/variables.scss'

const moment = require("moment");
const elementResizeEvent = require("element-resize-event");

const OPTION_TIME = plotByOptions.time;
const OPTION_PRODUCT = plotByOptions.product;
const OPTION_VENDOR = plotByOptions.vendors;
const OPTION_CATEGORIES = plotByOptions.categories;
const METRICS_CARD = "metrics_card";

class LineChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: sortBy(props.data, "index") || [],
      chart: ""
    };
    this.createLineChartTime = this.createLineChartTime.bind(this);
  }
  componentDidMount() {    
    const currentOption = this.props.selectedOption;
    this.setState(
      {chart: (<div id={`chart_${this.props.chartName}`} className="line-chart" /> )},
      () => {        
        if (
          currentOption === OPTION_CATEGORIES ||
          currentOption === OPTION_VENDOR ||
          currentOption === OPTION_TIME || currentOption === METRICS_CARD
        ) {
          this.createLineChartTime();
          window.addEventListener('resize', this.createLineChartTime);
        }
      }
    );
  }


  componentWillReceiveProps(props) {
    if (!isEqual(props.data, this.state.data)) {
      this.setState(
        {
          data: sortBy(props.data, "index") || [],
          chart: <div id={`chart_${this.props.chartName}`} />
        },
        () => {
          this.createLineChartTime();
        }
      );
    }
  }
 
  componentWillUnmount() {
    $(`.tooltip_${this.props.chartName}`).remove();
  }
  createLineChartTime() {        
    if(document.getElementById(`chart_${this.props.chartName}`)){
    $(`#chart_${this.props.chartName}`).empty();
    const currentOption = this.props.selectedOption;
    let fullwidth =
      document.getElementById(`chart_${this.props.chartName}`) == null
        ? 904
        : document.getElementById(`chart_${this.props.chartName}`).clientWidth;        
    let fullHeight = this.props.fullHeight;
    const data = cloneDeep(this.state.data);
    const margin = {
      top: 20,
      right: 10,
      bottom: 50,
      left: 55,
      svgWidthOffset: 10
    };
    if (currentOption === OPTION_CATEGORIES) {
      fullHeight *= 0.33;
    } else if (currentOption === OPTION_VENDOR) {
      fullHeight *= 0.33;
    } else if (currentOption === OPTION_TIME) {
      fullHeight *= 0.33;
    } else if (currentOption === METRICS_CARD) {
      fullHeight = fullwidth * 0.5;
    }

    if(currentOption !== METRICS_CARD){
      const maxBandWidth = 55;
      const step = maxBandWidth * bandwidthSize; 
      fullwidth = fullwidth < step * data.length ? step * data.length : fullwidth;
    }
    
    const chart = d3.select(`#chart_${this.props.chartName}`);
    const svg = chart
      .append("svg")
      .attr("width", fullwidth)
      .attr("height", fullHeight);

    const width = +svg.attr("width") - margin.left - margin.right;
    const height = +svg.attr("height") - margin.top - margin.bottom;
    const parseTime = d3.timeParse("%b %y");
    const bisectDate = d3.bisector(d => {
      return d.label;
    }).left;
    data.forEach(d => {
      d.label = parseTime(d.label);
      d.value = +d.value;
    });
    const x = d3.scaleTime().rangeRound([0, width]);
    const y = d3.scaleLinear().rangeRound([height, 0]);
    x.domain(
      d3.extent(data, d => {
        return d.label;
      })
    );
    if (data[0] == undefined) {
      y.domain(
        d3.extent(data, d => {
          return d.value;
        })
      );
    } else {
      if (data[0].postfix == " days") {
        y.domain([
          0,
          d3.max(data, d => {
            return d.value;
          })
        ]);
      } else {
        y.domain(
          d3.extent(data, d => {
            return d.value;
          })
        );
      }
    }

    const g = svg
      .append("g")
      .attr(
        "transform",
        `translate(${margin.left - margin.svgWidthOffset},${margin.top})`
      )
      .attr("padding", "30");
    $(`.tooltip_${this.props.chartName}`).remove();
    const tooltip = d3
      .select("body")
      .append("div")
      .attr("class", `toolTip tooltip_${this.props.chartName}`)

    g.append("g")
      .attr("class", "grid")
      .call(
        d3
          .axisLeft(y)
          .ticks(5)
          .tickSize(-width)
          .tickFormat("")
      )
      .attr("transform", "translate(10,0)");
    const labelX = g
      .append("g")
      .attr("class", "axis axis--x")
      .attr("transform", `translate(10,${height})`)
      .call(
        d3
          .axisBottom(x)
          .ticks(data.length)
          .tickFormat(d3.timeFormat("%b %y"))
      );

    const labelY = g
      .append("g")
      .attr("class", "axis axis--y")
      .call(d3.axisLeft(y).ticks(5))
      .attr("transform", "translate(10,0)");

    labelY
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("text-anchor", "end")
    labelY
      .selectAll("g")
      .select("text")
      .text(d => {
        const rangeConvert = numberFormatter(d);
        const prefix = data[0].prefix || "";
        const postfix = data[0].postfix || "";
        return `${prefix}${rangeConvert}${postfix}`;
      });
      var area = d3.area()
      .x(function(d) { return x(d.label); })
      .y0(height)
      .y1(function(d) { return y(d.value); });

    const valueline = d3
      .line()
      .x(d => {
        return x(d.label);
      })
      .y(d => { 
        return y(d.value);
      });
      svg.append("path")
      .data([data])
      .attr("class", "area")
      .attr("d", area)
      .attr(
        "transform",
        `translate(${margin.left},${margin.top})`
      )
      .attr("fill",`${style['mainBlueColor']}`)
      .attr("opacity",".13")

      
    g.append("path")
      .data([data])
      .attr("class", "draw-line")
      .attr("d", valueline(data))
      .attr("transform", "translate(10,0)");

    g.selectAll(".dot")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "dot")
      .attr("cx", (d, i) => {
        return x(d.label);
      })
      .attr("cy", d => {
        return y(d.value);
      })
      .attr("r", 5)
      .attr("transform", "translate(10,0)");

    const focus = g
      .append("g")
      .attr("class", "focus")
      .style("display", "none");

    focus.append("circle").attr("r", 7.5);

    g.select(".axis--x")
      .selectAll("text")
      .attr("transform", "translate(-10,0)");

    const rect = svg
      .append("rect")
      .attr("transform", `translate(${margin.left - 7},${margin.top})`)
      .attr("class", "overlay")
      .attr("width", width)
      .attr("height", height)
      .on("mouseover", () => {
        $(`.tooltip_${this.props.chartName}`).css("display", "inline");

        focus.style("display", null);
      })
      .on("mouseout", () => {
        focus.style("display", "none");
        tooltip.style("opacity", 0);
      });

    const tooltip_box = d => {
      setTimeout(() => {
        const point = focus.node().getBoundingClientRect();
        const prefix = d.prefix || "";
        const postfix = d.postfix || "";
        const value = d.value.toFixed(2);
        const xLabel = moment(d.label).format("MMM YY");
        tooltip.html(
          `<div class="xLabel">${xLabel}</div><span class="value">${prefix}${value}${postfix}</span>`
        );
        const left = point.left + point.width / 2;
        const top = point.top;
        tooltip
          .style("left", `${left}px`)
          .style("top", `${top}px`)
          .style("opacity", 1)
          .style("z-index", 2000);
      }, 250);
    };

    const removeToolTip = () => {
      $(`.tooltip_${this.props.chartName}`).css("display", "none");
    };
    const mousemove = () => {
      let x0 = x.invert(d3.mouse(d3.event.currentTarget)[0]),
        i = bisectDate(data, x0, 1),
        d0 = data[i - 1],
        d1 = data[i],
        d = x0 - d0.label > d1.label - x0 ? d1 : d0;
      tooltip_box(d);
      focus.attr("transform", `translate(${x(d.label) + 10},${y(d.value)})`);
      focus.select(".x-hover-line").attr("y2", height - y(d.value));
      focus.select(".y-hover-line").attr("x2", width + width);
    };
    rect.on("mousemove", mousemove);
    svg.on("mouseleave", removeToolTip);
  }
}

  render() {   
     if(this.state.data.length===1){
       return <div className="single-vlaue-line-chart">
                 <div className="single-value"><div id="value-prefix">{this.state.data[0].prefix}{Number(this.state.data[0].value).toFixed(0)}</div></div>
                 <div id="shaded-area"></div>
                 <div className="single-label">{this.state.data[0].label}</div>
           </div>
     }  
    let overflow_x = ""
    if(this.props.selectedOption != METRICS_CARD){
      overflow_x = "overflow_x"
    }
    return <div className={overflow_x}>{this.state.chart} </div>;
  }
}
export default LineChart;
