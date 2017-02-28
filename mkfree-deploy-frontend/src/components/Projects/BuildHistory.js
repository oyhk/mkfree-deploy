import React from "react";
import {Timeline, Card} from "antd";
import {connect} from "dva";
import {LOGS_LIST, ROUTE_PROJECT_STRUCTURE_LOGS} from "../../constants";

function Header({children, location, structureLogList}) {
    const {pathname}=location;
    let TimelineTtems = structureLogList.map((test, index) => {
        const {createdAt, name}=test;
        return (
            <Timeline.Item key={index}>
            <span style={{fontSize: '16px'}}>
                {createdAt}
                <a href={ROUTE_PROJECT_STRUCTURE_LOGS + '/' + pathname.split('/')[3] + '/' + LOGS_LIST + '/' + name.split('#')[1]}
                   style={{marginLeft: '15px'}}>{name}</a>
            </span>
            </Timeline.Item
            >)
        
    })
    return (
        <Card >
            <Timeline style={{
                maxHeight: '780px',
                overflowY: 'scroll'
            }}>
                {TimelineTtems}
            </Timeline>
        </Card>
    
    );
}


function mapStateToProps(state) {
    const {structureLogList} = state.projects;
    return {structureLogList};
}

export default connect(mapStateToProps)(Header);
