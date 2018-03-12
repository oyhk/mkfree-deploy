package com.mkfree.deploy.domain;

import com.mkfree.deploy.domain.enumclass.ProjectBuildStatus;
import com.mkfree.deploy.domain.enumclass.ProjectBuildType;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import java.util.Date;

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
    @Column(columnDefinition = "varchar(30) comment '发布ip'")
    private String ip;
    @Column(columnDefinition = "bigint comment '环境id'")
    private Long envId;
    @Column(columnDefinition = "varchar(30) comment '环境名称'")
    private String envName;
    @Column(columnDefinition = "bigint comment '日志序号'")
    private Long seqNo;

    public Long getSeqNo() {
        return seqNo;
    }

    public void setSeqNo(Long seqNo) {
        this.seqNo = seqNo;
    }

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

    public ProjectBuildLog() {
        super();
    }

    public ProjectBuildLog(String buildVersion, Date createdAt) {
        this.buildVersion = buildVersion;
        this.createdAt = createdAt;
    }


    public String getIp() {
        return ip;
    }

    public void setIp(String ip) {
        this.ip = ip;
    }

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
