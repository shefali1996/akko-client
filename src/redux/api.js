export const metrics = '/metrics';
export const metricsPathForTime = (metric_name, shopId) => `/metrics/${metric_name}/shop/${shopId}`;
export const metricsPathForProduct = metric_name => `/metrics/${metric_name}/product`;
export const metricsPathForCustomer = metric_name => `/metrics/${metric_name}/customer`;
export const user = '/user';
export const channel = '/channel';
