import React, {Component} from 'react';
import {connect} from 'dva';
import {Input, Form, Icon, Button, Transfer} from 'antd';

import styles from './Projects.css';

import {PAGE_SIZE, ROUTE_PROJECTS, ENV_DEV, ENV_UAT, ENV_PROD ,ROUTE_PROJECTS_INFO} from '../constants';

const FormItem = Form.Item;

function ProjectsCreate({dispatch, pList, sList, loading}) {
  function editHandler(values) {
    values.id = pList.id;
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
  return (
    <div>
      <ProjectsCentont record={pList||[]} servarData={sList||[]}  onOk={location.pathname.includes(ROUTE_PROJECTS_INFO)?editHandler:saveHandler}/>
    </div>
  );
}


class ProjectsCentont extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: true,
      style:{width:"auto"},
      deployTargetFileList:[],
      DEVConfig: {
        "env": "DEV",
        "serverMachineIdList": [], /*选中服务器列表*/
        "publicBranch": "", /*分支名*/
        "structureBeforeList": [""], /*发布前命令*/
        "structureAfterList": [""], /*发布后命令*/
      },

      TESTConfig: {
        "env": "TEST",
        "serverMachineIdList": [],
        "publicBranch": "",
        "structureBeforeList": [""],
        "structureAfterList": [""],
      },

      UATConfig: {
        "env": "UAT",
        "serverMachineIdList": [],
        "publicBranch": "",
        "structureBeforeList": [""],
        "structureAfterList": [""],
      },

      PRODConfig: {
        "env": "PROD",
        "serverMachineIdList": [],
        "publicBranch": "",
        "structureBeforeList": [""],
        "structureAfterList": [""],
      },
    };
  }

  componentDidMount() {
    if (this.props.record && this.props.record.projectEnvConfigList) {
        const
            projectEnvConfigList = this.props.record.projectEnvConfigList,
            {DEVConfig , TESTConfig , UATConfig , PRODConfig} = this.state;
        projectEnvConfigList.map((item)=>{
            switch (item.env){
                case "DEV" :this.setState({DEVConfig:item});break;
                case "TEST" :this.setState({TESTConfig:item});break;
                case "UAT" :this.setState({UATConfig:item});break;
                case "PROD" :this.setState({PRODConfig:item});break;
            }
        });
    }
      this.setState({style:{width:document.body.offsetWidth - 336}});
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.record && nextProps.record.projectEnvConfigList && this.state.visible) {
      const
          projectEnvConfigList = nextProps.record.projectEnvConfigList,
          {DEVConfig , TESTConfig , UATConfig , PRODConfig} = this.state;
          projectEnvConfigList.map((item)=>{
              switch (item.env){
                case "DEV" :this.setState({DEVConfig:item});break;
                case "TEST" :this.setState({TESTConfig:item});break;
                case "UAT" :this.setState({UATConfig:item});break;
                case "PROD" :this.setState({PRODConfig:item});break;
              }
          });
      this.setState({
        // DEVConfig: nextProps.record.projectEnvConfigList[0],
        // TESTConfig: nextProps.record.projectEnvConfigList[1],
        // UATConfig: nextProps.record.projectEnvConfigList[2],
        // PRODConfig: nextProps.record.projectEnvConfigList[3],
        deployTargetFileList: nextProps.record.deployTargetFileList || [""],
        visible: false
      })
    }
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

  okHandler = (e) => {
    e.preventDefault();
    const {onOk} = this.props;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let
          deployTargetFileList = this.state.deployTargetFileList;
          deployTargetFileList[0] = values.deployTargetFile;
        values["projectEnvConfigList"] = [
          this.state.DEVConfig,
          this.state.TESTConfig,
          this.state.UATConfig,
          this.state.PRODConfig,
        ];
        values["deployTargetFileList"] = deployTargetFileList;

        delete  values.deployTargetFile;

        onOk(values);

      }
    });
  };
  revampList = (env, after, index, type, value) => {

    const Build = JSON.parse(JSON.stringify(this.state[env]));

    (type == "add" ) && (Build[after].push(""));

    (type == "delete" && Build[after].length > 1) && (Build[after].splice(index, 1));

    (type == "revamp" && index > -1 && Build[after]) && (Build[after][index] = value);

    (type == "revamp" && index > -1 && !( Build[after])) && (Build[after] = [value]);

    (type == "revamp" && index == -1) && (Build[after] = value);

    this.setState({[env]: Build});
  };
  revampDeployTarget = (index,type,value)=>{
      const Build = (this.state.deployTargetFileList || [] ).concat();

      (type == "add" ) && (Build.push(""));

      (type == "revamp" ) && (Build[index] = value);

      (type == "delete" ) && (Build.splice(index , 1));

      (Build.length == 0 ) && (Build.push(""));

      (type == "delete" && index == 0) && (this.props.form.setFieldsValue({"deployTargetFile":Build[0]}));

      this.setState({
          deployTargetFileList : Build
      });
  }


  render() {
    const {children} = this.props;
    const {getFieldDecorator} = this.props.form;
    const {name, gitUrl, publishBranch, remotePath, moduleName, deployTargetFileList} = this.props.record;
    const deployTargetFile = (this.state.deployTargetFileList || [""])[0];
    const formItemLayout = {
      labelCol: {span: 6},
      wrapperCol: {span: 8},
    };
    const
      _state = this.state,
      mockData = [],
      DEVTargetKeys = _state.DEVConfig.serverMachineIdList || [],
      TESTTargetKeys = _state.TESTConfig.serverMachineIdList || [],
      UATTargetKeys = _state.UATConfig.serverMachineIdList || [],
      PRODTargetKeys = _state.PRODConfig.serverMachineIdList || [],
      DEVStructureB = (_state.DEVConfig.structureBeforeList || [""] ).map((item, index) => {
        return <div key={index}><Input value={item} onChange={(e) => {
                    this.revampList("DEVConfig", "structureBeforeList", index, "revamp", e.target.value)
                }} addonAfter={
                    <Icon style={{cursor: "pointer"}} type="minus" onClick={(e) => {
                        this.revampList("DEVConfig", "structureBeforeList", index, "delete", e)
                    }}/>
                }/></div>;
      }),
      DEVStructureA = (_state.DEVConfig.structureAfterList || [""]).map((item, index) => {
        return <div key={index}><Input value={item} onChange={(e) => {
                    this.revampList("DEVConfig", "structureAfterList", index, "revamp", e.target.value)
                }} addonAfter={
                    <Icon style={{cursor: "pointer"}} type="minus" onClick={(e) => {
                        this.revampList("DEVConfig", "structureAfterList", index, "delete", e)
                    }}/>
                }/></div>
      }),
      TESTStructureB = (_state.TESTConfig.structureBeforeList || [""] ).map((item, index) => {
        return <div key={index}><Input value={item} onChange={(e) => {
                    this.revampList("TESTConfig", "structureBeforeList", index, "revamp", e.target.value)
                }} addonAfter={
                    <Icon style={{cursor: "pointer"}} type="minus" onClick={(e) => {
                        this.revampList("TESTConfig", "structureBeforeList", index, "delete", e)
                    }}/>
                }/></div>;
      }),
      TESTStructureA = (_state.TESTConfig.structureAfterList || [""]).map((item, index) => {
        return <div key={index}><Input value={item} onChange={(e) => {
                    this.revampList("TESTConfig", "structureAfterList", index, "revamp", e.target.value)
                }} addonAfter={
                    <Icon style={{cursor: "pointer"}} type="minus" onClick={(e) => {
                        this.revampList("TESTConfig", "structureAfterList", index, "delete", e)
                    }}/>
                }/></div>
      }),
      UATStructureB = (_state.UATConfig.structureBeforeList || [""] ).map((item, index) => {
        return <div key={index}><Input value={item} onChange={(e) => {
                    this.revampList("UATConfig", "structureBeforeList", index, "revamp", e.target.value)
                }} addonAfter={
                    <Icon style={{cursor: "pointer"}} type="minus" onClick={(e) => {
                        this.revampList("UATConfig", "structureBeforeList", index, "delete", e)
                    }}/>
                }/></div>;
      }),
      UATStructureA = (_state.UATConfig.structureAfterList || [""]).map((item, index) => {
        return <div key={index}><Input value={item} onChange={(e) => {
                    this.revampList("UATConfig", "structureAfterList", index, "revamp", e.target.value)
                }} addonAfter={
                    <Icon style={{cursor: "pointer"}} type="minus" onClick={(e) => {
                        this.revampList("UATConfig", "structureAfterList", index, "delete", e)
                    }}/>
                }/></div>;
      }),
      PRODStructureB = (_state.PRODConfig.structureBeforeList || [""] ).map((item, index) => {
        return <div key={index}><Input value={item} onChange={(e) => {
                    this.revampList("PRODConfig", "structureBeforeList", index, "revamp", e.target.value)
                }} addonAfter={
                    <Icon style={{cursor: "pointer"}} type="minus" onClick={(e) => {
                        this.revampList("PRODConfig", "structureBeforeList", index, "delete", e)
                    }}/>
                }/></div>;
      }),
      PRODStructureA = (_state.PRODConfig.structureAfterList || [""]).map((item, index) => {
        return <div key={index}><Input value={item} onChange={(e) => {
                    this.revampList("PRODConfig", "structureAfterList", index, "revamp", e.target.value)
                }} addonAfter={
                    <Icon style={{cursor: "pointer"}} type="minus" onClick={(e) => {
                        this.revampList("PRODConfig", "structureAfterList", index, "delete", e)
                    }}/>
                }/></div>;


      }),
      deployTargetFiles = (_state.deployTargetFileList || [""]).map((item, index) => {
        if( index > 0 ) {
            return <div key={index} style={{marginTop:10}}><Input value={item} onChange={(e) => {
                this.revampDeployTarget(index,"revamp", e.target.value)
            }} addonAfter={
                <Icon style={{cursor: "pointer"}} type="minus" onClick={(e) => {
                    this.revampDeployTarget( index, "delete", e)
                }}/>
            }/></div>;
        }
      });

    if (this.props.servarData.length > 0) {
      this.props.servarData.map((item, index)=> {
        mockData.push({
          key: item.id,
          title: item.name,
          description: index,
        });
      });
    }



    return (
      <div className={styles.projectsCenton} style={this.state.style}>
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
                })(<Input addonAfter={<Icon style={{cursor: "pointer"}} type="minus" onClick={(e) => {this.revampDeployTarget( 0, "delete", e)}}/>}/>)
              }
                {deployTargetFiles}
              <a style={{position: "absolute",top:0,right:"-18px"}}><Icon type="plus-circle-o" onClick={(e) => {this.revampDeployTarget( -1, "add", "")}}/></a>

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
                    <div className="ant-col-18">
                      <Transfer
                        dataSource={mockData}
                        titles={['Source', 'Target']}
                        targetKeys={DEVTargetKeys}
                        selectedKeys={_state.selectedKeys}
                        onChange={(nextTargetKeys)=> {
                                                    this.revampList("DEVConfig", "serverMachineIdList", -1, "revamp", nextTargetKeys);
                                                }}
                        render={item => item.title}
                      />
                    </div>
                  </div>
                  <div className="ant-row">
                    <div className="ant-col-6"><label>发布分支名：</label></div>
                    <div className="ant-col-16">
                      <Input value={_state.DEVConfig.publicBranch||""} onChange={(e)=>this.revampList("DEVConfig", "publicBranch", -1, "revamp", e.target.value)}/>
                    </div>
                  </div>
                  <div className="ant-row">
                    <div className="ant-col-6"><label>构建前命令：</label></div>
                    <div className={`ant-col-16 ${styles.addMore}`}>
                      {DEVStructureB}
                    </div>
                    <div className="ant-col-2" style={{textAlign: "center"}}>
                      <a style={{lineHeight: "28px"}}><Icon type="plus-circle-o" onClick={() => {
                                                this.revampList("DEVConfig", "structureBeforeList", 0, "add", "")
                                            }}/></a>
                    </div>
                  </div>
                  <div className="ant-row">
                    <div className="ant-col-6"><label>构建后命令：</label></div>
                    <div className={`ant-col-16 ${styles.addMore}`}>
                      {DEVStructureA}
                    </div>
                    <div className="ant-col-2" style={{textAlign: "center"}}>
                      <a style={{lineHeight: "28px"}}><Icon type="plus-circle-o" onClick={() => {
                                                this.revampList("DEVConfig", "structureAfterList", 0, "add", "")
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
                    <div className="ant-col-18">
                      <Transfer
                        dataSource={mockData}
                        titles={['Source', 'Target']}
                        targetKeys={TESTTargetKeys}
                        selectedKeys={_state.selectedKeys}
                        onChange={(nextTargetKeys)=> {
                                                    this.revampList("TESTConfig", "serverMachineIdList", -1, "revamp", nextTargetKeys);
                                                }}
                        render={item => item.title}
                      />
                    </div>
                  </div>
                  <div className="ant-row">
                    <div className="ant-col-6"><label>发布分支名：</label></div>
                    <div className="ant-col-16">
                      <Input value={_state.TESTConfig.publicBranch||""} onChange={(e)=>this.revampList("TESTConfig", "publicBranch", -1, "revamp", e.target.value)}/>
                    </div>
                  </div>
                  <div className="ant-row">
                    <div className="ant-col-6"><label>构建前命令：</label></div>
                    <div className={`ant-col-16 ${styles.addMore}`}>
                      {TESTStructureB}
                    </div>
                    <div className="ant-col-2" style={{textAlign: "center"}}>
                      <a style={{lineHeight: "28px"}}><Icon type="plus-circle-o" onClick={() => {
                                                this.revampList("TESTConfig", "structureBeforeList", 0, "add", "")
                                            }}/></a>
                    </div>
                  </div>
                  <div className="ant-row">
                    <div className="ant-col-6"><label>构建后命令：</label></div>
                    <div className={`ant-col-16 ${styles.addMore}`}>
                      {TESTStructureA}
                    </div>
                    <div className="ant-col-2" style={{textAlign: "center"}}>
                      <a style={{lineHeight: "28px"}}><Icon type="plus-circle-o" onClick={() => {
                                                this.revampList("TESTConfig", "structureAfterList", 0, "add", "")
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
                    <div className="ant-col-18">
                      <Transfer
                        dataSource={mockData}
                        titles={['Source', 'Target']}
                        targetKeys={UATTargetKeys}
                        selectedKeys={_state.selectedKeys}
                        onChange={(nextTargetKeys)=> {
                                                    this.revampList("UATConfig", "serverMachineIdList", -1, "revamp", nextTargetKeys);
                                                }}
                        render={item => item.title}
                      />
                    </div>
                  </div>
                  <div className="ant-row">
                    <div className="ant-col-6"><label>发布分支名：</label></div>
                    <div className="ant-col-16">
                      <Input value={_state.UATConfig.publicBranch||""} onChange={(e)=>this.revampList("UATConfig", "publicBranch", -1, "revamp", e.target.value)}/>
                    </div>
                  </div>
                  <div className="ant-row">
                    <div className="ant-col-6"><label>构建前命令：</label></div>
                    <div className={`ant-col-16 ${styles.addMore}`}>
                      {UATStructureB}
                    </div>
                    <div className="ant-col-2" style={{textAlign: "center"}}>
                      <a style={{lineHeight: "28px"}}><Icon type="plus-circle-o" onClick={() => {
                                                this.revampList("UATConfig", "structureBeforeList", 0, "add", "")
                                            }}/></a>
                    </div>
                  </div>
                  <div className="ant-row">
                    <div className="ant-col-6"><label>构建后命令：</label></div>
                    <div className={`ant-col-16 ${styles.addMore}`}>
                      {UATStructureA}
                    </div>
                    <div className="ant-col-2" style={{textAlign: "center"}}>
                      <a style={{lineHeight: "28px"}}><Icon type="plus-circle-o" onClick={() => {
                                                this.revampList("UATConfig", "structureAfterList", 0, "add", "")
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
                    <div className="ant-col-18">
                      <Transfer
                        dataSource={mockData}
                        titles={['Source', 'Target']}
                        targetKeys={PRODTargetKeys}
                        selectedKeys={_state.selectedKeys}
                        onChange={(nextTargetKeys)=> {
                                                    this.revampList("PRODConfig", "serverMachineIdList", -1, "revamp", nextTargetKeys);
                                                }}
                        render={item => item.title}
                      />
                    </div>
                  </div>
                  <div className="ant-row">
                    <div className="ant-col-6"><label>发布分支名：</label></div>
                    <div className="ant-col-16">
                      <Input value={_state.PRODConfig.publicBranch||""} onChange={(e)=>this.revampList("PRODConfig", "publicBranch", -1, "revamp", e.target.value)}/>
                    </div>
                  </div>
                  <div className="ant-row">
                    <div className="ant-col-6"><label>构建前命令：</label></div>
                    <div className={`ant-col-16 ${styles.addMore}`}>
                      {PRODStructureB}
                    </div>
                    <div className="ant-col-2" style={{textAlign: "center"}}>
                      <a style={{lineHeight: "28px"}}><Icon type="plus-circle-o" onClick={() => {
                                                this.revampList("PRODConfig", "structureBeforeList", 0, "add", "")
                                            }}/></a>
                    </div>
                  </div>
                  <div className="ant-row">
                    <div className="ant-col-6"><label>构建后命令：</label></div>
                    <div className={`ant-col-16 ${styles.addMore}`}>
                      {PRODStructureA}
                    </div>
                    <div className="ant-col-2" style={{textAlign: "center"}}>
                      <a style={{lineHeight: "28px"}}><Icon type="plus-circle-o" onClick={() => {
                                                this.revampList("PRODConfig", "structureAfterList", 0, "add", "")
                                            }}/></a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
          <div style={{paddingLeft: 430, marginBottom: 20}}>
            <Button type="primary" htmlType="submit">保存</Button>
          </div>
        </Form>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const {pList, sList} = state.projects;
  return {
    loading: state.loading.models.projects,
    pList,
    sList,
  };
}

ProjectsCentont = Form.create()(ProjectsCentont);
export default connect(mapStateToProps)(ProjectsCreate);
