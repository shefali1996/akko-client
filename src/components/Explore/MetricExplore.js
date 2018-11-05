import {
    Grid,
    Row,
    Col
  } from "react-bootstrap";
import React, { Component } from 'react';
import Navigationbar from '../Navigationbar'
import ExploreMetrics from '../ExploreMetrics'
import Footer from '../Footer';
import {exploreCard,exploreCardPathPattern} from '../../constants';
class MetricExplore extends Component{

    constructor(props) {
        super(props);
        this.state = {
        
        };
        this.getActiveMetrics = this.getActiveMetrics.bind(this);
        const cardPath = this.props.match.path.match(exploreCardPathPattern)
        this.activeMetricsCardName = exploreCard[cardPath[1]];
    }

    componentDidMount(){

        if(_.isEmpty(this.props.metricsDataByName.data.metricNameData) || _.isEmpty(this.props.userData.data)){
            this.refreshData();
            this.props.getUser();
            this.props.getChannel();
          } else{
            this.setState({
              userData: this.props.userData.data,
              activeMetrics: this.getActiveMetrics()
            }
            );
          }
    }

    componentWillReceiveProps(props){
        this.setState({
            activeMetrics: this.getActiveMetrics(),
            userData: this.props.userData.data
        });
    }

    getActiveMetrics(){
        const data = this.props.metricsDataByName.data.metricNameData;
        for(let index = 0; index < data.length;index++ )
            {
                if(data[index].metric_name == this.activeMetricsCardName){
                    const activeMetrics = data[index];
                    return activeMetrics;
                }      
            }
            
    }

    refreshData() {
        this.props.getMetrics().then((res) => {
            this.props.getMetricsDataByName(this.activeMetricsCardName)
            this.props.getProducts().then((products) => {
            this.props.getVariants(products);
          });
        });
      }
      
    render(){
        return (
            _.isEmpty(this.state.userData) || _.isEmpty(this.state.activeMetrics)?<div></div>:

            <div>
                <Navigationbar history={this.props.history} companyName={this.state.userData.company} />
                <Grid className="page-container">
                <Row className="explore-metrics">
                    <ExploreMetrics
                            clearChartData={this.props.clearChartData}
                            activeMetrics={this.state.activeMetrics}
                            channelData={this.props.channelData}
                            getVendors={this.props.chartData.data.getVendors}
                            getProductBySingleCategory={this.props.chartData.data.getProductBySingleCategory}
                            getTimeBySingleProduct={this.props.chartData.data.getTimeBySingleProduct}
                            getVariantBySingleProduct={this.props.chartData.data.getVariantBySingleProduct}
                            getTimeBySingleVariant={this.props.chartData.data.getTimeBySingleVariant}
                            getCategories={this.props.chartData.data.getCategories}
                            categoriesData={this.props.categoriesData}
                            open = {true}
                            {...this.props}
                            />   
                </Row>
                </Grid>
            </div>    
        );
    }
} 


export default MetricExplore;
