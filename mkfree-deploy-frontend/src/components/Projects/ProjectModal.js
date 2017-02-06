import React, {Component} from 'react';
import {Modal, Form, Input} from 'antd';

const FormItem = Form.Item;

class ProjectModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            title: this.props.title,
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
        const {onOk} = this.props;
        this.props.form.validateFields((err, values) => {
            if (!err) {
                onOk(values);
                this.hideModelHandler();
            }
        });
    };

    render() {
        const {children} = this.props;
        const {getFieldDecorator} = this.props.form;
        const {name, gitUrl,publishBranch,remotePath,moduleName,deployTargetFile} = this.props.record;
        const formItemLayout = {
            labelCol: {span: 6},
            wrapperCol: {span: 14},
        };

        return (
            <span>
                <span onClick={this.showModelHandler}>
                  { children }
                </span>
                <Modal
                    title={this.state.title}
                    visible={this.state.visible}
                    width={800}
                    onOk={this.okHandler}
                    onCancel={this.hideModelHandler}
                >
                    <Form horizontal onSubmit={this.okHandler}>

                        <FormItem
                            {...formItemLayout}
                            label="名称"
                        >
                            {
                                getFieldDecorator('name', {
                                    initialValue: name,
                                })(<Input />)
                            }
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="仓库url"
                        >
                            {
                                getFieldDecorator('gitUrl', {
                                    initialValue: gitUrl,
                                })(<Input />)
                            }
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="发布分支名称"
                        >
                            {
                                getFieldDecorator('publishBranch', {
                                    initialValue: publishBranch,
                                })(<Input />)
                            }
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="远程机器项目根路劲"
                        >
                            {
                                getFieldDecorator('remotePath', {
                                    initialValue: remotePath,
                                })(<Input />)
                            }
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="部署的项目模块名称"
                        >
                            {
                                getFieldDecorator('moduleName', {
                                    initialValue: moduleName,
                                })(<Input />)
                            }
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="部署的项目模块文件或者目录"
                        >
                            {
                                getFieldDecorator('deployTargetFile', {
                                    initialValue: deployTargetFile,
                                })(<Input />)
                            }
                        </FormItem>
                  </Form>
                </Modal>
              </span>
        );
    }
}

export default Form.create()(ProjectModal);
