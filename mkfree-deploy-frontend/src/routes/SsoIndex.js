import React, {Component, PropTypes} from "react";
import {connect} from "dva";
import {browserHistory} from "dva/router";
import cookie from "react-cookie";
import {Row, Col, Icon, Menu, Dropdown} from "antd";
import Register from '../components/Sso/Register';
import SignIn from '../components/Sso/SignIn';
class SsoIndex extends Component {
  constructor(props) {
    super(props);
  
  }
  
  render() {
    const {type}=this.props;
    return (
        <div>
          {type=='SIGNIN'?
            <SignIn/>:
            <Register/>}
        </div>
  
    );
  }
}

SsoIndex.propTypes = {
  location: PropTypes.object,
};

export default connect(({sso}) => {
  const {type}=sso;
  return {type}
})(SsoIndex);
