import React from "react";
import {connect} from "dva";
import styles from "./Projects.css";
import cookie from "react-cookie";


function StructureLogs({params}) {
    const {project_name, info_id}=params;
    let stompClient;
    
    function websocket() {
        var socket = new SockJS('http://192.168.1.210:8091/websocket/init');
        stompClient = Stomp.over(socket);
        var headers = {
            login: 'mylogin',
            passcode: 'localhost',
            user_token: cookie.load('user_token'),
            'Content-Type': 'application/json'
        };
        stompClient.connect({}, function (frame) {
            console.log('Connected: ' + frame);
            // /log/${project_name}#${info_id}
            stompClient.subscribe(` /log/log1`, function (greeting) {
                console.log(JSON.parse(greeting.body).content);
            });
        }, (a) => {
            console.log('失败', a)
        });
    }
    
    function disconnect() {
        stompClient.disconnect(() => {
            console.log('成功切断')
        })
    }
    
    return (
        
        <div className={styles.normal}>
            <button onClick={websocket}>
                建立websocket
            </button>
            <button onClick={disconnect}>
                切断websocket
            </button>
        </div>
    );
}


function mapStateToProps({routing, projects, loading}) {
    const {list, total, pageNo, visible_more, recordID, envType, serverMachineList} = projects;
    // console.log(routing)
    // const {}=routing;
    return {
        loading: loading.models.projects,
        list,
        total,
        pageNo,
        visible_more,
        recordID,
        envType,
        serverMachineList,
    };
}
export default connect(mapStateToProps)(StructureLogs);
