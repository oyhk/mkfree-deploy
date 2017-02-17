import React from "react";
import {Timeline, Card} from "antd";
import {connect} from "dva";

function Header({children, location,structureLogList}) {
    const arr = ['Create a services site 2015-09-01',
        'Create a services site 2015-09-01',
        'Create a services site 2015-09-01',
        'Create a services site 2015-09-01',]
    let TimelineTtems = structureLogList.map((test, index) => {
        return <Timeline.Item key={index}>
            {test}
        </Timeline.Item>
    })
    return (
        <Card  >
            <Timeline>
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
