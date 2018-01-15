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

    //项目id
    @Column(columnDefinition = "bigint comment '项目id'")
    private Long projectId;
    @Column(columnDefinition = "varchar(50) comment '项目名称'")
    private String projectName;
    @Column(columnDefinition = "bigint comment '环境id'")
    private Long envId;
    @Column(columnDefinition = "varchar(50) comment '环境名称'")
    private String envName;
    //发布分支名称
    @Column(columnDefinition = "varchar(255) comment '发布分支名称'")
    private String publicBranch;

    public Long getEnvId() {
        return envId;
    }

    public void setEnvId(Long envId) {
        this.envId = envId;
    }

    public String getEnvName() {
        return envName;
    }

    public void setEnvName(String envName) {
        this.envName = envName;
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

    public String getProjectName() {
        return projectName;
    }

    public void setProjectName(String projectName) {
        this.projectName = projectName;
    }
}
