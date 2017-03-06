import React from "react";
import BuildHistory from "./BuildHistory";
import ProjectsMenu from "./ProjectsMenu";
import styles from "./Projects.css";
import {connect} from "dva";


function Header(props) {
    const {children}=props;
    console.log(props)
    return (
        <div className={styles.normal}>
            <div className={styles.header}>
                <ProjectsMenu {...props}/>
                <BuildHistory {...props}/>
            </div>
            <div className={styles.content}>
                <div className={styles.main}>
                    {children}
                </div>
            </div>
        </div>
    
    );
}


function mapStateToProps(state) {
    const {structureLogList, projectEnvConfigList, visible_more, recordID, envType, serverMachineList} = state.projects;
    return {structureLogList, projectEnvConfigList, visible_more, recordID, envType, serverMachineList};
}

export default connect(mapStateToProps)(Header);
