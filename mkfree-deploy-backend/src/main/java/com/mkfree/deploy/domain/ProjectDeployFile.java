package com.mkfree.deploy.domain;

import com.mkfree.deploy.domain.enumclass.Whether;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;

/**
 * Created by oyhk on 2017/1/23.
 * 部署的项目模块的目标文件或者目录
 */
@Entity
public class ProjectDeployFile extends IDEntity {
    // 本地文件路劲
    @Column(columnDefinition = "varchar (255) default ''", unique = true)
    private String localFilePath;
    // 远程服务文件路劲
    @Column(columnDefinition = "varchar (255) default ''")
    private String remoteFilePath;
    // 项目id
    @Column(columnDefinition = "bigint")
    private Long projectId;
    // 项目名称
    @Column
    private String projectName;
    // 是否启用
    @Column(columnDefinition = "varchar (255)")
    @Enumerated(EnumType.STRING)
    private Whether isEnable;

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

    public Whether getIsEnable() {
        return isEnable;
    }

    public void setIsEnable(Whether isEnable) {
        this.isEnable = isEnable;
    }

    public String getProjectName() {
        return projectName;
    }

    public void setProjectName(String projectName) {
        this.projectName = projectName;
    }
}
