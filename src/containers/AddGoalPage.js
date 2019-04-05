import { connect } from 'react-redux';
import AddGoalPage from '../components/goals/AddGoalPage';
import find from "lodash/find";
import { deleteGoal, addGoal, hideModal } from '../redux/page/addGoal/action';
import * as dashboardActions from '../redux/dashboard/actions';
import {getAllGoals} from '../redux/page/goals/actions';
import {withRouter} from 'react-router';

const getGoalData = (id, goals) => {
    return goals[id];
}

const getFilterVendors = (products) => {
    let vendors = [];
    let vendorsList = new Set();
    products.forEach(element => {
        const prevLen = vendorsList.size;
        vendorsList.add(element.vendorId);
        if(prevLen !== vendorsList.size){
            vendors.push({id: element.vendorId, title: element.vendor });
        }
    });
    return vendors;
}


const getFilterCategories = (products) => {
    let categories = [];
    let categoriesList = new Set();
    products.forEach(element => {
        if(element.categoryId){
            const prevLen = categoriesList.size;
            categoriesList.add(element.categoryId);
            if(prevLen !== categoriesList.size){
                categories.push({id: element.categoryId, title: element.category });
            }
        }
    });
    return categories;
}

const getProducts = (data) => {
    let products = {};
    data.forEach(element => {
        products[element.productId] = {id: element.productId, title: element.productTitle };
    });
    return products;
}

const getVariants = (data) => {
    let variants = [];
    data.forEach(element => {
        variants[element.variantId] = { id: element.variantId, title: element.variantTitle };
    });
    return variants;
}

const getCustomers = () => {
    return {};
}

const mapStateToProps = state => {
    const { goals, dashboard, addGoal: addGoalState, products: { products: { data: { products = [], variants = [] } = { products: [], variants: [] } } = {} } = {} } = state;
    return {
        userData: dashboard.userData.data,
        channelData: dashboard.channelData,
        data: getGoalData(addGoalState.id, goals),
        metrics: dashboard.metricsData.data.metrics,
        goalsConfig: dashboard.userData.data.goalsConfig,
        //products: getProducts(products),
        productData: state.products.products,
        vendors: getFilterVendors(products),
        variants: getVariants(variants),
        categories: getFilterCategories(products),
        customers: getCustomers(),
        visible: addGoalState.visible,
        type: addGoalState.type,
        isLoading: addGoalState.isLoading,
        isSuccess: addGoalState.isSuccess,
        isError: addGoalState.isError,
        message: addGoalState.message,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        addGoal: (data) => {
            return dispatch(addGoal(data));
        },
        deleteGoal: (goalId) => {
            return dispatch(deleteGoal(goalId));
        },
        hideAddGoal: () => {
            return dispatch(hideModal());
        },
        getMetrics: () => {
            return dispatch(dashboardActions.getMetrics());
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
        getMetricsDataByName:(metricsName)=>{
        return dispatch(dashboardActions.getMetricsDataByName(metricsName))
        },
        getAllGoals: () => {
        return dispatch(getAllGoals());
        },
        openEditGoal: (data)=>{
        return dispatch(showModal(data));
        },
    }
};


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AddGoalPage));

