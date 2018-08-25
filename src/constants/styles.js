import style from '../styles/global/variables.scss'
const millis = parseInt(style.mainBlueColor)

const styles = {
  paper: {
    padding: '5px 10px',
    height:  100
  },
  chartsHeaderTitle: {
    fontSize:       '16px',
    color:          `${style['grey']}`,
    fontWeight:     'bold',
    textDecoration: 'none solid rgb(102, 102, 102)',
  },
  chartHeader: {
    width:   '100%',
    padding: '0px'
  },
  chipLabelStyle: {
    fontSize:       '12px',
    color:          `${style['pure-white']}`,
    fontWeight:     'bold', 
    textDecoration: 'none solid white',
    paddingLeft:    '30px',
    paddingRight:   '30px'
  },
  bsTableHeaderStyle: {
    background: `${style['dull-white']}`
  },
  expenseCardSubtitle: {
    color:      `${style['smooth-grey']}`,
    fontWeight: '600',
    fontSize:   '11px'
  },
  expenseCardText: {
    paddingTop: '10px'
  },
  metricsCardStyle: {
    minHeight: '400px'
  },
  bgLightBlue: {
    backgroundColor: `${style['white-shade']}`
  },
  constants: {
    mainThemeColor: `${style['new-blue']}`
  },
  showDetailOnHoverTitleBox: {
    fontSize: '12px'
  },
  cogsTableTitle: {
    paddingLeft:   '0px',
    paddingBottom: '0px',
    paddingTop:    '0px',
    height:        '47px'
  },
  cogsProgressBarContainer: {
    lineHeight: '.1',
    marginTop:  '2px'
  },
  markupInputStyle: {
    height:       'auto',
    border:       'none',
    boxShadow:    'none',
    padding:      '0px',
    borderBottom: `1px solid ${style['light-gray-color']} `,
    borderRadius: '0px',
    margin:       '4px'
  },
  mainLoading: {
    width:         '100vh',
    height:        '100vh',
    margin:        '0 auto',
    textAlign:     'center',
    verticalAlign: 'middle',
    paddingTop:    '45vh'
  },
  noBorder: {
    border:    'none',
    boxShadow: 'none',
  }
};

export default styles;
