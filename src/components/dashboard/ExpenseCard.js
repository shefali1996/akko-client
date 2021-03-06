import React from 'react';
import {Card, CardHeader, CardText} from 'material-ui/Card';
import { Row, Col, Label, Button, Image, Grid, Tabs, Tab } from 'react-bootstrap';
import infoIcon from '../../assets/images/MaterialIcon5.svg';
import styles from '../../constants/styles';


export default ({width, index, value,height}) => {
  const expensesData = value;         
  let sales_total = expensesData.total_sales + expensesData.total_discount;
  let gross_profit = expensesData.total_sales - expensesData.total_cogs - expensesData.total_tax - expensesData.total_shipping;
  expensesData.sales_total = sales_total;
  expensesData.gross_profit = gross_profit;                                                                                        
  return (<Col key={index} id={`card_${index}`}  className="dashboard-card-container expenses-breakdown">
    <Card className="charts-card-style" >
      <CardHeader className="expense-header"
        title={<span className="price-title">
          {'Expenses Breakdown'} <img src={infoIcon} className="alt-price-title" alt="info icon" title={value.description} />
        </span>}
        titleStyle={styles.chartsHeaderTitle}
      />
      <CardText style={styles.expenseCardText} className="expense-text">
        <Row>
          <Col md={12} className="expense-text">
            { 
              expensesData.sales_total != undefined ?
                <Row className="expense-text-color">
                  <Col md={7} sm={6} xs={6}>Gross Sales</Col>
                  <Col md={5} sm={6} xs={6} className="text-right">${expensesData.sales_total.toFixed(2)}</Col>
                </Row> 
              : 
                null
            }
            {
              expensesData.total_discount != undefined ?
                  <Row className="padding-t-5 expense-text-color">
                  <Col md={7} sm={6} xs={6}>Discounts</Col>
                  <Col md={5} sm={6} xs={6} className="text-right">${expensesData.total_discount.toFixed(2)}</Col>
                </Row>
              :
                null
            }
            <hr />
            {
              expensesData.total_sales != undefined ?
              <Row className="final-row">
                  <Col md={7} sm={6} xs={6}>Total Sales</Col>
                  <Col md={5} sm={6} xs={6}className="text-right"><span className="dash" />${expensesData.total_sales.toFixed(2)}</Col>
                </Row>
              :
                null
            }
            { 
              expensesData.total_cogs != undefined ?
                <Row className="padding-t-5 expense-text-color">
                  <Col md={7} sm={6} xs={6}>COGS</Col>
                  <Col md={5} sm={6} xs={6} className="text-right">${expensesData.total_cogs.toFixed(2)}</Col>
                </Row>
              : 
                null
            }
            {
              expensesData.total_tax != undefined ?
                <Row className="padding-t-5 expense-text-color">
                  <Col md={7} sm={6} xs={6}>Tax</Col>
                  <Col md={5} sm={6} xs={6} className="text-right">${expensesData.total_tax.toFixed(2)}</Col>
                </Row>
              :
                null
            }
            { 
              expensesData.total_shipping != undefined ?
                <Row className="padding-t-5 expense-text-color">
                  <Col md={7} sm={6} xs={6}>Shipping</Col>
                  <Col md={5} sm={6} xs={6} className="text-right">${expensesData.total_shipping.toFixed(2)}</Col>
                </Row>
              :
                null
            }
            <hr />
            {
              expensesData.gross_profit != undefined ?
                <Row className="final-row">
                  <Col md={7} sm={6} xs={6}>Gross Profit</Col>
                  <Col md={5} sm={6} xs={6} className="text-right"><span className="dash" />${expensesData.gross_profit.toFixed(2)}</Col>
                </Row>
              :
                null
            }
          </Col>
        </Row>
      </CardText>
    </Card>
          </Col>
  );
};
