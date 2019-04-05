export const GOAL_FIELDS = {
  GOAL_NAME: "name",
  SHOP_ID: "shopId",
  START_DATE: "startDate",
  END_DATE: "endDate",
  METRIC: "metric",
  CONDITION: "comparisonOperator",
  CONTEXT: "context",
  CONTEXT_VALUE: "filters.contextValue",
  TARGET: "target"
};


//metrics
export const METRICS_TYPE = {
  TOTAL_SALES: "total_sales",
  GROSS_PROFIT: "gross_profit",
  AVERAGE_MARGIN: "avg_margin",
  NUMBER_OF_ORDERS: "number_of_orders",
  AVERAGE_ORDER_VALUE: "avg_order_value",
  REORDER_FREQUENCY: "reorder_frequency",
  REPEAT_RATE: "repeat_rate"
};

//contexts
export const CONTEXTS = {
  VENDOR: "vendor",
  PRODUCT: "product",
  VARIANT: "variant",
  CATEGORY: "category",
  CUSTOMER: "customer"
};

export const CARD_TYPE = {
  DELETED: "DELETED",
  INACTIVE: "INACTIVE",
  ACTIVE: "ACTIVE",
  ONGOING: "ONGOING",
  SUCCESS: "SUCCESS",
  FAILED: "FAILED",
  ARCHIVED: "ARCHIVED",
  SCHEDULED: "SCHEDULED",
  ACHIEVED: "ACHIEVED"
};

export const TARGET_CONDITIONS = [">="];

export const TIME_PERIOD = {
  PER_MONTH:"PER_MONTH",
  PER_QUARTER:"PER_QUARTER",
  CUSTOM:"CUSTOM_DATES"
};

export const MONTHS = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
export const QUARTER_MONTHS = ['Q1','Q2','Q3','Q4'];
export const FILTERTABS = [CONTEXTS.VENDOR,CONTEXTS.PRODUCT,CONTEXTS.CATEGORY];