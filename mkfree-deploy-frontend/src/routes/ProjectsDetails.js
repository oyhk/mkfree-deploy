import React, {Component} from "react";
import {connect} from "dva";
import {Input, Form} from "antd";
import {ROUTE_PROJECTS_INFO} from "../constants";
const InputGroup = Input.Group;

const FormItem = Form.Item;

class ProjectsDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    
    componentDidMount() {
        
    }
    
    componentWillReceiveProps(nextProps) {
        
    };
    
    render() {
        return (
            <div>
            
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

export default connect(mapStateToProps)(ProjectsDetails);
