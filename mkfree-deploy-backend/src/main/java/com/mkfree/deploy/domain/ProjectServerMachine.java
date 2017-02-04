package com.mkfree.deploy.domain;

import javax.persistence.Column;
import javax.persistence.Entity;

/**
 * Created by oyhk on 2017/2/4.
 */
@Entity
public class ProjectServerMachine extends IDEntity {

    @Column(columnDefinition = "bigint comment '项目id'")
    private String projectId;
    @Column(columnDefinition = "bigint comment '服务器id'")
    private String serverMachineId;

    public String getServerMachineId() {
        return serverMachineId;
    }

    public void setServerMachineId(String serverMachineId) {
        this.serverMachineId = serverMachineId;
    }

    public String getProjectId() {
        return projectId;
    }

    public void setProjectId(String projectId) {
        this.projectId = projectId;
    }
}
