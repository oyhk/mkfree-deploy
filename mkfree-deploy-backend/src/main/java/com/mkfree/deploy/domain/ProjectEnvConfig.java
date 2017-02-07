package com.mkfree.deploy.domain;

import com.mkfree.deploy.domain.enumclass.ProjectEnv;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;

/**
 * Created by oyhk on 2017/2/7.
 *
 */
@Entity
public class ProjectEnvConfig extends IDEntity {

    @Column(columnDefinition = "bigint comment '项目id'")
    private Long projectId;
    @Column(columnDefinition = "varchar(50) comment '环境类型'")
    @Enumerated(EnumType.STRING)
    private ProjectEnv env;
    @Column(columnDefinition = "varchar(255) comment '需要发布的服务机器列表'")
    private String serverMachineList;
    @Column(columnDefinition = "varchar(255) comment '发布分支名称'")
    private String publicBranch;


    public ProjectEnv getEnv() {
        return env;
    }

    public void setEnv(ProjectEnv env) {
        this.env = env;
    }

    public String getServerMachineList() {
        return serverMachineList;
    }

    public void setServerMachineList(String serverMachineList) {
        this.serverMachineList = serverMachineList;
    }

    public String getPublicBranch() {
        return publicBranch;
    }

    public void setPublicBranch(String publicBranch) {
        this.publicBranch = publicBranch;
    }

    public Long getProjectId() {
        return projectId;
    }

    public void setProjectId(Long projectId) {
        this.projectId = projectId;
    }
}
