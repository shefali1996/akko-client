import { connect } from 'react-redux';
import {withRouter} from 'react-router';
import Explore from '../../components/Explore/Explore';

const mapStateToProps = state => {
    return {
     
    };
  };

  const mapDispatchToProps = (dispatch) => {
   return {

   }
  };


  export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Explore));

