import React, { Component } from "react";
import * as d3 from "d3";
import productImgPlaceholder from "../assets/images/productImgPlaceholder.svg";
import { scaleLinear } from "d3-scale";
import { max } from "d3-array";
import { select } from "d3-selection";
import $ from "jquery";
import {
  plotByOptions,
  vendorOptions,
  categoryOptions,
  bandwidthSize,
  numberFormatter
} from "../constants";
const elementResizeEvent = require('element-resize-event');
const OPTION_TIME = plotByOptions.time;
const OPTION_VENDOR = plotByOptions.vendors;
const OPTION_CATEGORIES = plotByOptions.categories;

const ToolTipIcon = (prefix, value, postfix) =>
  `<span class="value">${prefix}${value}${postfix}</span><div class="drill-down">Click to drill-down further</div>`;

class BarChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: this.props.data || [],
      tooltipDetail: this.props.tooltipDetail || []
    };
    this.createBarChartVendor = this.createBarChartVendor.bind(this);
    this.onMouseOver = this.onMouseOver.bind(this);
    this.onMouseOut = this.onMouseOut.bind(this);
  }
  componentDidMount() {
    const currentOption = this.props.selectedOption;
    if (currentOption === OPTION_VENDOR) {
      window.addEventListener('resize', this.createBarChartVendor);
      this.createBarChartVendor();
    } else if (currentOption === OPTION_CATEGORIES) {
      this.createBarChartCategory();
      window.addEventListener('resize', this.createBarChartCategory);
    }
  }
  componentWillReceiveProps(props) {
    this.setState({
      tooltipDetail: props.tooltipDetail || []
    });
    if (props.data !== this.state.data) {
      this.setState(
        {
          data: props.data,
          tooltipDetail: props.tooltipDetail || []
        },
        () => {
          const currentOption = props.selectedOption;
          if (currentOption === OPTION_VENDOR) {
            this.createBarChartVendor();
          } else if (currentOption === OPTION_CATEGORIES) {
            this.createBarChartCategory();
          }
        }
      );
    }
  }
  componentWillUnmount() {
    $(`.tooltip_${this.props.chartName}`).remove();
  }
  onMouseOver(label) {
    this.props.showDetailOnHover(label);
  }
  onMouseOut() {
    this.props.hideDetail();
  }
  createBarChartVendor() {
    if(document.getElementById("barChart")){
    $("#barChart").empty();
    const currentOption = this.props.selectedOption;    
    const fullHeight = this.props.fullHeight;
    const data = this.state.data;
    const maxBandWidth = 55;
    const step = maxBandWidth * bandwidthSize;
    let fullwidth = document.getElementById("barChart").offsetWidth;    
    const vendorsShowing = this.props.vendorsNav.top;
    const margin = { top: 20, right: 20, bottom: 50, left: 50 };
    const svg = d3
      .select("#barChart")
      .append("svg")
      .attr("width", fullwidth)
      .attr("height", fullHeight * 0.33);

    const width = +svg.attr("width") - margin.left - margin.right;
    const height = +svg.attr("height") - margin.top - margin.bottom;

    const x = d3
      .scaleBand()
      .rangeRound([0, width])
      .align(0);
    const y = d3.scaleLinear().rangeRound([height-20, 0]);
    x.domain(
      data.map(d => {
        return d.email;
      })
    );
    y.domain([
      0,
      d3.max(data, d => {
        return d.value;
      }) + 100
    ]);

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // ----------------Tooltip------------------
    $(`.tooltip_${this.props.chartName}`).remove();
    const tooltip = d3
      .select("body")
      .append("div")
      .attr("class", `toolTip tooltip_${this.props.chartName}`);

    // ----------------Grid lines---------------------
    // add the Y gridlines
    g.append("g")
      .attr("class", "grid")
      .call(
        d3
          .axisLeft(y)
          .ticks(5)
          .tickSize(-width)
          .tickFormat("")
      );
    // ---------------x labels-----------------------------
    const labelX = g
      .append("g")
      .attr("class", "axis axis--x")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x));
    labelX
      .selectAll("g")
      .select("text")
      .text((d, i) => {
        return data[i].label;
      })
      .style("text-anchor", "end")
      .attr("transform", "rotate(-25)")
      .style("color", "red");

    labelX
      .selectAll("g")
      .on("mouseover", d => {})
      .on("mouseout", d => {
        this.onMouseOut();
      });
    // ----------------Y labels---------------------
    const labelY = g
      .append("g")
      .attr("class", "axis axis--y")
      .call(d3.axisLeft(y).ticks(5))

    labelY
      .append("text")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .style("text-anchor", "end")
      .text("Y axis")
      .attr("transform", "rotate(-90)");

    labelY
      .selectAll("g")
      .select("text")
      .text(d => {
        const rangeConvert = numberFormatter(d);
        const prefix = data[0].prefix || "";
        const postfix = data[0].postfix || "";
        return `${prefix}${rangeConvert}${postfix}`;
      });
    const bar = g
      .selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .style("cursor", "pointer")
      .attr("class", "bar")
      .attr("x", d => {           
        return x(d.email);
      })
      .attr("y", d => {
      return  height-20 - y(d.value) < 0 ? height-15   :  y(d.value);
      })
      .attr("width", d => {
        const bandwidth = x.bandwidth();            
        return bandwidth<maxBandWidth?bandwidth:maxBandWidth;
      })
      .attr("height", d => {        
        return height-20 - y(d.value) < 0 ? 15 : height - y(d.value);
      })
      .on("mouseover", d => {
        const rect = d3.event.target.getBoundingClientRect();
        const prefix = d.prefix || "";
        const postfix = d.postfix || "";
        const value = d.value.toFixed(2);
        tooltip.html(`${ToolTipIcon(prefix, value, postfix)}`);
        const top = rect.left - $(".toolTip").width() / 2 + rect.width / 2 + 50;
        const left = rect.top - ($(".toolTip").height() + 15);
        tooltip
          .style("left", `${top}px`)
          .style("top", `${left}px`)
          .style("opacity", 1)
          .style("transition", "left .5s, top .5s")
          .style("z-index", 2000);
      })
      .on("mouseout", () => {
        this.onMouseOut();
        tooltip.style("opacity", 0).style("transition", "opacity .5s");
      })
      .on("click", d => {
        const label = d.label;
        const vendorBarId = d.vendorId;
        let nextOption = false;
        if (vendorsShowing === vendorOptions.vendors) {
          nextOption = vendorOptions.time;
        }
        if (nextOption) {
          this.props.timeByVendor(nextOption, vendorBarId, label);
          this.onMouseOut();
          tooltip.style("opacity", 0).style("transition", "opacity .5s");
        }
      });
    }
  }

  createBarChartCategory=()=> {
    if(document.getElementById("barChart")){

    $("#barChart").empty();    
    const fullHeight = this.props.fullHeight;
    const data = this.state.data;
    const maxBandWidth = 55;
    const step = maxBandWidth * bandwidthSize;
    let fullwidth = document.getElementById("barChart").offsetWidth;
    fullwidth = fullwidth < step * data.length ? step * data.length : fullwidth;
    const categoriesShowing = this.props.categoriesNav.top;
    const margin = { top: 20, right: 20, bottom: 50, left: 50 };
    const svg = d3
      .select("#barChart")
      .append("svg")
      .attr("width", fullwidth)
      .attr("height", fullHeight * 0.33);

    const width = +svg.attr("width") - margin.left - margin.right;
    const height = +svg.attr("height") - margin.top - margin.bottom;

    const x = d3
      .scaleBand()
      .rangeRound([0, width])
      .align(0);
    const y = d3.scaleLinear().rangeRound([height-20, 0]);
    x.domain(
      data.map(d => {
        return d.label;
      })
    );
    y.domain([
      0,
      d3.max(data, d => {
        return d.value;
      }) + 100
    ]);

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    $(`.tooltip_${this.props.chartName}`).remove();
    const tooltip = d3
      .select("body")
      .append("div")
      .attr("class", `toolTip tooltip_${this.props.chartName}`);

    g.append("g")
      .attr("class", "grid")
      .call(
        d3
          .axisLeft(y)
          .ticks(5)
          .tickSize(-width)
          .tickFormat("")
      );
    const labelX = g
      .append("g")
      .attr("class", "axis axis--x")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x));

    if (categoriesShowing === categoryOptions.product) {
      labelX
        .selectAll("g")
        .select("text")
        .text(d => {
          return "";
        });
      labelX
        .selectAll("g")
        .append("image")
        .attr("xlink:href", (d, i) => {
          return data[i].image;
        })
        .attr("x", -28)
        .attr("y", 8)
        .attr("height", maxBandWidth)
        .attr("width", maxBandWidth);
        svg.attr("height",fullHeight * 0.5);
    }

    labelX
      .selectAll("g")
      .on("mouseover", d => {
        this.onMouseOver(d);
      })
      .on("mouseout", d => {
        this.onMouseOut();
      });
    const labelY = g
      .append("g")
      .attr("class", "axis axis--y")
      .call(d3.axisLeft(y).ticks(5))
      .attr("transform","translate(10,0)");


    labelY
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("text-anchor", "end")
      .text("Y axis");
    labelY
      .selectAll("g")
      .select("text")
      .text(d => {
        const rangeConvert = numberFormatter(d);
        const prefix = data[0].prefix || "";
        const postfix = data[0].postfix || "";
        return `${prefix}${rangeConvert}${postfix}`;
      });

    const bar = g
      .selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar cursor-pointer")
      .attr("x", d => {
        const bandwidth = x.bandwidth();        
        return bandwidth > maxBandWidth
          ? x(d.label) + bandwidth / 2 - maxBandWidth / 2
          : x(d.label);
      })
      .attr("y", d => {        
        return height -20- y(d.value) < 0 ? height-15 :y(d.value)})
      .attr("width", d => {
        const bandwidth = x.bandwidth();        
        return bandwidth<maxBandWidth?bandwidth:maxBandWidth;
      })
      .attr("height", d => {
        return height-20 - y(d.value) < 0 ? 15 : height - y(d.value);
      })
      .on("mouseover", d => {        
        this.onMouseOver(d.categoryBarId);
        const rect = d3.event.target.getBoundingClientRect();
        const prefix = d.prefix || "";
        const postfix = d.postfix || "";
        let productInfo = this.state.tooltipDetail;
        const value = d.value.toFixed(2);
        const left = rect.left + rect.width / 2 - $(".toolTip").width() / 2;
        const top = rect.top - ($(".toolTip").height() + 15);
        if (_.isEmpty(this.state.tooltipDetail)) {          
          tooltip.html( `${ToolTipIcon(prefix, value, postfix)}`);
        } else {
          let productImage =
            productInfo &&
            productInfo.variants.length &&
            productInfo.variants[0].imageUrl;
          if (productImage === null || productImage === "null") {
            productImage = productImgPlaceholder;
          }
          tooltip.html(
            `<div class="main"><img class="product-image" src="${productImage}"/><div class="container-div"><div class="product-title">${
              productInfo.productTitle
            }</div><span class="value">${prefix}${value}${postfix}</span></div></div><div class="drill-down">Click to drill-down further</div>`
          );
        }
        tooltip
          .style("left", `${left}px`)
          .style("top", `${top}px`)
          .style("opacity", 1)
          .style("transition", "left .5s, top .5s")
          .style("z-index", 2000);
      })
      .on("mouseout", () => {
        this.onMouseOut();
        tooltip.style("opacity", 0).style("transition", "opacity .5s");
      })
      .on("click", d => {        
        const label = d.label;
        const categoryBarId = d.categoryBarId;
        let nextOption = false;
        if (categoriesShowing === categoryOptions.categories) {
          nextOption = categoryOptions.product;
        } else if (categoriesShowing === categoryOptions.product) {
          nextOption = categoryOptions.variant;
        } else if (categoriesShowing === categoryOptions.variant) {
          nextOption = categoryOptions.time;
        }
        if (nextOption) {
          this.props.productsByCategory(nextOption, categoryBarId, label);
          this.onMouseOut();
          tooltip.style("opacity", 0).style("transition", "opacity .5s");
        }
      });
    }
  }
  render() {
    return <div id="barChart" />;
  }
}
export default BarChart;
