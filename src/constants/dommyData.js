export const dashboardJSON = {
  financialData: [
    {
      title: 'Total Sales',
      description: 'What is the total sales volume this month?',
      prefix: '$',
      value: 57923,
      trend: '+',
      trendValue: '3%',
      trendPeriod: 'last month'
    },
    {
      title: 'Gross Profit',
      description: 'Which customers are at risk of leaving?',
      prefix: '',
      value: 78,
      trend: '+',
      trendValue: '3%',
      trendPeriod: 'last month'
    },
    {
      title: 'Margin',
      description: 'What was the gross margin this period?',
      prefix: '$',
      value: 57923,
      trend: '+',
      trendValue: '3%',
      trendPeriod: 'from last month'
    }
  ],
  customerData: [
    {
      title: 'Avg. Order Value',
      description: 'On average, how much do customers spend in your store?',
      prefix: '$',
      value: 57923,
    },
    {
      title: 'Retention Rate',
      description: 'How many customers come back to buy again?',
      postfix: '%',
      value: 78,
    },
    {
      title: 'Reorder Rate',
      description: 'How many orders does a recurring customer make?',
      prefix: '',
      value: 3,
    },
    {
      title: 'Reorder Frequency',
      description: 'How often do customers buy again?',
      postfix: 'days',
      value: 15,
    },
    {
      title: 'Lifetime Value',
      description: 'How much do customers spend on your store over their entire lifetime?',
      prefix: '$',
      value: 5687,
    },
  ],
  allData: [
    {
      title: 'Total Sales',
      description: 'What is the total sales volume this month?',
      prefix: '$',
      value: 57923,
      trend: '+',
      trendValue: '3%',
      trendPeriod: 'last month'
    },
    {
      title: 'Gross Profit',
      description: 'Which customers are at risk of leaving?',
      prefix: '',
      value: 78,
      trend: '+',
      trendValue: '3%',
      trendPeriod: 'last month'
    },
    {
      title: 'Margin',
      description: 'What was the gross margin this period?',
      prefix: '$',
      value: 57923,
      trend: '+',
      trendValue: '3%',
      trendPeriod: 'from last month'
    },
    {
      title: 'Avg. Order Value',
      description: 'On average, how much do customers spend in your store?',
      prefix: '$',
      value: 57923,
      trend: '+',
      trendValue: '3%',
      trendPeriod: 'from last month'
    },
    {
      title: 'Retention Rate',
      description: 'How many customers come back to buy again?',
      postfix: '%',
      value: 78,
      trend: '+',
      trendValue: '3%',
      trendPeriod: 'from last month'
    },
    {
      title: 'Reorder Rate',
      description: 'How many orders does a recurring customer make?',
      prefix: '',
      value: 3,
      trend: '+',
      trendValue: '3%',
      trendPeriod: 'from last month'
    },
    {
      title: 'Reorder Frequency',
      description: 'How often do customers buy again?',
      postfix: 'days',
      value: 15,
      trend: '+',
      trendValue: '3%',
      trendPeriod: 'from last month'
    },
    {
      title: 'Lifetime Value',
      description: 'How much do customers spend on your store over their entire lifetime?',
      prefix: '$',
      value: 5687,
      trend: '+',
      trendValue: '3%',
      trendPeriod: 'from last month'
    },
    {
      title: 'Lifetime Value',
      description: 'How much do customers spend on your store over their entire lifetime?',
      prefix: '$',
      value: 5687,
      trend: '+',
      trendValue: '3%',
      trendPeriod: 'from last month'
    },
  ]
};
export const chartDataOne = {
  labels: ['Aug 17', 'Sep 17', 'Oct 17', 'Nov 17'],
  datasets: [{
    type: 'line',
    label: 'Sales',
    data: ['57000', '55000', '56881', '58000'],
    borderColor: 'rgba(55, 141, 238, 0.1)',
    backgroundColor: 'rgba(55, 141, 238, 0.5)',
    fill: '1',
    tension: 0,
  }]
};
export const chartDataLine = {
  labels: ['Aug 17', 'Sep 17', 'Oct 17', 'Nov 17'],
  datasets: [{
    type: 'line',
    label: 'Sales',
    data: ['57000', '55000', '56881', '58000'],
    borderColor: 'rgba(55, 141, 238, 0.1)',
    backgroundColor: 'rgba(55, 141, 238, 0.5)',
    fill: '1',
    tension: 0,
  },
  {
    type: 'line',
    label: 'Gross Profit',
    data: ['56000', '53500', '55888', '56010'],
    borderColor: 'rgba(234, 71, 62, 0.6)',
    backgroundColor: 'rgba(234, 71, 62, 0.5)',
    fill: true,
    tension: 0,
  },
  {
    type: 'line',
    label: 'Margin',
    data: ['57000', '52500', '57888', '59010'],
    borderColor: '#ff9900',
    backgroundColor: '#ff9900',
    fill: true,
    tension: 0,
  }]
};
export const chartDataBar = {
  labels: ['Aug 17', 'Sep 17', 'Oct 17', 'Nov 17'],
  datasets: [{
    type: 'bar',
    label: 'Sales',
    data: ['57000', '55000', '56881', '58000'],
    borderColor: 'rgba(55, 141, 238, 0.1)',
    backgroundColor: 'rgba(55, 141, 238, 0.5)',
    fill: '1',
    tension: 0,
  },
  {
    type: 'bar',
    label: 'Gross Profit',
    data: ['56000', '53500', '55888', '56010'],
    borderColor: 'rgba(234, 71, 62, 0.6)',
    backgroundColor: 'rgba(234, 71, 62, 0.5)',
    fill: true,
    tension: 0,
  },
  {
    type: 'bar',
    label: 'Margin',
    data: ['57000', '52500', '57888', '59010'],
    borderColor: '#ff9900',
    backgroundColor: '#ff9900',
    fill: true,
    tension: 0,
  }]
};
