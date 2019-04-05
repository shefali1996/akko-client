import React, { Component } from "react";
import { Modal, Form, Input, Select, DatePicker, Spin } from "antd";
import { Row, Col, Button } from "react-bootstrap";
import moment from "moment";
import addIcon from "../../assets/images/addGoal.svg";
import deleteIcon from "../../assets/images/delete.svg";
import calendar from "../../assets/images/calendar.svg";
import checkIcon from "../../assets/images/check.svg";
import downArrow from "../../assets/images/selectDownArrow.svg";
import { throttle } from "lodash";
import { METRICS_TYPE, GOAL_FIELDS, CONTEXTS } from "./constant";
import "antd/es/modal/style/index"

const calendarIcon = (
  <img alt="c" style={{ width: 24, height: 24 }} src={calendar} />
);
const downArrowIcon = (
  <img alt="!" src={downArrow} style={{ width: 20, height: 20 }} />
);

const FormItem = Form.Item;
const Option = Select.Option;

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

const {
  GOAL_NAME,
  SHOP_ID,
  START_DATE,
  END_DATE,
  METRIC,
  CONDITION,
  CONTEXT,
  CONTEXT_VALUE,
  TARGET
} = GOAL_FIELDS;
const {
  TOTAL_SALES,
  GROSS_PROFIT,
  AVERAGE_MARGIN,
  NUMBER_OF_ORDERS,
  AVERAGE_ORDER_VALUE,
  REORDER_FREQUENCY,
  REPEAT_RATE
} = METRICS_TYPE;

const CURRENT_VALID_METRICS = [
  TOTAL_SALES,
  GROSS_PROFIT,
  AVERAGE_MARGIN,
  REORDER_FREQUENCY,
  REPEAT_RATE,
  NUMBER_OF_ORDERS
];
const { VENDOR, PRODUCT, VARIANT, CATEGORY, CUSTOMER } = CONTEXTS;

const METRICS = {
  [TOTAL_SALES]: {
    name: "Total sales",
    value: TOTAL_SALES,
    contexts: [VENDOR, PRODUCT, VARIANT, CATEGORY]
  },
  [GROSS_PROFIT]: {
    name: "Gross profit",
    value: GROSS_PROFIT,
    contexts: [VENDOR, PRODUCT, VARIANT, CATEGORY]
  },
  [AVERAGE_MARGIN]: {
    name: "Average margin",
    value: AVERAGE_MARGIN,
    contexts: [VENDOR, PRODUCT, VARIANT, CATEGORY]
  },
  [NUMBER_OF_ORDERS]: {
    name: "Number of orders",
    value: NUMBER_OF_ORDERS,
    contexts: [VENDOR, PRODUCT, VARIANT, CATEGORY]
  },
  [AVERAGE_ORDER_VALUE]: {
    name: "Average order value",
    value: AVERAGE_ORDER_VALUE,
    contexts: []
  },
  [REORDER_FREQUENCY]: {
    name: "Reorder frequency",
    value: REORDER_FREQUENCY,
    contexts: [VENDOR, PRODUCT, VARIANT, CATEGORY]
  },
  [REPEAT_RATE]: {
    name: "Repeat rate",
    value: REPEAT_RATE,
    contexts: [VENDOR, PRODUCT, VARIANT, CATEGORY]
  }
};

const TARGET_CONDITIONS = [">="];
const TARGET_CONDITIONS_OPTIONS = TARGET_CONDITIONS.map((target, index) => {
  return (
    <Option key={index + target} value={target}>
      {target}
    </Option>
  );
});

class GoalForm extends Component {
  constructor(props) {
    super(props);
    const { data = {}, noEdit } = this.props;
    this.onScreenResize = throttle(this.onScreenResize, 200);
    this.state = {
      noEdit: noEdit,
      metric: data.metric,
      context: data.context,
      contextValue: data.contextValue || [null],
      goalName: data.goalName,
      confirmDirty: false,
      windowHeight: window.innerHeight,
      windowWidth: window.innerWidth
    };
    this.getFieldDecorator = this.props.form.getFieldDecorator;
  }

  componentDidMount() {
    // To disabled submit button at the beginning.
    this.props.form.validateFields();
    this.onScreenResize();
    window.addEventListener("resize", this.onScreenResize);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.onScreenResize);
  }

  onScreenResize = () => {
    this.setState({
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight
    });
  };

  disableContext = () => {
    const { getFieldValue } = this.props.form;
    const metric = getFieldValue(METRIC);
    if (!metric || metric === null || this.state.noEdit) return true;
    else return false;
  };

  getMetricOption = () => {
    const { metrics = [] } = this.props;
    const validMetrics = metrics.filter((value, index) => {
      const { db_name = "" } = value;
      const metricType = db_name;
      return CURRENT_VALID_METRICS.find(element => {
        return metricType === element;
      })
        ? true
        : false;
    });
    return validMetrics.map(value => {
      const { db_name, title } = value;
      return (
        <Option key={db_name} value={db_name}>
          {title}
        </Option>
      );
    });
  };

  GoalName = ({ goalNameError, name }) => (
    <FormItem
      label=""
      validateStatus={goalNameError ? "error" : ""}
      help={goalNameError || ""}
    >
      {this.getFieldDecorator(GOAL_NAME, {
        rules: [
          {
            required: true,
            message: "Enter your goal name"
          },
          {
            validator: this.validateGoalName
          }
        ],
        initialValue: name
      })(
        <Input
          className="goal-name"
          disabled={this.state.noEdit}
          placeholder="NAME YOUR GOAL
                give a short name that helps you understand what the goal is"
        />
      )}
    </FormItem>
  );

  MetricType = ({ metric, handleOnChangeMetric }) => {
    const metrics_option = this.getMetricOption();
    return (
      <div className="flex margin-r-20">
        <div className="margin-r-20 label-dark padding-t-5">I want</div>
        <FormItem label="" style={{ width: "200px" }}>
          {this.getFieldDecorator(METRIC, {
            rules: [],
            initialValue: metric
          })(
            <Select
              suffixIcon={downArrowIcon}
              showSearch={true}
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.props.children
                  .toLowerCase()
                  .indexOf(input.toLowerCase()) >= 0
              }
              placeholder="METRIC"
              disabled={this.state.noEdit}
              onChange={handleOnChangeMetric}
            >
              {metrics_option}
            </Select>
          )}
        </FormItem>
      </div>
    );
  };

  StartDate = ({
    startDateError,
    validateStartDate,
    startDate,
    disabledDate
  }) => (
    <div className="flex margin-r8">
      <div className="margin-r-20 label-dark padding-t-5">between</div>
      <FormItem
        label=""
        validateStatus={startDateError ? "error" : ""}
        help={startDateError || ""}
      >
        {this.getFieldDecorator(START_DATE, {
          rules: [
            {
              required: true,
              message: "Enter start date"
            },
            {
              validator: validateStartDate
            }
          ],
          initialValue: startDate
        })(
          <DatePicker
            suffixIcon={calendarIcon}
            disabled={this.state.noEdit}
            placeholder="START DATE"
          />
        )}
      </FormItem>
    </div>
  );

  EndDate = ({ endDate, validateEndDate, disabledDate, endDateError }) => (
    <div className="flex">
      <div className="margin-r-20 label-dark padding-t-5">and</div>
      <FormItem
        label=""
        validateStatus={endDateError ? "error" : ""}
        help={endDateError || ""}
      >
        {this.getFieldDecorator(END_DATE, {
          rules: [
            {
              required: true,
              message: "Enter end date"
            },
            {
              validator: validateEndDate
            }
          ],
          initialValue: endDate
        })(
          <DatePicker
            suffixIcon={calendarIcon}
            disabled={this.state.noEdit}
            disabledDate={disabledDate}
            placeholder="END DATE"
          />
        )}
      </FormItem>
    </div>
  );

  Target = ({ target }) => (
    <FormItem
      className="target"
      label=""
      validateStatus={targetError ? "error" : ""}
      help={targetError || ""}
    >
      {this.getFieldDecorator(TARGET, {
        rules: [
          {
            required: true,
            message: "Enter target value"
          }
        ],
        initialValue: target
      })(<Input placeholder="TARGET" disabled={this.state.noEdit} />)}
    </FormItem>
  );

  TargetCondition = ({ targetCondition }) => (
    <div className="flex condition ">
      <div className="margin-r-20 label-dark padding-t-5">to be</div>
      <FormItem label="">
        {this.getFieldDecorator(CONDITION, {
          rules: [],
          initialValue: targetCondition
        })(
          <Select
            suffixIcon={downArrowIcon}
            showSearch
            optionFilterProp="children"
            filterOption={(input, option) =>
              option.props.children
                .toLowerCase()
                .indexOf(input.toLowerCase()) >= 0
            }
            placeholder=">="
            disabled={this.state.noEdit}
          >
            {TARGET_CONDITIONS_OPTIONS}
          </Select>
        )}
      </FormItem>
    </div>
  );

  Context = ({ context, handleOnChangeContext, contextOptions }) => (
    <FormItem className="context margin-r8" label="">
      {this.getFieldDecorator(CONTEXT, {
        rules: [],
        initialValue: context
      })(
        <Select
          suffixIcon={downArrowIcon}
          showSearch
          optionFilterProp="children"
          filterOption={(input, option) =>
            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >=
            0
          }
          placeholder="PRODUCT"
          onChange={handleOnChangeContext}
        >
          {contextOptions}
        </Select>
      )}
    </FormItem>
  );

  ContextAddButton = ({ onClick, disabled }) => (
    <Button
      className="add-btn"
      disabled={disabled || this.state.noEdit}
      onClick={onClick}
    >
      <img
        alt="add"
        style={{
          width: "30px",
          height: "30px"
        }}
        src={addIcon}
      />
    </Button>
  );

  ContextValue = ({
    index,
    value,
    handleOnChangeContextValue,
    optionsForCurrentContext,
    disabled = true
  }) => (
    <FormItem label="" style={{ width: "200px" }}>
      {this.getFieldDecorator(`${CONTEXT_VALUE}[${index}]`, {
        rules: [],
        initialValue: value
      })(
        <Select
          suffixIcon={downArrowIcon}
          disabled={disabled || this.state.noEdit}
          fieldName={`${CONTEXT_VALUE}[${index}]`}
          showSearch={true}
          optionFilterProp="children"
          filterOption={(input, option) =>
            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >=
            0
          }
          onSelect={value => {
            handleOnChangeContextValue(value, index);
          }}
        >
          {optionsForCurrentContext}
        </Select>
      )}
    </FormItem>
  );

  getContextOptions = metric => {
    if (metric) {
      const contexts = METRICS[metric].contexts;
      return contexts.map((context, index) => {
        return (
          <Option key={index + context} value={context}>
            {context}
          </Option>
        );
      });
    } else {
      return null;
    }
  };

  onAddFilter = e => {
    e.preventDefault();
    const { getFieldValue } = this.props.form;
    const filters = getFieldValue("filters");
    if (filters) {
      let newFilters = filters.contextValue;
      newFilters.push("");

      this.setState({ contextValue: newFilters });
    }
  };

  getActiveContextOptions() {
    const { vendors, categories, products, customers, variants } = this.props;
    const { context } = this.state;
    let contextValues;
    switch (context) {
      case VENDOR:
        contextValues = vendors;
        break;
      case PRODUCT:
        contextValues = products;
        break;

      case CATEGORY:
        contextValues = categories;
        break;

      case VARIANT:
        contextValues = variants;
        break;

      case CUSTOMER:
        contextValues = customers;
        break;
      default:
        contextValues = {};
    }
    const items = Object.keys(contextValues);
    if (items.length === 0) {
      return null;
    } else {
      return items.map((item, index) => {
        const { id, title } = contextValues[item];
        return (
          <Option key={id + index} value={id}>
            {title}
          </Option>
        );
      });
    }
  }

  handleOnChangeContextValue = (val, index) => {
    let { contextValue = [] } = this.state;
    contextValue[index] = val;
    const { setFieldsValue } = this.props.form;
    setFieldsValue({ [`${CONTEXT_VALUE}[${index}]`]: val });
    this.setState({ contextValue: contextValue });
  };

  getFilters = () => {
    const {
      getFieldDecorator,
      getFieldsValue,
      getFieldValue
    } = this.props.form;
    const { onAddFilter } = this;
    const { Context, ContextAddButton, ContextValue } = this;
    const { contextValue = [""], context } = this.state;
    const optionsForCurrentContext = this.getActiveContextOptions();
    const { handleOnChangeContextValue, disableContext } = this;
    const disabled = disableContext();
    return contextValue.map((value, index) => {
      if (index === 0) {
        return (
          <div key={index} className="flex">
            <ContextValue
              disabled={disabled || this.state.noEdit}
              index={index}
              value={value}
              handleOnChangeContextValue={handleOnChangeContextValue}
              optionsForCurrentContext={optionsForCurrentContext}
            />
            <ContextAddButton
              onClick={onAddFilter}
              disabled={disabled || this.state.noEdit}
            />
          </div>
        );
      } else {
        return (
          <div key={index}>
            <ContextValue
              disabled={disabled || this.state.noEdit}
              index={index}
              value={value}
              handleOnChangeContextValue={handleOnChangeContextValue}
              optionsForCurrentContext={optionsForCurrentContext}
            />
          </div>
        );
      }
    });
  };

  handleOnChangeContext = value => {
    const { setFieldsValue } = this.props.form;
    const { contextValue = [] } = this.state;
    let fieldToclean = {};
    contextValue.forEach((element, index) => {
      fieldToclean[`${CONTEXT_VALUE}[${index}]`] = null;
    });
    setFieldsValue(fieldToclean);
    this.setState({ context: value, contextValue: [null] });
  };

  handleOnChangeMetric = value => {
    const { setFieldsValue } = this.props.form;
    const { contextValue = [] } = this.state;
    let fieldToclean = {
      [CONTEXT]: null
    };
    contextValue.forEach((element, index) => {
      fieldToclean[`${CONTEXT_VALUE}[${index}]`] = null;
    });
    setFieldsValue(fieldToclean);
    this.setState({ metric: value, context: null, contextValue: [null] });
  };

  disabledDate = current => {
    // Can not select days before today
    return current && current < moment().endOf("day");
  };

  handleConfirmBlur = e => {
    const value = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  };

  handleSubmit = e => {
    e.preventDefault();
    const { onSave } = this.props;

    this.props.form.validateFields((err, values) => {
      if (!err) {
        onSave(values);
      }
    });
  };

  validateGoalName = (rule, value, callback) => {
    if (value && value.length > 200) {
      callback("Goal name should be max 200 character long");
    }
    callback();
  };

  validateStartDate = (rule, value, callback) => {
    const { getFieldValue, validateFields } = this.props.form;
    //validateFields([END_DATE]);
    const endDate = getFieldValue(END_DATE);
    if (value && endDate) {
      if (value.format("YYYY-MM-DD") < endDate.format("YYYY-MM-DD")) {
        callback();
      } else {
        callback("Start date should be less than End date.");
      }
    } else {
      callback();
    }
  };

  validateEndDate = (rule, value, callback) => {
    const { getFieldValue, validateFields } = this.props.form;
    // validateFields([START_DATE]);
    const startDate = getFieldValue(START_DATE);
    if (value && startDate) {
      if (value.format("YYYY-MM-DD") > startDate.format("YYYY-MM-DD")) {
        callback();
      } else {
        callback("End date should be greater than Start date.");
      }
    } else {
      callback();
    }
  };

  render() {
    const { windowWidth } = this.state;
    if (windowWidth > 1024) {
      return this.renderDesktop();
    } else if (windowWidth > 668 && windowWidth < 1024) {
      return this.renderTablet();
    } else {
      return this.renderMobile();
    }
  }

  renderMobile = () => {
    const {
      onDelete,
      hideDelete,
      saving,
      deleting,
      isLoading,
      form,
      data = {}
    } = this.props;

    const {
      goalId,
      name,
      target,
      startDate: start,
      endDate: end,
      metric,
      context,
      contextValue,
      comparisonOperator: targetCondition = ">="
    } = data;

    const startDate = start ? moment(start) : start;
    const endDate = end ? moment(end) : end;

    const {
      getFieldDecorator,
      getFieldsError,
      getFieldError,
      isFieldTouched
    } = form;

    const goalNameError = isFieldTouched(GOAL_NAME) && getFieldError(GOAL_NAME);
    const startDateError =
      isFieldTouched(START_DATE) && getFieldError(START_DATE);
    const endDateError = isFieldTouched(END_DATE) && getFieldError(END_DATE);
    const targetError = isFieldTouched(TARGET) && getFieldError(TARGET);
    const contextOptions = this.getContextOptions(this.state.metric);
    const filters = this.getFilters();

    const {
      GoalName,
      MetricType,
      StartDate,
      EndDate,
      TargetCondition,
      Target,
      Context,
      ContextValue,
      ContextAddButton,
      disableContext
    } = this;
    const metrics_option = this.getMetricOption();

    return (
      <Form className="goal-form" onSubmit={this.handleSubmit}>
        <Row>
          <Col
            className="goal-name-field field-col"
            xs={12}
            sm={12}
            md={12}
            lg={12}
          >
            <GoalName goalNameError={goalNameError} name={name} />
          </Col>
        </Row>
        <Row style={{ margin: "0 5%" }}>
          <Col xs={12} sm={12} md={12} lg={12}>
            <div className="full-width flex col justify-content-center align-center">
              <div className="full-width flex row justify-flex-start align-center">
                <div className="flex margin-r-20">
                  <div className="margin-r-20 label-dark padding-t-5 w50 tar">
                    I want
                  </div>
                  <FormItem label="" style={{ width: "200px" }}>
                    {this.getFieldDecorator(METRIC, {
                      rules: [],
                      initialValue: metric
                    })(
                      <Select
                        suffixIcon={downArrowIcon}
                        showSearch={true}
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                          option.props.children
                            .toLowerCase()
                            .indexOf(input.toLowerCase()) >= 0
                        }
                        placeholder="METRIC"
                        disabled={this.state.noEdit}
                        onChange={this.handleOnChangeMetric}
                      >
                        {metrics_option}
                      </Select>
                    )}
                  </FormItem>
                </div>
              </div>
              <div className="full-width flex row justify-flex-start align-center">
                <div className="flex margin-r-20">
                  <div className="margin-r-20 label-dark padding-t-5 w50 tar">
                    between
                  </div>
                  <FormItem
                    label=""
                    validateStatus={startDateError ? "error" : ""}
                    help={startDateError || ""}
                  >
                    {getFieldDecorator(START_DATE, {
                      rules: [
                        {
                          required: true,
                          message: "Enter start date"
                        },
                        {
                          validator: this.validateStartDate
                        }
                      ],
                      initialValue: startDate
                    })(
                      <DatePicker
                        suffixIcon={calendarIcon}
                        disabled={this.state.noEdit}
                        placeholder="START DATE"
                      />
                    )}
                  </FormItem>
                </div>
              </div>
              <div className="full-width flex row justify-flex-start align-center">
                <div className="flex">
                  <div className="margin-r-20 label-dark padding-t-5 w50 tar">
                    and
                  </div>
                  <FormItem
                    label=""
                    validateStatus={endDateError ? "error" : ""}
                    help={endDateError || ""}
                  >
                    {getFieldDecorator(END_DATE, {
                      rules: [
                        {
                          required: true,
                          message: "Enter end date"
                        },
                        {
                          validator: this.validateEndDate
                        }
                      ],
                      initialValue: endDate
                    })(
                      <DatePicker
                        suffixIcon={calendarIcon}
                        disabled={this.state.noEdit}
                        disabledDate={this.disabledDate}
                        placeholder="END DATE"
                      />
                    )}
                  </FormItem>
                </div>
              </div>

              <div className="flex row justify-flex-start align-center full-width">
                <div className="flex condition">
                  <div className="margin-r-20 label-dark padding-t-5 w50 tar">
                    to be
                  </div>
                  <FormItem
                    label=""
                    style={{ width: "200px", marginRight: "20px" }}
                  >
                    {getFieldDecorator(CONDITION, {
                      rules: [],
                      initialValue: targetCondition
                    })(
                      <Select
                        suffixIcon={downArrowIcon}
                        showSearch
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                          option.props.children
                            .toLowerCase()
                            .indexOf(input.toLowerCase()) >= 0
                        }
                        placeholder=">="
                        disabled={this.state.noEdit}
                      >
                        {TARGET_CONDITIONS_OPTIONS}
                      </Select>
                    )}
                  </FormItem>
                </div>
              </div>
              <div className="full-width flex row justify-flex-start align-center">
                <div className="margin-r-20 label-dark padding-t-5 w50" />
                <FormItem
                  className="target"
                  label=""
                  validateStatus={targetError ? "error" : ""}
                  help={targetError || ""}
                >
                  {getFieldDecorator(TARGET, {
                    rules: [
                      {
                        required: true,
                        message: "Enter target value"
                      }
                    ],
                    initialValue: target
                  })(
                    <Input placeholder="TARGET" disabled={this.state.noEdit} />
                  )}
                </FormItem>
              </div>
            </div>
          </Col>
        </Row>
        <Row style={{ display: "flex", margin: "0 5%" }}>
          <Col className="field-col" xs={12} sm={12} md={12} lg={12}>
            <div className="full-width">
              <div className="flex row full-width justify-flex-start align-flex-start">
                <div
                  className="margin-r-20 label-dark padding-t-5 w50"
                  style={{ marginRight: "35px" }}
                />
                <div className="flex col full-width justify-flex-start align-flex-start label-light margin-r-20">
                  (optional)
                  <FormItem
                    className=" context margin-r-20"
                    label=""
                    style={{ width: "200px" }}
                  >
                    {getFieldDecorator(CONTEXT, {
                      rules: [],
                      initialValue: context
                    })(
                      <Select
                        suffixIcon={downArrowIcon}
                        disabled={this.disableContext()}
                        showSearch
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                          option.props.children
                            .toLowerCase()
                            .indexOf(input.toLowerCase()) >= 0
                        }
                        placeholder="PRODUCT"
                        onChange={this.handleOnChangeContext}
                      >
                        {contextOptions}
                      </Select>
                    )}
                  </FormItem>
                </div>
              </div>
              <div
                className="flex row full-width justify-flex-start align-flex-start"
                style={{ marginLeft: "10px" }}
              >
                <div className="margin-r-20 label-dark padding-t-5 w50 tar">
                  is
                </div>
                <div className="flex col full-width justify-flex-start align-flex-start  margin-r-20">
                  {filters}
                </div>
              </div>
            </div>
          </Col>
        </Row>
        <Row style={{ margin: "0 5%", paddingBottom: "20px" }}>
          <Col className="footer" xs={12} sm={12} md={10} lg={10}>
            <div
              className={`full-width flex ${
                hideDelete
                  ? "justify-content-right"
                  : "justify-content-space-between"
              } `}
            >
              <Button
                key="delete"
                className={hideDelete ? "hide" : "delete-btn"}
                onClick={onDelete}
              >
                <img style={{}} alt="" src={deleteIcon} />

                <div
                  style={{
                    marginLeft: 10,
                    display: deleting && isLoading ? "inline-block" : "none"
                  }}
                >
                  <Spin size="small" />
                </div>
              </Button>
              <Button
                className="save-btn"
                style={this.state.noEdit ? { display: "none" } : {}}
                disabled={hasErrors(getFieldsError())}
                key="submit"
                type="submit"
              >
                <img style={{}} alt="" src={checkIcon} />
                <div
                  style={{
                    marginLeft: 10,
                    display: saving && isLoading ? "inline-block" : "none"
                  }}
                >
                  <Spin size="small" />
                </div>
              </Button>
            </div>
          </Col>
        </Row>
      </Form>
    );
  };

  renderTablet = () => {
    const {
      onDelete,
      hideDelete,
      saving,
      deleting,
      isLoading,
      form,
      data = {}
    } = this.props;

    const {
      goalId,
      name,
      target,
      startDate: start,
      endDate: end,
      metric,
      context,
      contextValue,
      comparisonOperator: targetCondition = ">="
    } = data;

    const startDate = start ? moment(start) : start;
    const endDate = end ? moment(end) : end;

    const {
      getFieldDecorator,
      getFieldsError,
      getFieldError,
      isFieldTouched
    } = form;

    const goalNameError = isFieldTouched(GOAL_NAME) && getFieldError(GOAL_NAME);
    const startDateError =
      isFieldTouched(START_DATE) && getFieldError(START_DATE);
    const endDateError = isFieldTouched(END_DATE) && getFieldError(END_DATE);
    const targetError = isFieldTouched(TARGET) && getFieldError(TARGET);
    const contextOptions = this.getContextOptions(this.state.metric);
    const filters = this.getFilters();

    const {
      GoalName,
      MetricType,
      StartDate,
      EndDate,
      TargetCondition,
      Target,
      Context,
      ContextValue,
      ContextAddButton
    } = this;

    return (
      <Form className="goal-form" onSubmit={this.handleSubmit}>
        <Row>
          <Col
            className="goal-name-field field-col"
            xs={12}
            sm={12}
            md={12}
            lg={12}
          >
            <GoalName goalNameError={goalNameError} name={name} />
          </Col>
        </Row>
        <Row style={{ margin: "0 10%" }}>
          <Col xs={12} sm={12} md={12} lg={12}>
            <div className="full-width flex col justify-content-center align-center">
              <div className="full-width flex row justify-flex-start align-center">
                <MetricType
                  metric={metric}
                  handleOnChangeMetric={this.handleOnChangeMetric}
                />
              </div>
              <div className="full-width flex row justify-flex-start align-center">
                <div className="flex margin-r-20">
                  <div className="margin-r-20 label-dark padding-t-5">
                    between
                  </div>
                  <FormItem
                    label=""
                    validateStatus={startDateError ? "error" : ""}
                    help={startDateError || ""}
                  >
                    {getFieldDecorator(START_DATE, {
                      rules: [
                        {
                          required: true,
                          message: "Enter start date"
                        },
                        {
                          validator: this.validateStartDate
                        }
                      ],
                      initialValue: startDate
                    })(
                      <DatePicker
                        suffixIcon={calendarIcon}
                        disabled={this.state.noEdit}
                        placeholder="START DATE"
                      />
                    )}
                  </FormItem>
                </div>

                <div className="flex">
                  <div className="margin-r-20 label-dark padding-t-5">and</div>
                  <FormItem
                    label=""
                    validateStatus={endDateError ? "error" : ""}
                    help={endDateError || ""}
                  >
                    {getFieldDecorator(END_DATE, {
                      rules: [
                        {
                          required: true,
                          message: "Enter end date"
                        },
                        {
                          validator: this.validateEndDate
                        }
                      ],
                      initialValue: endDate
                    })(
                      <DatePicker
                        suffixIcon={calendarIcon}
                        disabled={this.state.noEdit}
                        disabledDate={this.disabledDate}
                        placeholder="END DATE"
                      />
                    )}
                  </FormItem>
                </div>
              </div>

              <div className="flex row justify-flex-start align-center full-width">
                <div className="flex condition">
                  <div className="margin-r-20 label-dark padding-t-5">
                    to be
                  </div>
                  <FormItem
                    label=""
                    style={{ width: "200px", marginRight: "20px" }}
                  >
                    {getFieldDecorator(CONDITION, {
                      rules: [],
                      initialValue: targetCondition
                    })(
                      <Select
                        suffixIcon={downArrowIcon}
                        showSearch
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                          option.props.children
                            .toLowerCase()
                            .indexOf(input.toLowerCase()) >= 0
                        }
                        placeholder=">="
                        disabled={this.state.noEdit}
                      >
                        {TARGET_CONDITIONS_OPTIONS}
                      </Select>
                    )}
                  </FormItem>
                </div>
                <FormItem
                  className="target"
                  label=""
                  validateStatus={targetError ? "error" : ""}
                  help={targetError || ""}
                >
                  {getFieldDecorator(TARGET, {
                    rules: [
                      {
                        required: true,
                        message: "Enter target value"
                      }
                    ],
                    initialValue: target
                  })(
                    <Input placeholder="TARGET" disabled={this.state.noEdit} />
                  )}
                </FormItem>
              </div>
            </div>
          </Col>
        </Row>
        <Row style={{ display: "flex", margin: "0 10%" }}>
          <Col className="field-col" xs={12} sm={12} md={12} lg={12}>
            <div className="full-width flex row justify-content-center align-flex-start">
              <div className="flex col justify-flex-start align-flex-start label-light  margin-r-20">
                (optional)
                <FormItem
                  className=" context margin-r-20"
                  label=""
                  style={{ width: "200px" }}
                >
                  {getFieldDecorator(CONTEXT, {
                    rules: [],
                    initialValue: context
                  })(
                    <Select
                      suffixIcon={downArrowIcon}
                      showSearch
                      disabled={this.disableContext()}
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        option.props.children
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                      placeholder="PRODUCT"
                      onChange={this.handleOnChangeContext}
                    >
                      {contextOptions}
                    </Select>
                  )}
                </FormItem>
              </div>
              <div
                className="margin-r-20 label-dark"
                style={{ paddingTop: "24px" }}
              >
                is
              </div>

              <div style={{ marginTop: "18px" }}>{filters}</div>
            </div>
          </Col>
        </Row>
        <Row style={{ margin: "0 10%", paddingBottom: "20px" }}>
          <Col className="footer" xs={12} sm={12} md={10} lg={10}>
            <div
              className={`full-width flex ${
                hideDelete
                  ? "justify-content-right"
                  : "justify-content-space-between"
              } `}
            >
              <Button
                key="delete"
                className={hideDelete ? "hide" : "delete-btn"}
                onClick={onDelete}
              >
                <img style={{}} alt="" src={deleteIcon} />
                <div className="btn-text">DELETE GOAL</div>
                <div
                  style={{
                    marginLeft: 10,
                    display: deleting && isLoading ? "inline-block" : "none"
                  }}
                >
                  <Spin size="small" />
                </div>
              </Button>
              <Button
                className="save-btn"
                style={this.state.noEdit ? { display: "none" } : {}}
                disabled={hasErrors(getFieldsError())}
                key="submit"
                type="submit"
              >
                <img style={{}} alt="" src={checkIcon} />
                <div className="btn-text">SAVE GOAL</div>

                <div
                  style={{
                    marginLeft: 10,
                    display: saving && isLoading ? "inline-block" : "none"
                  }}
                >
                  <Spin size="small" />
                </div>
              </Button>
            </div>
          </Col>
        </Row>
      </Form>
    );
  };

  renderDesktop = () => {
    const {
      onDelete,
      hideDelete,
      saving,
      deleting,
      isLoading,
      form,
      data = {}
    } = this.props;

    const {
      goalId,
      name,
      target,
      startDate: start,
      endDate: end,
      metric,
      context,
      contextValue,
      comparisonOperator: targetCondition = ">="
    } = data;

    const startDate = start ? moment(start) : start;
    const endDate = end ? moment(end) : end;

    const {
      getFieldDecorator,
      getFieldsError,
      getFieldError,
      isFieldTouched
    } = form;

    const goalNameError = isFieldTouched(GOAL_NAME) && getFieldError(GOAL_NAME);
    const startDateError =
      isFieldTouched(START_DATE) && getFieldError(START_DATE);
    const endDateError = isFieldTouched(END_DATE) && getFieldError(END_DATE);
    const targetError = isFieldTouched(TARGET) && getFieldError(TARGET);
    const contextOptions = this.getContextOptions(this.state.metric);
    const filters = this.getFilters();

    const {
      GoalName,
      MetricType,
      StartDate,
      EndDate,
      TargetCondition,
      Target,
      Context,
      ContextValue,
      ContextAddButton
    } = this;

    return (
      <Form className="goal-form" onSubmit={this.handleSubmit}>
        <Row>
          <Col xsHidden smHidden md={2} lg={2} className="form-section">
            <div>NAME YOUR GOAL</div>
          </Col>
          <Col
            className="goal-name-field field-col"
            xs={12}
            sm={12}
            md={10}
            lg={10}
          >
            <GoalName goalNameError={goalNameError} name={name} />
          </Col>
        </Row>
        <Row>
          <Col xsHidden smHidden md={2} lg={2} className="form-section ">
            <div>DEFINE YOUR GOAL</div>
          </Col>

          <Col xs={12} sm={12} md={10} lg={10}>
            <div
              className="full-width flex col justify-content-center align-center"
              style={{ minHeight: "150px" }}
            >
              <div className="full-width flex row justify-content-center align-center">
                <MetricType
                  metric={metric}
                  handleOnChangeMetric={this.handleOnChangeMetric}
                />

                <div className="flex margin-r-20">
                  <div className="margin-r-20 label-dark padding-t-5">
                    between
                  </div>
                  <FormItem
                    label=""
                    validateStatus={startDateError ? "error" : ""}
                    help={startDateError || ""}
                  >
                    {getFieldDecorator(START_DATE, {
                      rules: [
                        {
                          required: true,
                          message: "Enter start date"
                        },
                        {
                          validator: this.validateStartDate
                        }
                      ],
                      initialValue: startDate
                    })(
                      <DatePicker
                        suffixIcon={calendar}
                        disabled={this.state.noEdit}
                        placeholder="START DATE"
                      />
                    )}
                  </FormItem>
                </div>

                <div className="flex">
                  <div className="margin-r-20 label-dark padding-t-5">and</div>
                  <FormItem
                    label=""
                    validateStatus={endDateError ? "error" : ""}
                    help={endDateError || ""}
                  >
                    {getFieldDecorator(END_DATE, {
                      rules: [
                        {
                          required: true,
                          message: "Enter end date"
                        },
                        {
                          validator: this.validateEndDate
                        }
                      ],
                      initialValue: endDate
                    })(
                      <DatePicker
                        suffixIcon={calendarIcon}
                        disabled={this.state.noEdit}
                        disabledDate={this.disabledDate}
                        placeholder="END DATE"
                      />
                    )}
                  </FormItem>
                </div>
              </div>

              <div className="flex row justify-content-center align-center full-width">
                <div className="flex condition">
                  <div className="margin-r-20 label-dark padding-t-5">
                    to be
                  </div>
                  <FormItem
                    label=""
                    style={{ width: "200px", marginRight: "20px" }}
                  >
                    {getFieldDecorator(CONDITION, {
                      rules: [],
                      initialValue: targetCondition
                    })(
                      <Select
                        suffixIcon={downArrowIcon}
                        showSearch
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                          option.props.children
                            .toLowerCase()
                            .indexOf(input.toLowerCase()) >= 0
                        }
                        placeholder=">="
                        disabled={this.state.noEdit}
                      >
                        {TARGET_CONDITIONS_OPTIONS}
                      </Select>
                    )}
                  </FormItem>
                </div>
                <FormItem
                  className="target"
                  label=""
                  validateStatus={targetError ? "error" : ""}
                  help={targetError || ""}
                >
                  {getFieldDecorator(TARGET, {
                    rules: [
                      {
                        required: true,
                        message: "Enter target value"
                      }
                    ],
                    initialValue: target
                  })(
                    <Input placeholder="TARGET" disabled={this.state.noEdit} />
                  )}
                </FormItem>
              </div>
            </div>
          </Col>
        </Row>
        <Row style={{ display: "flex" }}>
          <Col
            xsHidden
            smHidden
            md={2}
            lg={2}
            className="form-section "
            style={{ height: "auto" }}
          >
            <div>APPLY FILTERS</div>
          </Col>

          <Col className="field-col" xs={12} sm={12} md={10} lg={10}>
            <div className="full-width flex row justify-content-center align-flex-start">
              <div className="flex col justify-flex-start align-flex-start label-light  margin-r-20">
                (optional)
                <FormItem
                  className=" context margin-r-20"
                  label=""
                  style={{ width: "200px" }}
                >
                  {getFieldDecorator(CONTEXT, {
                    rules: [],
                    initialValue: context
                  })(
                    <Select
                      suffixIcon={downArrowIcon}
                      disabled={this.disableContext()}
                      showSearch
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        option.props.children
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                      placeholder="PRODUCT"
                      onChange={this.handleOnChangeContext}
                    >
                      {contextOptions}
                    </Select>
                  )}
                </FormItem>
              </div>
              <div
                className="margin-r-20 label-dark"
                style={{ paddingTop: "24px" }}
              >
                is
              </div>
              <div style={{ marginTop: "18px" }}>{filters}</div>
            </div>
          </Col>
        </Row>
        <Row>
          <Col xsHidden smHidden md={2} lg={2} className="form-section " />

          <Col className="footer" xs={12} sm={12} md={10} lg={10}>
            <div
              className={`full-width flex ${
                hideDelete
                  ? "justify-content-right"
                  : "justify-content-space-between"
              } `}
            >
              <Button
                key="delete"
                className={hideDelete ? "hide" : "delete-btn"}
                onClick={onDelete}
              >
                <img style={{}} alt="" src={deleteIcon} />
                <div className="btn-text">DELETE GOAL</div>
                <div
                  style={{
                    marginLeft: 10,
                    display: deleting && isLoading ? "inline-block" : "none"
                  }}
                >
                  <Spin size="small" />
                </div>
              </Button>
              <Button
                className="save-btn"
                style={this.state.noEdit ? { display: "none" } : {}}
                disabled={hasErrors(getFieldsError())}
                key="submit"
                type="submit"
              >
                <img style={{}} alt="" src={checkIcon} />
                <div className="btn-text">SAVE GOAL</div>

                <div
                  style={{
                    marginLeft: 10,
                    display: saving && isLoading ? "inline-block" : "none"
                  }}
                >
                  <Spin size="small" />
                </div>
              </Button>
            </div>
          </Col>
        </Row>
      </Form>
    );
  };
}

class EditGoalModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      deleting: false,
      saving: false
    };
    this.GoalForm = Form.create()(GoalForm);
  }

  handelCancel = () => {
    const { hideModal } = this.props;
    hideModal();
  };

  onSave = data => {
    const {
      addGoal,
      afterAdd,
      channelData: { data: { shopId } = {} } = {}
    } = this.props;
    this.setState({ saving: true, deleting: false });
    const {
      name,
      endDate,
      startDate,
      context,
      filters = {},
      comparisonOperator,
      target,
      metric
    } = data;
    const { contextValue = [] } = filters;
    addGoal({
      metric,
      name,
      endDate: endDate.format("YYYY-MM-DD"),
      startDate: startDate.format("YYYY-MM-DD"),
      context,
      comparisonOperator,
      contextValue: contextValue.filter(value => {
        if (value && value !== null && value !== "") {
          return value;
        }
      }),
      target: parseInt(target),
      shopId: shopId
    }).then(res => {
      if (afterAdd) {
        afterAdd();
      }
    });
  };

  onDelete = () => {
    const {
      deleteGoal,
      data: { goalId },
      afterDelete
    } = this.props;
    this.setState({ deleting: true, saving: false });
    deleteGoal(goalId).then(res => {
      afterDelete();
    });
  };

  render() {
    const {
      visible,
      isLoading,
      isError,
      message,
      isSuccess,
      hideModal,
      addGoal,
      type,
      data = {},
      metrics = {},
      vendors,
      categories,
      products,
      variants,
      customers
    } = this.props;
    const { saving, deleting } = this.state;
    const { onSave, onDelete, GoalForm } = this;
    const hide = type === "ADD" ? true : false;
    const noEdit = type === "DELETE" ? true : false;
    const { endDate } = data;
    let goalData = Object.assign({}, data);
    if (endDate) {
      goalData.endDate = moment(endDate).subtract(1, "days");
    }

    return null;

    return (
      <Modal
        className="edit-goal-modal"
        title={null}
        visible={visible}
        onOk={addGoal}
        confirmLoading={isLoading}
        onCancel={hideModal}
        footer={null}
      >
        <GoalForm
          onSave={onSave}
          onDelete={onDelete}
          noEdit={noEdit}
          hideDelete={hide}
          deleting={deleting}
          saving={saving}
          isLoading={isLoading}
          data={goalData}
          metrics={metrics}
          vendors={vendors}
          categories={categories}
          products={products}
          customers={customers}
          variants={variants}
        />
      </Modal>
    );
  }
}

export default EditGoalModal;
