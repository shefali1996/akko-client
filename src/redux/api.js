export const metrics = '/metrics';

export const customers = () => '/customers';
export const products = '/products';
export const getProductVariants = productId => `/products/${productId}`;

export const metricsPathForTime = (metric_name, shopId) => `/metrics/${metric_name}/shop/${shopId}`;
export const metricsPathForProduct = metric_name => `/metrics/${metric_name}/product`;
export const metricsPathForCustomer = metric_name => `/metrics/${metric_name}/customer`;
export const metricsPathForCategory = metric_name => `/metrics/${metric_name}/category`;
export const metricsPathForProductByCategory = (metric_name, categoryId) => `/metrics/${metric_name}/category/${categoryId}`;
export const metricsPathForVariantsByProduct = (metric_name, productId) => `/metrics/${metric_name}/product/${productId}`;
export const user = '/user';
export const channel = '/channel';
export const getCount = '/products/count';
export const dataLoadStatus = shopId => `/status/${shopId}`;
