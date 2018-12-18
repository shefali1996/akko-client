import React, { Component } from "react";
import * as d3 from "d3";
import productImgPlaceholder from "../assets/images/productImgPlaceholder.svg";
import $ from "jquery";
import {
  plotByOptions,
  vendorOptions,
  categoryOptions,
  bandwidthSize,
  numberFormatter
} from "../constants";
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
    this.createBarChart = this.createBarChart.bind(this);
    this.onMouseOver = this.onMouseOver.bind(this);
    this.onMouseOut = this.onMouseOut.bind(this);
    this.onClickBar = this.onClickBar.bind(this);
    this.onVendorClick = this.onVendorClick.bind(this)
    this.onCategoriesClick = this.onCategoriesClick.bind(this)
    this.currentOption = this.props.selectedOption
    this.currentlyShowing = ""
  }
  
  componentDidMount() {
    this.setCurrentlyShowing()
    this.createBarChart();
    window.addEventListener("resize",this.createBarChart);
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
          this.currentOption = this.props.selectedOption;
          this.setCurrentlyShowing();
          this.createBarChart();
        }
      );
    }
  }
  componentWillUnmount() {
    $(`.tooltip_${this.props.chartName}`).remove();
    window.removeEventListener('resize',this.createBarChart);
  }

  setCurrentlyShowing(){
    if(this.currentOption === OPTION_CATEGORIES){
      this.currentlyShowing = this.props.categoriesNav.top;
    }
    else if(this.currentOption === OPTION_VENDOR){
      this.currentlyShowing = this.props.vendorsNav.top;
    }
  }

  onClickBar(d){
    
    if(this.currentOption === OPTION_CATEGORIES){
      this.onCategoriesClick(d);
    }
    else if(this.currentOption === OPTION_VENDOR){
      this.onVendorClick(d);
    }
  }

  onVendorClick(d){
    const label = d.label;
    const vendorBarId = d.vendorId;
    let nextOption = false;
    if (this.currentlyShowing === vendorOptions.vendors) {
      nextOption = vendorOptions.time;
    }
    if (nextOption) {
      this.props.timeByVendor(nextOption, vendorBarId, label);
      this.onMouseOut();
    }
  }

  onCategoriesClick(d){

    const label = d.label;
    const categoryBarId = d.categoryBarId;
    let nextOption = false;
    if (this.currentlyShowing === categoryOptions.categories) {
      nextOption = categoryOptions.product;
    } else if (this.currentlyShowing === categoryOptions.product) {
      nextOption = categoryOptions.variant;
    } else if (this.currentlyShowing === categoryOptions.variant) {
      nextOption = categoryOptions.time;
    }
    if (nextOption) {
      this.props.productsByCategory(nextOption, categoryBarId, label);
      this.onMouseOut();
    }

  }

  onMouseOver(label) {
    this.props.showDetailOnHover(label);
  }
  onMouseOut() {
    this.props.hideDetail();
  }

  createBarChart(){
    if(document.getElementById("barChart")){
      $("#barChart").empty(); 
      const fullHeight = this.props.fullHeight;  
      const data = this.state.data ||[];
      const maxBandWidth = 55;
      const step = maxBandWidth * bandwidthSize;
      let fullwidth = document.getElementById("barChart").offsetWidth;    
      fullwidth = fullwidth < step * data.length ? step * data.length : fullwidth;
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
      
      const minValue = d3.min(data,d=>{
        return d.value;
      });
  
      const min = minValue>=0?0:minValue-100; 
  
      y.domain([
        min,
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

      if (this.currentlyShowing === categoryOptions.product){
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
      }
      else{
        labelX
        .selectAll("g")
        .select("text")
        .text((d, i) => {
          return data[i].label;
        })
        .style("text-anchor", "end")
        .attr("transform", "rotate(-25)")
        .style("color", "red");
      }
      
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
        .attr("transform", "rotate(-90)");
  
      labelY
        .selectAll("g")
        .select("text")
        .text(d => {
          const value = Math.abs(d)
          const isNegative = d>=0?false:true;
          const rangeConvert = numberFormatter(value);
          const prefix = data[0].prefix || "";
          const postfix = data[0].postfix || "";
          if(isNegative){
            return `-${prefix}${rangeConvert}${postfix}`;
          }
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
          : x(d.label)
        })
        .attr("y", d => { 
          const height2 = d.value > 0 ? y(0) - y(d.value) : y(d.value) - y(0)          
          if(d.value>0){
            return  height2 > 15 ? y(d.value) :y(0)-15;
          } else{
            return y(0);
          }    
          })
        .attr("width", d => {
          const bandwidth = x.bandwidth();        
          return bandwidth<maxBandWidth?bandwidth:maxBandWidth;
        })
        .attr("height", d => {
          const height3 = d.value > 0 ? y(0) - y(d.value) : y(d.value) - y(0)
          if(height3<=15){
            return  15;
          }
          else return height3
           
        })
        .on("mouseover", d => {
          const rect = d3.event.target.getBoundingClientRect();
          const prefix = d.prefix || "";
          const postfix = d.postfix || "";
          const value = d.value.toFixed(2);
          const top = rect.left - $(".toolTip").width() / 2 + rect.width / 2 + 50;
          const left = rect.top - ($(".toolTip").height() + 15);
          tooltip
            .style("left", `${top}px`)
            .style("top", `${left}px`)
            .style("opacity", 1)
            .style("transition", "left .5s, top .5s")
            .style("z-index", 2000);
          if(this.currentOption === OPTION_CATEGORIES){
            this.onMouseOver(d.categoryBarId);
          }
          const productInfo = this.state.tooltipDetail

            if (_.isEmpty(productInfo)) {          
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
        })
        .on("mouseout", () => {
          this.onMouseOut();
          tooltip.style("opacity", 0).style("transition", "opacity .5s");
        })
        .on("click", d => {
            this.onClickBar(d);
            tooltip.style("opacity", 0).style("transition", "opacity .5s");
        });
        svg.attr("height",fullHeight * 0.35);
      }
  }

  render() {
    return <div id="barChart" className="bar-chart" />;
  }
}
export default BarChart;