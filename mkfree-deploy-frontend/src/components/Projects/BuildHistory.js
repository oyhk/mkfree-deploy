import React from "react";
import {Timeline, Card} from "antd";
import {connect} from "dva";

function Header({children, location, structureLogList}) {
    
    let TimelineTtems = structureLogList.map((test, index) => {
        const {createdAt, name}=test;
        return (
            <Timeline.Item key={index}>
            <span style={{fontSize: '16px'}}>
                {createdAt}
                <a style={{marginLeft: '15px'}}>{name}</a>
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
