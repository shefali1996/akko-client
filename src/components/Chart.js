import React, {Component} from 'react';
import {PropTypes} from 'prop-types';
import {Chart as ChartJS} from 'chart.js/src/chart';

class Chart extends Component {
  chart = null;
  updates = false;
  constructor(props) {
    super(props);
    this.abc = this.abc.bind(this);
  }
  componentDidMount() {
    this.initChart();
  }

  componentWillUnmount() {
    // this.destroyChart();
  }
  componentDidUpdate() {
    if (this.chart) {
	  this.chart.type = this.props.type,
      this.chart.data = this.props.data;

      let prefix = '',
        postfix = '';
      const data = this.props.data;
      if (data && data.datasets && data.datasets.length && data.datasets[0].prefix) {
        prefix = data.datasets[0].prefix;
      }
      if (data && data.datasets && data.datasets.length && data.datasets[0].postfix) {
        postfix = data.datasets[0].postfix;
      }

      this.chart.options.scales.yAxes[0].ticks.callback = function (value, index, values) {
        return prefix + value + postfix;
      };

      this.chart.update();
    }
  }
  abc(tooltipItems, data) {
    console.log('x,y', tooltipItems, data);
    this.props.showDetailOnHover && this.props.showDetailOnHover(tooltipItems, data);
  }
  initChart() {
    let prefix = '',
      postfix = '';
    const data = this.props.data;
    if (data && data.datasets && data.datasets.length && data.datasets[0].prefix) {
      prefix = data.datasets[0].prefix;
    }
    if (data && data.datasets && data.datasets.length && data.datasets[0].postfix) {
      postfix = data.datasets[0].postfix;
    }
    const _SELF = this;
    const options = {
      scales: {
        yAxes: [{
          ticks: {
            callback(value, index, values) {
              return prefix + value + postfix;
            }
          }
        }]
      },
      legend: {
        display:  false,
        position: this.props.type === 'bar' ? 'right' : 'top',
        onClick:  (e, legendItem) => {},
        labels:   {
          usePointStyle: true,
          fontColor:     'rgb(255, 99, 132)'
        }
      },
      tooltips: {
        mode:      'x',
        intersect: false,
        callbacks: {
          label(tooltipItems, data) {
            console.log('sssssssssssss', tooltipItems, data, _SELF);
            // _SELF.props.showDetailOnHover && _SELF.props.showDetailOnHover(tooltipItems, data);
            _SELF.abc(tooltipItems, data);
            const dataset = data.datasets[tooltipItems.datasetIndex];
            const prefix = dataset.prefix ? dataset.prefix : '';
            const postfix = dataset.postfix ? dataset.postfix : '';
            return ` ${prefix}${tooltipItems.yLabel}${postfix}`;
          }
        }
      }
    };
    if (this.props.disableAspectRatio) {
      options.maintainAspectRatio = false;
    }
    this.chart = new ChartJS(this.canvas, {
      type: this.props.type,
      data: this.props.data,
	  options,
    });
  }

  destroyChart() {
    this.chart.destroy();
  }

  render() {
    return (
      <div style={{height: '100%'}}>
        <canvas ref={(canvas) => this.canvas = canvas} />
      </div>
    );
  }
}

Chart.propTypes = {
  type: PropTypes.string.isRequired,
  data: PropTypes.shape({
    labels:   PropTypes.arrayOf(PropTypes.string),
    datasets: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string,
      data:  PropTypes.arrayOf(PropTypes.any)
    })),
    width: PropTypes.number
  })
};

export default Chart;
