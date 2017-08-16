package com.mkfree.deploy.domain;

import com.mkfree.deploy.domain.enumclass.ProjectBuildStatus;
import com.mkfree.deploy.domain.enumclass.ProjectBuildType;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;

/**
 * 项目构建历史
 * Created by zhangjh on 2017/2/8.
 */
@Entity
public class ProjectBuildLog extends IDEntity {

    @Column(columnDefinition = "varchar (100) comment '构建名'")
    private String name;
    @Column(columnDefinition = "bigint comment '用户id'")
    private Long userId;
    @Column(columnDefinition = "varchar (100) comment '用户名'")
    private String username;
    @Column(columnDefinition = "bigint comment '项目id'")
    private Long projectId;
    @Column(columnDefinition = "varchar (100) comment '构建类型 BUILD(\"构建\"), SYNC(\"同步命令\")'")
    @Enumerated(EnumType.STRING)
    private ProjectBuildType buildType;
    @Column(columnDefinition = "varchar (100) comment '构建当前版本号'")
    private String buildVersion;
    @Column(columnDefinition = "varchar (100) comment '构建日志状态'")
    @Enumerated(EnumType.STRING)
    private ProjectBuildStatus status;
    @Column(columnDefinition = "varchar (100) comment '项目名'")
    private String projectName;
    @Column(columnDefinition = "longtext comment '详细日志'")
    private String description;


    public String getBuildVersion() {
        return buildVersion;
    }

    public void setBuildVersion(String buildVersion) {
        this.buildVersion = buildVersion;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
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

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public ProjectBuildStatus getStatus() {
        return status;
    }

    public void setStatus(ProjectBuildStatus status) {
        this.status = status;
    }

    public ProjectBuildType getBuildType() {
        return buildType;
    }

    public void setBuildType(ProjectBuildType buildType) {
        this.buildType = buildType;
    }
}
