import React from "react";
import {connect} from "dva";
import styles from "./Projects.css";


function StructureLogs({dispatch}) {
    
    
    function websocket() {
        var socket = new SockJS('/websocket/init');
        const stompClient = Stomp.over(socket);
        stompClient.connect({}, function (frame) {
            console.log('Connected: ' + frame);
            stompClient.subscribe('/log/log1', function (greeting) {
                console.log(JSON.parse(greeting.body).content);
            });
        });
    }
    
    return (
        
        <div className={styles.normal}>
            <button onClick={websocket}>
                websocket
            </button>
        </div>
    );
}


function mapStateToProps(state) {
    const {list, total, pageNo, visible_more, recordID, envType, serverMachineList} = state.projects;
    return {
        loading: state.loading.models.projects,
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
