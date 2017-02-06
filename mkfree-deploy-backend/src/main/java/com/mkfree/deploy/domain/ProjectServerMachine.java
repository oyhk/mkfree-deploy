package com.mkfree.deploy.domain;

import javax.persistence.Column;
import javax.persistence.Entity;

/**
 * Created by oyhk on 2017/2/4.
 */
@Entity
public class ProjectServerMachine extends IDEntity {

    @Column(columnDefinition = "bigint comment '项目id'")
    private Long projectId;
    @Column(columnDefinition = "bigint comment '服务器id'")
    private Long serverMachineId;

    public Long getProjectId() {
        return projectId;
    }

    public void setProjectId(Long projectId) {
        this.projectId = projectId;
    }

    public Long getServerMachineId() {
        return serverMachineId;
    }

    public void setServerMachineId(Long serverMachineId) {
        this.serverMachineId = serverMachineId;
    }
}
