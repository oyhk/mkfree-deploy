package com.mkfree.deploy.domain;

import com.mkfree.deploy.domain.enumclass.ProjectEnv;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

import javax.persistence.*;
import java.util.Date;

/**
 * Created by oyhk on 2018/1/9.
 */
@Entity
@Table(uniqueConstraints = {@UniqueConstraint(columnNames = {"projectEnv", "serverIp", "projectId"})})
@DynamicInsert
@DynamicUpdate
public class ProjectEnvIp extends IDEntity {

    @Enumerated(EnumType.STRING)
    @Column(columnDefinition = "varchar(20) comment '项目环境'")
    private ProjectEnv projectEnv;
    @Column(columnDefinition = "varchar(20) comment '服务器ip'")
    private String serverIp;
    @Column(columnDefinition = "varchar(20) comment '服务器名称 '")
    private String serverName;
    @Column(columnDefinition = "bigint comment '项目id'")
    private Long projectId;
    @Column(columnDefinition = "varchar(50) comment '项目名称'")
    private String projectName;
    @Column(columnDefinition = "datetime comment '发布时间'")
    public Date publishTime;
    @Column(columnDefinition = "varchar(50) comment '发布版本'")
    public String publishVersion;
    @Column(columnDefinition = "bit default 0 comment '是否发布服务器'")
    private Boolean isPublish;
    @Column(columnDefinition = "bit default 0 comment '是否同步服务器，否：那么从发布机器同步 是：从某台服务器同步项目'")
    private Boolean isSync;

    public String getPublishVersion() {
        return publishVersion;
    }

    public void setPublishVersion(String publishVersion) {
        this.publishVersion = publishVersion;
    }

    public String getProjectName() {
        return projectName;
    }

    public void setProjectName(String projectName) {
        this.projectName = projectName;
    }

    public ProjectEnv getProjectEnv() {
        return projectEnv;
    }

    public void setProjectEnv(ProjectEnv projectEnv) {
        this.projectEnv = projectEnv;
    }

    public String getServerIp() {
        return serverIp;
    }

    public void setServerIp(String serverIp) {
        this.serverIp = serverIp;
    }

    public String getServerName() {
        return serverName;
    }

    public void setServerName(String serverName) {
        this.serverName = serverName;
    }

    public Long getProjectId() {
        return projectId;
    }

    public void setProjectId(Long projectId) {
        this.projectId = projectId;
    }

    public Date getPublishTime() {
        return publishTime;
    }

    public void setPublishTime(Date publishTime) {
        this.publishTime = publishTime;
    }

    public Boolean getPublish() {
        return isPublish;
    }

    public void setPublish(Boolean publish) {
        isPublish = publish;
    }

    public Boolean getSync() {
        return isSync;
    }

    public void setSync(Boolean sync) {
        isSync = sync;
    }
}
