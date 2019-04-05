import { connect } from 'react-redux';
import EditGoalModal from '../../components/goals/EditGoalModal';
import {deleteGoal,addGoal,showModal,hideModal} from '../../redux/page/addGoal/action';

const getGoalData = (id,goals)=>{
    return goals[id];
}

const getVendors = (products)=>{
    let vendors = {};

    products.forEach(element => {
        vendors[element.vendorId] = {id:element.vendorId,title:element.vendor};
    });
    return vendors;
}

const getCategories = (products)=>{
    let categories = {};

    products.forEach(element => {
        categories[element.categoryId] = {id:element.categoryId,title:element.category};
    });
    return categories;
}

const getProducts = (data)=>{
    let products = {};

    data.forEach(element => {
        products[element.productId] = {id:element.productId,title:element.productTitle};
    });
    return products;
}

const getVariants = (data)=>{
    let variants = [];

    data.forEach(element => {
        variants[element.variantId] = {id:element.variantId,title:element.variantTitle};
    });
    return variants;
}

const getCustomers = ()=>{
    return {};
}




const mapStateToProps = state => {
    const {goals,dashboard,addGoal:addGoalState,products:{products:{data:{products=[],variants=[]}={products:[],variants:[]}}={}}={}} = state; 
    return {
        channelData:    dashboard.channelData,
        data : getGoalData(addGoalState.id,goals),
        metrics:dashboard.metricsData.data.metrics,
        products: getProducts(products),
        vendors: getVendors(products),
        variants: getVariants(variants),
        categories:getCategories(products),
        customers:getCustomers(),
        visible:addGoalState.visible,
        type:addGoalState.type,
        isLoading:addGoalState.isLoading,
        isSuccess:addGoalState.isSuccess,
        isError:addGoalState.isError,
        message:addGoalState.message,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        showModal: (data) => {
            return dispatch(showModal(data));
        },
        
        hideModal: () => {
            return dispatch(hideModal());
        },
        addGoal: (data)=>{
            return dispatch(addGoal(data));
        },
        deleteGoal: (goalId) => {
            return dispatch(deleteGoal(goalId));
        }
    }    
};


export default connect(mapStateToProps, mapDispatchToProps)(EditGoalModal);

