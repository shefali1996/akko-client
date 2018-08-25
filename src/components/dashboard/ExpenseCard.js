import React from 'react';
import {Card, CardHeader, CardText} from 'material-ui/Card';
import { Row, Col, Label, Button, Image, Grid, Tabs, Tab } from 'react-bootstrap';
import infoIcon from '../../assets/images/MaterialIcon5.svg';
import styles from '../../constants/styles';


export default ({width, index, value}) => {
  const expensesData = value.value;         
  let sales_total = expensesData.total_sales - expensesData.total_discount;
  let gross_profit = expensesData.total_sales - expensesData.total_discount - expensesData.total_cogs - expensesData.total_tax - expensesData.total_shipping;
  expensesData.sales_total = sales_total;
  expensesData.gross_profit = gross_profit;                                                                                        
  return (<Col key={index} id={`card_${index}`} style={{width}} className="dashboard-card-container expenses-breakdown">
    <Card className="charts-card-style" >
      <CardHeader
        title={<span className="price-title">
          {'Expenses Breakdown'} <img src={infoIcon} className="alt-price-title" alt="info icon" title={value.description} />
        </span>}
        titleStyle={styles.chartsHeaderTitle}
      />
      <CardText style={styles.expenseCardText}>
        <Row>
          <Col md={12} className="expense-text">
            { 
              expensesData.total_sales != undefined ?
                <Row className="expense-text-color">
                  <Col md={7}>Gross Sales</Col>
                  <Col md={5} className="text-right">${expensesData.total_sales.toFixed(2)}</Col>
                </Row> 
              : 
                null
            }
            {
              expensesData.total_discount != undefined ?
                  <Row className="padding-t-5 expense-text-color">
                  <Col md={7}>Discounts</Col>
                  <Col md={5} className="text-right">${expensesData.total_discount.toFixed(2)}</Col>
                </Row>
              :
                null
            }
            <hr />
            {
              expensesData.sales_total != undefined ?
              <Row className="final-row">
                  <Col md={7}>Total Sales</Col>
                  <Col md={5} className="text-right"><span className="dash" />${expensesData.sales_total.toFixed(2)}</Col>
                </Row>
              :
                null
            }
            { 
              expensesData.total_cogs != undefined ?
                <Row className="padding-t-5 expense-text-color">
                  <Col md={7}>COGS</Col>
                  <Col md={5} className="text-right">${expensesData.total_cogs.toFixed(2)}</Col>
                </Row>
              : 
                null
            }
            {
              expensesData.total_tax != undefined ?
                <Row className="padding-t-5 expense-text-color">
                  <Col md={7}>Tax</Col>
                  <Col md={5} className="text-right">${expensesData.total_tax.toFixed(2)}</Col>
                </Row>
              :
                null
            }
            { 
              expensesData.total_shipping != undefined ?
                <Row className="padding-t-5 expense-text-color">
                  <Col md={7}>Shipping</Col>
                  <Col md={5} className="text-right">${expensesData.total_shipping.toFixed(2)}</Col>
                </Row>
              :
                null
            }
            <hr />
            {
              expensesData.gross_profit != undefined ?
                <Row className="final-row">
                  <Col md={7}>Gross Profit</Col>
                  <Col md={5} className="text-right"><span className="dash" />${expensesData.gross_profit.toFixed(2)}</Col>
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
