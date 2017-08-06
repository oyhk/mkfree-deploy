package com.mkfree.deploy.domain;

import javax.persistence.Column;
import javax.persistence.Entity;

/**
 * Created by oyhk on 2017/1/23.
 * 部署的项目模块的目标文件或者目录
 */
@Entity
public class ProjectDeployFile extends IDEntity {
    // 本地文件路劲
    @Column(columnDefinition = "varchar (255) default '' comment '本地文件路劲'")
    private String localFilePath;
    // 远程服务文件路劲
    @Column(columnDefinition = "varchar (255) default '' comment '远程服务文件路劲'")
    private String remoteFilePath;
    // 项目id
    @Column(columnDefinition = "bigint comment '项目id'")
    private Long projectId;
    // 项目名称
    @Column(columnDefinition = "varchar(50) comment '项目名称'")
    private String projectName;
    // 是否启用
    @Column(columnDefinition = "bit comment '是否启用'")
    private Boolean isEnable;

    public String getLocalFilePath() {
        return localFilePath;
    }

    public void setLocalFilePath(String localFilePath) {
        this.localFilePath = localFilePath;
    }

    public String getRemoteFilePath() {
        return remoteFilePath;
    }

    public void setRemoteFilePath(String remoteFilePath) {
        this.remoteFilePath = remoteFilePath;
    }

    public Long getProjectId() {
        return projectId;
    }

    public void setProjectId(Long projectId) {
        this.projectId = projectId;
    }

    public Boolean getEnable() {
        return isEnable;
    }

    public void setEnable(Boolean enable) {
        isEnable = enable;
    }

    public String getProjectName() {
        return projectName;
    }

    public void setProjectName(String projectName) {
        this.projectName = projectName;
    }
}
