import React, {Component, PropTypes} from "react";
import {connect} from "dva";
import {browserHistory} from "dva/router";
import {Row, Col, Icon, Menu, Dropdown,Card} from "antd";
import SignIn from '../components/LoginForm';
import  styles from './SsoIndex.less';



function SsoIndex({dispatch, users}) {
  
  return (
    <div className={styles.page_warp}>
      <Card className={styles.sign_in}>
        <h3>mkfree-deploy</h3>
        <SignIn dispatch={dispatch} users={users}  styles={styles}/>
      </Card>
    </div>
    
  );
  
}

SignIn.propTypes = {
  location: PropTypes.object,
};

export default connect(
  ({users}) => {
  return {users}
})(SsoIndex);
