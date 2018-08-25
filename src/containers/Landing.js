import React, { Component } from 'react';
import { Grid, Row, Col, Label, FormGroup, InputGroup, FormControl, Button, Tooltip, OverlayTrigger } from 'react-bootstrap';
import Header from '../components/Header';
import Footer from '../components/Footer';
import user from '../auth/user';
import {validateEmail} from '../helpers/functions';
import styles from '../constants/styles';
import shopifyicon from '../assets/images/shopifyicon.svg';
import MaterialIcon from '../assets/images/MaterialIcon.svg';
import macbook3 from '../assets/images/macbook3_edited.png';
import placeholderImg from '../assets/images/placeholder4-f4502c.png';
import dataflow from '../assets/images/data-flow(1).svg';
import growth from '../assets/images/growth.svg';
import infiniteMathematicalSymbol from '../assets/images/infinite-mathematical-symbol.svg';
import chronometer from '../assets/images/chronometer.svg';
import twitter_footer from '../assets/images/FontAwesome47 2.svg';
import facebook_footer from '../assets/images/FontAwesome47 3.svg';
import img1 from '../assets/images/Selection_093-9b2a53.png';
import img2 from '../assets/images/Selection_082-336074.png';
import img3 from '../assets/images/Selection_095-9398ab.png';
import img4 from '../assets/images/Selection_078-bf807d.png';

class Landing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      emailTop:    '',
      emailBottom: '',
      fetchError:  false
    };
    this.goToSignup = this.goToSignup.bind(this);
    this.emailValidation = this.emailValidation.bind(this);
    this.onEmailFocus = this.onEmailFocus.bind(this);
  }

  goToSignup(ref) {
    const {emailTop, emailBottom} = this.state;
    const email = ref === 'email1' ? emailTop : emailBottom;
    const emailAuth = this.emailValidation(ref);
    if (emailAuth) {
      localStorage.setItem('email', email);
      this.props.history.push('signup');
    }
  }
  componentWillMount() {
    document.title = "Akko | Realtime analytics and reporting for Shopify";
    if (user.isAuthenticated !== null) {
      this.props.history.push('/dashboard');
    }
  }
  onEmailFocus(ref) {
    if (ref === 'email1') {
      this.refs.email1.hide();
    } else if (ref === 'email2') {
      this.refs.email2.hide();
    }
  }

  emailValidation(ref) {
    const {emailTop, emailBottom} = this.state;
    if (ref === 'email1') {
      if (!validateEmail(emailTop)) {
        this.refs.email1.show();
        return false;
      }
    } else if (ref === 'email2') {
      if (!validateEmail(emailBottom)) {
        this.refs.email2.show();
        return false;
      }
    }
    return true;
  }
  render() {
    const {email} = this.state;
    return (
      <Grid className="main-layout landing">
        <div className="header">
          <Header history={this.props.history} />
        </div>
        <div className="body">
          <Row>
            <Col className="section-container">
              <Col md={6} className="margin-t-60">
                <div className="macbook-container">
                  <img src={macbook3} />
                </div>
              </Col>
              <Col md={6} className="margin-t-0">
                <div className="sec-1-left-container">
                  <Col md={12} className="productive-text-view content-blocks">
                    <div className="large-title">Realtime KPI Dashboard for eCommerce </div>
                  </Col>
                  <Col md={12} className="flex-center content-blocks">
                    <div className="middle-title" style={{fontSize: '20px'}}>One dashboard to track all your eCommerce metrics</div>
                  </Col>
                  <Col md={12} className="margin-t-20 padding-x-60 content-blocks">
                    <div className="smaller-text">Set COGS and track your profit margins by product, customer and time.</div>
                    <div className="smaller-text">Real-time profit and loss statement and expenses breakdown.</div>
                    <div className="smaller-text">Drill down and analyze all your metrics for all timeframes.</div>
                  </Col>
                  <Col md={12} className="bg-blue padding-5 text-center margin-t-30 content-blocks">
                    <span className="small-title">Works with</span>
                    <span><img src={shopifyicon} className="shopify-landing-icon" alt="shopify" /></span>
                    <span className="small-title">. More integrations coming soon.</span>
                  </Col>
                  <Col md={12} className="margin-t-60 text-center content-blocks-email">
                    <div className="email-view">
                      <OverlayTrigger
                        placement="bottom"
                        trigger="manual"
                        ref="email1"
                        overlay={
                          <Tooltip id="tooltip"><img src={MaterialIcon} alt="icon" /> Invalid email address</Tooltip>
                    }>
                        <FormGroup>
                          <InputGroup>
                            <FormControl
                              type="text"
                              placeholder="email address"
                              className="landing-email-input"
                              value={this.state.emailTop}
                              data-tip="invalid email address"
                              data-for="sadFace"
                              onChange={(e) => {
                              this.setState({
                                emailTop: e.target.value
                              });
                            }}
                              onFocus={() => this.onEmailFocus('email1')}
                              onBlur={() => this.emailValidation('email1')}
                      />
                            <InputGroup.Addon>
                              <span className="invite-button" onClick={() => this.goToSignup('email1')}>
                            SIGN UP
                              </span>
                            </InputGroup.Addon>
                          </InputGroup>
                        </FormGroup>
                      </OverlayTrigger>
                    </div>
                    <div className="text-center smaller-text">
                  Get started for FREE. No credit card required.
                    </div>
                  </Col>
                </div>
              </Col>
            </Col>
          </Row>
          <Row>
            <Col md={12} id="features" className="margin-t-60 bg-blue lading-sec-2">
              <Col className="section-container">
                <Col style={{display: 'inline-block'}}>
                  <Col md={3} sm={6} xs={6} className="content-blocks" >
                    <div className="image-container">
                      <img src={dataflow} alt="dataflow" />
                    </div>
                    <div className="text-container">
                      <div className="title">Realtime Analytics</div>
                      <div className="text">Truly real-time analytics.
                Forget daily or hourly data updates. With Akko, all your metrics update in seconds.
                      </div>
                    </div>
                  </Col>
                  <Col md={3} sm={6} xs={6} className="content-blocks" >
                    <div className="image-container">
                      <img src={chronometer} alt="chronometer" />
                    </div>
                    <div className="text-container">
                      <div className="title">Instant Integration</div>
                      <div className="text">Simple one-step integration.
                  Start using Akko within seconds after connecting your Shopify store.
                      </div>
                    </div>
                  </Col>
                  <Col md={3} sm={6} xs={6} className="content-blocks" >
                    <div className="image-container">
                      <img src={infiniteMathematicalSymbol} alt="infiniteMathematicalSymbol" />
                    </div>
                    <div className="text-container">
                      <div className="title">Infinite History</div>
                      <div className="text">Akko calculates all your metrics for the entire history of your company. Analyze all your metrics for any timeframe.
                      </div>
                    </div>
                  </Col>
                  <Col md={3} sm={6} xs={6} className="content-blocks" >
                    <div className="image-container">
                      <img src={growth} alt="growth" />
                    </div>
                    <div className="text-container">
                      <div className="title">Infinitely Scalable</div>
                      <div className="text">Whether you have 500 sales per month or 50000, Akko scales seamlessly with your business, delivering optimal performance.
                      </div>
                    </div>
                  </Col>
                </Col>
              </Col>
            </Col>
          </Row>
          <Row className="landing-sec-3">
            <Col className="">
              <Col md={12} className="blocks-padding-y" >
                <Col className="section-container">
                  <Col md={6} className="text-center">
                    <img src={img1} className="placeholder-image" />
                  </Col>
                  <Col md={6} className="text-center">
                    <div className="text-container">
                      <div className="title">Track your Key Performance Indicators (KPIs) in real time</div>
                      <div className="text">
                        <p>Akko captures your sales, product and customer data in real-time and calculates your most important key performance indicators (KPIs) like:<br />
                        - Total Sales<br /> - Gross Profit<br />- Average Margin <br />- Customer Lifetime Value (LTV)<br />- Avg Order Value<br />- Repeat Customers<br /> - Reorder Frequency<br />and more..
                        </p>
                      </div>
                    </div>
                  </Col>
                </Col>
              </Col>
              <Col md={12} className="blocks-padding-y" style={styles.bgLightBlue} >
                <Col className="section-container">
                  <Col md={6} className="text-center">
                    <img src={img2} className="placeholder-image" />
                  </Col>
                  <Col md={6} className="text-center" >
                    <div className="text-container">
                      <div className="title">Directly track your Profits and Margins</div>
                      <div className="text">
                        <p>Increasing sales is good - increasing profits is better.</p><br />
                        <p>Akko lets you <strong>set COGS for every variant of all your products.</strong> We then take into account your shipping, discounts and taxes to calculate your final Gross Profit for each product and every sale.</p>
                        <br /><p>Akko also lets you slice and dice your <strong> gross profit by product or customer</strong>. Easily find out who your most profitable customers are, or which products are least profitable.</p>
                      </div>
                    </div>
                  </Col>
                </Col>
              </Col>
              <Col md={12} className="blocks-padding-y" >
                <Col className="section-container">
                  <Col md={6} className="text-center">
                    <img src={img3} className="placeholder-image" />
                  </Col>
                  <Col md={6} className="text-center" >
                    <div className="text-container">
                      <div className="title">
                  Realtime Profit/Loss Statement
                      </div>
                      <div className="text">
                        <p>You don't have to wait until month-end to get your P/L statement. Akko <strong>tracks your expense breakdown in real-time</strong> and shows you where money is coming in and where it is going out. </p>
                        <br /><p>Akko <strong>tracks Discounts, Shipping and Taxes</strong> directly from Shopify to show you which orders, customers and products are profitable.</p>
                      </div>
                    </div>
                  </Col>
                </Col>
              </Col>
              <Col md={12} className="blocks-padding-y" style={styles.bgLightBlue}>
                <Col className="section-container">
                  <Col md={6} className="text-center">
                    <img src={img4} className="placeholder-image" />
                  </Col>
                  <Col md={6} className="text-center" >
                    <div className="text-container">
                      <div className="title">Drill-down Analytics</div>
                      <div className="text">
                        <p>All your metrics are calculated for the entire history of your company.</p>
                        <br /><p>Drill down every metric by products or customers for any time period in the past.</p>
                      </div>
                    </div>
                  </Col>
                </Col>
              </Col>
            </Col>
          </Row>
          <Row>
            <Col md={12} id="pricing" className="bg-blue lading-sec-4 text-center">
              <Col className="section-container">
                <div className="title">Pricing</div>
                <div className="text">Akko is currently <span className="title">free</span> for all businesses no matter how big or small you are.<br />
                We are working on more advanced features for a pro plan which will be launched soon. <br /> Have suggestions or requests? Talk to us at <span className="email">help@akko.io</span>
                </div>
              </Col>
            </Col>
          </Row>
          <Row>
            <Col md={12} className="margin-t-0">
              <div className="landing-sec-5">
                <Col md={12} className="productive-text-view content-blocks">
                  <div className="large-title">Realtime KPI Dashboard for eCommerce </div>
                </Col>
                <Col md={12} className="flex-center content-blocks">
                  <div className="middle-title" style={{fontSize: '20px'}}>One dashboard to track all your eCommerce metrics</div>
                </Col>
                <Col md={12} className="margin-t-20 padding-x-60 content-blocks">
                  <div className="smaller-text">Set COGS and track your profit margins by product, customer and time.</div>
                  <div className="smaller-text">Real-time profit and loss statement and expenses breakdown.</div>
                  <div className="smaller-text">Drill down and analyze all your metrics for all timeframes.</div>
                </Col>
                <Col md={12} className="margin-t-80 text-center content-blocks-email">
                  <div className="email-view">
                    <OverlayTrigger
                      placement="bottom"
                      trigger="manual"
                      ref="email2"
                      overlay={
                        <Tooltip id="tooltip"><img src={MaterialIcon} alt="icon" /> Invalid email address</Tooltip>
                    }>
                      <FormGroup>
                        <InputGroup>
                          <FormControl
                            type="text"
                            placeholder="email address"
                            className="landing-email-input"
                            value={this.state.emailBottom}
                            data-tip="invalid email address"
                            data-for="sadFace"
                            onChange={(e) => {
                              this.setState({
                                emailBottom: e.target.value
                              });
                            }}
                            onFocus={() => this.onEmailFocus('email2')}
                            onBlur={() => this.emailValidation('email2')}
                      />
                          <InputGroup.Addon>
                            <span className="invite-button" onClick={() => this.goToSignup('email2')}>
                            SIGN UP
                            </span>
                          </InputGroup.Addon>
                        </InputGroup>
                      </FormGroup>
                    </OverlayTrigger>
                  </div>
                  <div className="text-center smaller-text">
                  Get started for FREE. No credit card required.
                  </div>
                </Col>
              </div>
            </Col>
          </Row>
          <Row>
            <Col md={12} className="margin-t-60 bg-blue footer-landing text-center">
              <Col xs={6} >
                <div><Label className="footer-logo"> akko</Label></div>
                <div className="footer-small-text text-left">© 2018 Akko.</div>
              </Col>
              <Col xs={6} >
                <div className="footer-small-text text-right">help@akko.io</div>
                <div className="social text-right">
                  <span><img src={twitter_footer} onClick={() => { window.open('https://twitter.com/akkoHQ'); }} alt="twitter" /></span>
                  <span><img src={facebook_footer} onClick={() => { window.open('https://www.facebook.com/akkoHQ/'); }} alt="facebook" /></span>
                </div>
              </Col>
            </Col>
          </Row>
        </div>
      </Grid>
    );
  }
}

export default Landing;
