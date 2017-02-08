import React, { Component } from 'react';
import { Modal, Form, Input } from 'antd';

const FormItem = Form.Item;

class UserEditModal extends Component {

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  showModelHandler = (e) => {
    if (e) e.stopPropagation();
    this.setState({
      visible: true,
    });
  };

  hideModelHandler = () => {
    this.setState({
      visible: false,
    });
  };

  okHandler = () => {
    const { onOk } = this.props;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        onOk(values);
        this.hideModelHandler();
      }
    });
  };

  render() {
    const { children, visible, dispatch } = this.props;
    const { getFieldDecorator } = this.props.form;
    const { name, email, id } = this.props.record;

    const formItemLayout = {
      labelCol: {span: 6},
      wrapperCol: {span: 14},
    };

    const showModelHandler = (e)=> {
      if (e) e.stopPropagation();
      dispatch({
        type: 'users/changeState',
        payload: {
          visible: true,
        }
      })
    };

    const hideModelHandler = () => {
      dispatch({
        type: 'users/changeState',
        payload: {
          visible: false,
        }
      })
    };

    const okHandler = () => {
      this.props.form.validateFields((err, values) => {
        dispatch({
          type: 'users/userUpdate',
          payload: {
            id,
            username: values.username,
            password: values.password,
          }
        });
        if (!err) {
          hideModelHandler();
        }
      });
    };

    return (
      <span>
        <span onClick={(e)=> showModelHandler(e)}>
          { children }
        </span>
        <Modal
          title="Edit User"
          visible={visible}
          onOk={()=> okHandler()}
          onCancel={()=> hideModelHandler()}
        >
          <Form horizontal onSubmit={()=> okHandler()}>
            <FormItem
              {...formItemLayout}
              label="账户"
            >
              {
                getFieldDecorator('username', {
                  initialValue: name,
                })(<Input />)
              }
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="密码"
            >
              {
                getFieldDecorator('password', {
                  initialValue: email,
                })(<Input />)
              }
            </FormItem>
          </Form>
        </Modal>
      </span>
    );
  }
}

export default Form.create()(UserEditModal);
