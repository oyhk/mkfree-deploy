package com.mkfree.deploy.domain;

import com.mkfree.deploy.domain.enumclass.BuildStatus;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

import javax.persistence.*;
import java.util.Date;

/**
 * Created by oyhk on 2018/1/9.
 */
@Entity
@Table(uniqueConstraints = {
        @UniqueConstraint(columnNames = {"envId", "serverIp", "projectId"})
})
@DynamicInsert
@DynamicUpdate
public class ProjectEnvIp extends IDEntity {

    @Column(columnDefinition = "bigint comment '环境id'")
    private Long envId;
    @Column(columnDefinition = "varchar(30) comment '环境名称'")
    private String envName;
    @Column(columnDefinition = "varchar(20) comment '服务器ip'")
    private String serverIp;
    @Column(columnDefinition = "varchar(20) comment '服务器名称 '")
    private String serverName;
    @Column(columnDefinition = "bigint comment '项目id'")
    private Long projectId;
    @Column(columnDefinition = "varchar(50) comment '项目名称'")
    private String projectName;
    @Column(columnDefinition = "datetime comment '发布时间'")
    private Date publishTime;
    @Column(columnDefinition = "varchar(50) comment '发布版本'")
    private String publishVersion;
    @Column(columnDefinition = "bit default 0 comment '是否发布服务器'", name = "is_publish")
    private Boolean publish;
    @Column(columnDefinition = "bit default 0 comment '是否同步服务器，否：那么从发布机器同步 是：从某台服务器同步项目'", name = "is_sync")
    private Boolean sync;
    @Enumerated(EnumType.STRING)
    private BuildStatus buildStatus;

    public BuildStatus getBuildStatus() {
        return buildStatus;
    }

    public void setBuildStatus(BuildStatus buildStatus) {
        this.buildStatus = buildStatus;
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
        return publish;
    }

    public void setPublish(Boolean publish) {
        this.publish = publish;
    }

    public Boolean getSync() {
        return sync;
    }

    public void setSync(Boolean sync) {
        this.sync = sync;
    }
}
