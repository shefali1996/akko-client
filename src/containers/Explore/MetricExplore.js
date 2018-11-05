import {connect} from 'react-redux';
import {withRouter} from 'react-router';
import * as dashboardActions from '../../redux/dashboard/actions';
import MetricExplore from '../../components/Explore/MetricExplore';

const mapStateToProps = state => {
    return {
        metricsData:    state.dashboard.metricsData,
        chartData:      state.exploration.chartData,
        productData:    state.products.products,
        userData:       state.dashboard.userData,
        channelData:    state.dashboard.channelData,
        lastUpdated:    state.dashboard.lastUpdated,
        categoriesData: state.dashboard.categoriesData,
        dataLoadStatus: state.dashboard.dataLoadStatus,
        metricsDataByName:state.dashboard.metricsDataByName,
    };
  };

  const mapDispatchToProps = (dispatch) => {
    return {
      getMetrics: () => {
        return dispatch(dashboardActions.getMetrics());
      },
      getChartData: (path, activeMetrics, metric_map, queryParams, shopId) => {
        return dispatch(dashboardActions.getChartData(path, activeMetrics, metric_map, queryParams, shopId));
      },
      emptyTimeFrameData: () => {
        return dispatch(dashboardActions.emptyTimeFrameData());
      },
      getProducts: () => {
        return dispatch(dashboardActions.getProducts());
      },
      getVariants: (products) => {
        return dispatch(dashboardActions.getVariants(products));
      },
      getUser: () => {
        return dispatch(dashboardActions.getUser());
      },
      getChannel: () => {
        return dispatch(dashboardActions.getChannel());
      },
      getDataLoadStatus: (shopId) => {
        return dispatch(dashboardActions.getDataLoadStatus(shopId));
      },
      updateMetrics: (lastUpdated) => {
        return dispatch(dashboardActions.updateMetrics(lastUpdated));
      },
      getCategories: (params) => {
        return dispatch(dashboardActions.getCategories(params));
      },
      getVendors: (params) => {
        return dispatch(dashboardActions.getVendors(params));
      },
      getProductBySingleCategory: (params) => {
        return dispatch(dashboardActions.getProductBySingleCategory(params));
      },
      getTimeBySingleProduct: (params) => {
        return dispatch(dashboardActions.getTimeBySingleProduct(params));
      },
      getVariantBySingleProduct: (params) => {
        return dispatch(dashboardActions.getVariantBySingleProduct(params));
      },
      getTimeBySingleVariant: (params) => {
        return dispatch(dashboardActions.getTimeBySingleVariant(params));
      },
      updateProducts: (params) => {
        return dispatch(dashboardActions.updateProducts(params));
      },
      clearChartData: () => {
        return dispatch(dashboardActions.getClearChartData());
      },
      getLuTimestamp:()=>{
        return dispatch(dashboardActions.getLuTimestamp());
      },
      getMetricsDataByName:(metricsName)=>{
       return dispatch(dashboardActions.getMetricsDataByName(metricsName))
      }
    };
  };


  export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MetricExplore));

