package com.mkfree.deploy.domain;

import com.mkfree.deploy.domain.enumclass.ProjectBuildLogStatus;

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

    //构建名
    @Column(columnDefinition = "varchar (100) comment '构建名'")
    private String name;
    //用户id
    @Column(columnDefinition = "bigint comment '用户id'")
    private Long userId;
    //用户名
    @Column(columnDefinition = "varchar (100) comment '用户名'")
    private String username;
    //项目id
    @Column(columnDefinition = "bigint comment '项目id'")
    private Long projectId;
    //构建日志状态
    @Column(columnDefinition = "varchar (100) comment '构建日志状态'")
    @Enumerated(EnumType.STRING)
    private ProjectBuildLogStatus status = ProjectBuildLogStatus.PROCESSING;
    //项目名
    @Column(columnDefinition = "varchar (100) comment '项目名'")
    private String projectName;
    //详细日志
    @Column(columnDefinition = "longtext comment '详细日志'")
    private String description;

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

    public ProjectBuildLogStatus getStatus() {
        return status;
    }

    public void setStatus(ProjectBuildLogStatus status) {
        this.status = status;
    }
}
