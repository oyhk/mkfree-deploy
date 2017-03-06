import React from "react";
import {Timeline, Card} from "antd";
import {Link} from "dva/router";
import {LOGS_LIST, ROUTE_PROJECT_STRUCTURE_LOGS} from "../../constants";

function Header({children, location, structureLogList}) {
    const {pathname}=location;
    let TimelineTtems = structureLogList.map((test, index) => {
        const {createdAt, name, seqNo}=test;
        return (
            <Timeline.Item key={index}>
            <span style={{fontSize: '16px'}}>
                {createdAt}
                <Link
                    to={ROUTE_PROJECT_STRUCTURE_LOGS + '/' + pathname.split('/')[3] + '/' + pathname.split('/')[4] + '/' + LOGS_LIST + '/' + seqNo}
                    style={{marginLeft: '15px'}}>{name}</Link>
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


export default Header;
