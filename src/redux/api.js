export const metrics = '/metrics';

export const metricsPathForTime = metric_name => `/metrics/${metric_name}/shop/akkotest`;
export const metricsPathForProduct = metric_name => `/metrics/${metric_name}/product`;
export const metricsPathForCustomer = metric_name => `/metrics/${metric_name}/customer`;

export const customers = () => '/customers';
export const products = '/products';
export const getProductVariants = productId => `/products/${productId}`;
