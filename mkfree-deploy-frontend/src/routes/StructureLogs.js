import {connect} from "dva";
import React, {Component} from "react";
import styles from "./Projects.css";

let stompClient;


class StructureLogs extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
        };
    }
    
    componentWillMount() {
        const {description}=this.props;
        if (!description) {
            this.websocket()
        }
    }
    
    componentWillUnmount() {
        this.disconnect()
    }
    
    
    websocket() {
        const {dispatch, params}=this.props;
        const {project_name, info_id}=params;
        var socket = new SockJS('http://192.168.1.210:8091/websocket/init');
        stompClient = Stomp.over(socket);
        stompClient.connect({}, function (frame) {
            console.log('Connected: ' + frame);
            stompClient.subscribe(`/log/${project_name}#${info_id}`, function (greeting) {
                dispatch({
                    type: 'projects/changeDescription',
                    payload: {
                        description: JSON.parse(greeting.body).content
                    }
                })
            });
        }, (a) => {
            console.log('失败', a)
        });
    }
    
    disconnect() {
        stompClient.disconnect(() => {
            console.log('成功切断')
        })
    }
    
    
    render() {
        const {description, params}=this.props;
        const {project_name, info_id}=params;
        return (
            <div className={styles.normal}>
                <h2 style={{fontSize: '30px'}}>{project_name}#{ info_id}</h2>
                {description}
            </div>
        );
    }
}


function mapStateToProps({routing, projects, loading}) {
    const {description} = projects;
    return {
        description,
    };
}
export default connect(mapStateToProps)(StructureLogs);
