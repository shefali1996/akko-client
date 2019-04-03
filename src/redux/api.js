export const user = '/user';
export const metrics = '/metrics';
export const channel = '/channel';
export const products = '/products';
export const bugReport = '/bugReport';
export const cogsStatus = '/cogsStatus';
export const getCount = '/products/count';
export const getLuTimestamp = '/lastUpdated';
export const connectShopify = '/connect-shopify';
export const dataLoadStatus = shopId => `/status/${shopId}`;
export const getProductVariants = productId => `/products/${productId}`;
export const metricsPathForTime = (metric_name) => `/metrics/${metric_name}`;
export const metricsPathForVendor = metric_name => `/metrics/${metric_name}/vendors`;
export const metricsPathForCategory = metric_name => `/metrics/${metric_name}/categories`;
export const metricsPathForTimeByVendor = (metric_name, vendorId) => `/metrics/${metric_name}/vendors/${vendorId}`
export const metricsPathForVariantsByProduct = (metric_name, productId) => `/metrics/${metric_name}/products/${productId}`;
export const metricsPathForTimeBySingleProduct = (metric_name, productId) => `/metrics/${metric_name}/products/${productId}`;
export const metricsPathForProductByCategory = (metric_name, categoryId) => `/metrics/${metric_name}/categories/${categoryId}`;
export const metricsPathForVariantBySingleProduct = (metric_name, productId) => `/metrics/${metric_name}/products/${productId}/variants`;
export const metricsPathForProductBySingleCategory = (metric_name, categoryId) => `/metrics/${metric_name}/categories/${categoryId}/products`;
export const metricsPathForTimeBySingleVariant = (metric_name, productId, variantId) => `/metrics/${metric_name}/products/${productId}/variants/${variantId}`
export const metricsDataByName=metric_name=> `/metrics/${metric_name}/summary`;

//goals api endpoint
export const allGoals = () => `/goals/all`;
export const activeGoals = () => `/goals/active`;
export const addGoalURL = () => `/goals`;
export const deleteGoalURL = (goalId) => `/goals/${goalId}`;
export const editGoalURL = (goalId) => `/goals/${goalId}/edit`;
export const archiveGoalURL = goalId => `/goals/${goalId}/archive`;