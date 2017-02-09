import React, {Component} from 'react';
import {connect} from 'dva';
import {Input, Form, Icon,Button,Transfer} from 'antd';
import {routerRedux} from 'dva/router';

import styles from './Projects.css';

import {PAGE_SIZE, ROUTE_PROJECTS, ENV_DEV, ENV_UAT, ENV_PROD} from '../constants';

const FormItem = Form.Item;

function ProjectsCreate({dispatch, list: dataSource, loading, total, pageNo: current}) {


  function deleteHandler(id) {
    dispatch({
      type: 'projects/remove',
      payload: id,
    });
  }

  function pageChangeHandler(pageNo) {
    dispatch(routerRedux.push({
      pathname: '/projects',
      query: {pageNo},
    }));
  }

  function editHandler(id, values) {
    values.id = id;
    dispatch({
      type: 'projects/patch',
      payload: values,
    });
  }

  function saveHandler(values) {
    dispatch({
      type: 'projects/create',
      payload: values,
    });
  }

  function deploy(values) {
    dispatch({
      type: 'projects/deploy',
      payload: values,
    });
  }

  return (
    <div>
      <ProjectsCentont record={{}} onOk={saveHandler}/>
    </div>
  );
}


class ProjectsCentont extends Component {

  constructor(props) {
    super(props);
    this.state = {
      title: this.props.title,
      visible: false,

      DEVConfig :{
        "env": "DEV",
        "serverMachineIdList": [],/*选中服务器列表*/
        "publicBranch": "",/*分支名*/
        "structureBeforeList": [""],/*发布前命令*/
        "structureAfterList": [""],/*发布后命令*/
      },

      TESTConfig :{
        "env": "DEV",
        "serverMachineIdList": [],
        "publicBranch": "",
        "structureBeforeList": [""],
        "structureAfterList": [""],
      },

      UATConfig :{
        "env": "DEV",
        "serverMachineIdList": [],
        "publicBranch": "",
        "structureBeforeList": [""],
        "structureAfterList": [""],
      },

      PRODConfig :{
        "env": "DEV",
        "serverMachineIdList": [],
        "publicBranch": "",
        "structureBeforeList": [""],
        "structureAfterList": [""],
      },

      preBuild1: [""],
      postBuild1: [""],
      preBuild2: [""],
      postBuild2: [""],
      preBuild3: [""],
      postBuild3: [""],
      preBuild4: [""],
      postBuild4: [""],

      serverMachineIdList1 : [],
      serverMachineIdList2 : [],
      serverMachineIdList3 : [],
      serverMachineIdList4 : [],

      publicBranch1 : "",
      publicBranch2 : "",
      publicBranch3 : "",
      publicBranch4 : "",

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
        // const projectEnvConfigList= [];
        // onOk(values);
        // this.hideModelHandler();
        console.log(this.state)
      }
    });
  };
  onSubmitAll = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        // onOk(values);
        // this.hideModelHandler();
        // console.log(values)

      }
    });
  }
  revampList = (env , after, index, type, value) => {
    const Build = JSON.parse(JSON.stringify(this.state[env]));

    (type == "add" ) && (Build[after][index] = value);

    (type == "delete" && Build[after].length > 1) && (Build[after].splice(index, 1));

    (type == "revamp" && index > -1) && (Build[after][index] = value);

    (type == "revamp" && index == -1) && (Build[after] = value);

    console.log(Build[after])

    this.setState({[env]: Build});
  }

  revampList1 = ( after, index, type, e) => {
    const Build = this.state[after].concat();
    (type == "add" ) && (Build[index] = e.target.value);
    (type == "delete" && Build.length > 1) && (Build.splice(index, 1));
    console.log(after, index, type, e.target.value)
    this.setState({[after]: Build});
  }

  render() {
    const {children} = this.props;
    const {getFieldDecorator} = this.props.form;
    const {name, gitUrl, publishBranch, remotePath, moduleName, deployTargetFile} = this.props.record;
    const formItemLayout = {
      labelCol: {span: 6},
      wrapperCol: {span: 8},
    };
     const
      _state = this.state,
      preList1 = _state.DEVConfig.structureBeforeList.map((item, index) => {
        return <div key={index}><Input value={item} onChange={(e) => {
          this.revampList("DEVConfig", "structureBeforeList", index, "revamp", e.target.value)
        }} addonAfter={
          <Icon style={{cursor: "pointer"}} type="minus" onClick={(e) => {
            this.revampList("DEVConfig", "structureBeforeList", index, "delete", e)
          }}/>
        }/></div>;
      }),
      postList1 = _state.postBuild1.map((item, index) => {
        return <div key={index}><Input value={item} onChange={(e) => {
          this.revampList("DEVConfig" , "structureAfterList", index, "add", e.tatget.value)
        }} addonAfter={
          <Icon style={{cursor: "pointer"}} type="minus" onClick={(e) => {
            this.revampList("DEVConfig" , "structureAfterList", index, "delete", e)
          }}/>
        }/></div>;
      }),
      preList2 = _state.preBuild2.map((item, index) => {
        return <div key={index}><Input value={item} onChange={(e) => {
          this.revampList1("preBuild2", index, "add", e)
        }} addonAfter={
          <Icon style={{cursor: "pointer"}} type="minus" onClick={(e) => {
            this.revampList1("preBuild2", index, "delete", e)
          }}/>
        }/></div>;
      }),
      postList2 = _state.postBuild2.map((item, index) => {
        return <div key={index}><Input value={item} onChange={(e) => {
          this.revampList1("postBuild2", index, "add", e)
        }} addonAfter={
          <Icon style={{cursor: "pointer"}} type="minus" onClick={(e) => {
            this.revampList1("postBuild2", index, "delete", e)
          }}/>
        }/></div>;
      }),
      preList3 = _state.preBuild3.map((item, index) => {
        return <div key={index}><Input value={item} onChange={(e) => {
          this.revampList1("preBuild3", index, "add", e)
        }} addonAfter={
          <Icon style={{cursor: "pointer"}} type="minus" onClick={(e) => {
            this.revampList1("preBuild3", index, "delete", e)
          }}/>
        }/></div>;
      }),
      postList3 = _state.postBuild3.map((item, index) => {
        return <div key={index}><Input value={item} onChange={(e) => {
          this.revampList1("postBuild3", index, "add", e)
        }} addonAfter={
          <Icon style={{cursor: "pointer"}} type="minus" onClick={(e) => {
            this.revampList1("postBuild3", index, "delete", e)
          }}/>
        }/></div>;
      }),
      preList4 = _state.preBuild4.map((item, index) => {
        return <div key={index}><Input value={item} onChange={(e) => {
          this.revampList1("preBuild4", index, "add", e)
        }} addonAfter={
          <Icon style={{cursor: "pointer"}} type="minus" onClick={(e) => {
            this.revampList1("preBuild4", index, "delete", e)
          }}/>
        }/></div>;
      }),
      postList4 = _state.postBuild4.map((item, index) => {
        return <div key={index}><Input value={item} onChange={(e) => {
          this.revampList1("postBuild4", index, "add", e)
        }} addonAfter={
          <Icon style={{cursor: "pointer"}} type="minus" onClick={(e) => {
            this.revampList1("postBuild4", index, "delete", e)
          }}/>
        }/></div>;
      });
    return (
      <div className={styles.projectsCenton}>
        <Form horizontal onSubmit={this.okHandler}>
          <div>
            <h3>基本配置</h3>
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
              label="远程机器项目根路径"
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
          </div>
          <div className={styles.seaverMachine}>
            <h3>发布服务器列表</h3>
            <div className={styles.seaverList}>
              <div>
                <h4>开发</h4>
                <div className={styles.list}>
                  <div className="ant-row">
                    <div className="ant-col-6"><label>服务器列表：</label></div>
                    <div className="ant-col-16">
                      <Input />
                    </div>
                  </div>
                  <div className="ant-row">
                    <div className="ant-col-6"><label>发布分支名：</label></div>
                    <div className="ant-col-16">
                      <Input />
                    </div>
                  </div>
                  <div className="ant-row">
                    <div className="ant-col-6"><label>构建前命令：</label></div>
                    <div className={`ant-col-16 ${styles.addMore}`}>
                      {preList1}
                    </div>
                    <div className="ant-col-2" style={{textAlign: "center"}}>
                      <a style={{lineHeight: "28px"}}><Icon type="plus-circle-o" onClick={() => {
                        const preBuild1 = _state.preBuild1.concat();
                        preBuild1.push("");
                        this.setState({preBuild1});
                      }}/></a>
                    </div>
                  </div>
                  <div className="ant-row">
                    <div className="ant-col-6"><label>构建后命令：</label></div>
                    <div className={`ant-col-16 ${styles.addMore}`}>
                      {postList1}
                    </div>
                    <div className="ant-col-2" style={{textAlign: "center"}}>
                      <a style={{lineHeight: "28px"}}><Icon type="plus-circle-o" onClick={() => {
                        const postBuild1 = _state.postBuild1.concat();
                        postBuild1.push("");
                        this.setState({postBuild1});
                      }}/></a>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4>测试</h4>
                <div className={styles.list}>
                  <div className="ant-row">
                    <div className="ant-col-6"><label>服务器列表：</label></div>
                    <div className="ant-col-16">
                      <Input />
                    </div>
                  </div>
                  <div className="ant-row">
                    <div className="ant-col-6"><label>发布分支名：</label></div>
                    <div className="ant-col-16">
                      <Input />
                    </div>
                  </div>
                  <div className="ant-row">
                    <div className="ant-col-6"><label>构建前命令：</label></div>
                    <div className={`ant-col-16 ${styles.addMore}`}>
                      {preList2}
                    </div>
                    <div className="ant-col-2" style={{textAlign: "center"}}>
                      <a style={{lineHeight: "28px"}}><Icon type="plus-circle-o" onClick={() => {
                        const preBuild2 = _state.preBuild2.concat();
                        preBuild2.push("");
                        this.setState({preBuild2});
                      }}/></a>
                    </div>
                  </div>
                  <div className="ant-row">
                    <div className="ant-col-6"><label>构建后命令：</label></div>
                    <div className={`ant-col-16 ${styles.addMore}`}>
                      {postList2}
                    </div>
                    <div className="ant-col-2" style={{textAlign: "center"}}>
                      <a style={{lineHeight: "28px"}}><Icon type="plus-circle-o" onClick={() => {
                        const postBuild2 = _state.postBuild2.concat();
                        postBuild2.push("");
                        this.setState({postBuild2});
                      }}/></a>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            <div className={styles.seaverList}>
              <div>
                <h4>仿真测试</h4>
                <div className={styles.list}>
                  <div className="ant-row">
                    <div className="ant-col-6"><label>服务器列表：</label></div>
                    <div className="ant-col-16">
                      <Input />
                    </div>
                  </div>
                  <div className="ant-row">
                    <div className="ant-col-6"><label>发布分支名：</label></div>
                    <div className="ant-col-16">
                      <Input />
                    </div>
                  </div>
                  <div className="ant-row">
                    <div className="ant-col-6"><label>构建前命令：</label></div>
                    <div className={`ant-col-16 ${styles.addMore}`}>
                      {preList3}
                    </div>
                    <div className="ant-col-2" style={{textAlign: "center"}}>
                      <a style={{lineHeight: "28px"}}><Icon type="plus-circle-o" onClick={() => {
                        const preBuild3 = _state.preBuild3.concat();
                        preBuild3.push("");
                        this.setState({preBuild3});
                      }}/></a>
                    </div>
                  </div>
                  <div className="ant-row">
                    <div className="ant-col-6"><label>构建后命令：</label></div>
                    <div className={`ant-col-16 ${styles.addMore}`}>
                      {postList3}
                    </div>
                    <div className="ant-col-2" style={{textAlign: "center"}}>
                      <a style={{lineHeight: "28px"}}><Icon type="plus-circle-o" onClick={() => {
                        const postBuild3 = _state.postBuild3.concat();
                        postBuild3.push("");
                        this.setState({postBuild3});
                      }}/></a>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4>生产</h4>
                <div className={styles.list}>
                  <div className="ant-row">
                    <div className="ant-col-6"><label>服务器列表：</label></div>
                    <div className="ant-col-16">
                      <Input />
                    </div>
                  </div>
                  <div className="ant-row">
                    <div className="ant-col-6"><label>发布分支名：</label></div>
                    <div className="ant-col-16">
                      <Input />
                    </div>
                  </div>
                  <div className="ant-row">
                    <div className="ant-col-6"><label>构建前命令：</label></div>
                    <div className={`ant-col-16 ${styles.addMore}`}>
                      {preList4}
                    </div>
                    <div className="ant-col-2" style={{textAlign: "center"}}>
                      <a style={{lineHeight: "28px"}}><Icon type="plus-circle-o" onClick={() => {
                        const preBuild4 = _state.preBuild4.concat();
                        preBuild4.push("");
                        this.setState({preBuild4});
                      }}/></a>
                    </div>
                  </div>
                  <div className="ant-row">
                    <div className="ant-col-6"><label>构建后命令：</label></div>
                    <div className={`ant-col-16 ${styles.addMore}`}>
                      {postList4}
                    </div>
                    <div className="ant-col-2" style={{textAlign: "center"}}>
                      <a style={{lineHeight: "28px"}}><Icon type="plus-circle-o" onClick={() => {
                        const postBuild4 = _state.postBuild4.concat();
                        postBuild4.push("");
                        this.setState({postBuild4});
                      }}/></a>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
          <div style={{paddingLeft:430,marginBottom:20}}>
              <Button type="primary" htmlType="submit">保存</Button>
          </div>
        </Form>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const {list, total, pageNo} = state.projects;
  return {
    loading: state.loading.models.projects,
    list,
    total,
    pageNo,
  };
}

ProjectsCentont = Form.create()(ProjectsCentont);
export default connect(mapStateToProps)(ProjectsCreate);
