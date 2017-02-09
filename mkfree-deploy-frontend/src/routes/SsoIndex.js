import React, {Component, PropTypes} from "react";
import {connect} from "dva";
import {browserHistory} from "dva/router";
import cookie from "react-cookie";
import {Row, Col, Icon, Menu, Dropdown} from "antd";
import SignIn from '../components/Sso/SignIn';
class SsoIndex extends Component {
  constructor(props) {
    super(props);
  
  }
  
  render() {
    return (
        <div>
            <SignIn/>
        </div>
  
    );
  }
}

SsoIndex.propTypes = {
  location: PropTypes.object,
};

export default connect(({users}) => {
  const {type}=users;
  return {type}
})(SsoIndex);
