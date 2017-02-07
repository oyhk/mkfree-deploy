package com.mkfree.deploy.domain;

import javax.persistence.Column;
import javax.persistence.Entity;

/**
 * Created by oyhk on 2017/1/23.
 *
 */
@Entity
public class Project extends IDEntity {

    @Column(columnDefinition = "varchar (100) comment '用户名'", unique = true)
    private String name;
    @Column(columnDefinition = "varchar (255) comment 'git仓库地址'", nullable = false)
    private String gitUrl;
    @Column(columnDefinition = "text comment '分支列表'")
    private String branchList;
    @Column(columnDefinition = "varchar (255) comment '远程机器项目路劲'")
    private String remotePath;
    @Column(columnDefinition = "varchar (255) comment '部署的项目模块名称'")
    private String moduleName;
    @Column(columnDefinition = "text comment '部署的项目模块的目标文件或者目录'")
    private String deployTargetFileList;

    public String getGitUrl() {
        return gitUrl;
    }

    public void setGitUrl(String gitUrl) {
        this.gitUrl = gitUrl;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getBranchList() {
        return branchList;
    }

    public void setBranchList(String branchList) {
        this.branchList = branchList;
    }

    public String getRemotePath() {
        return remotePath;
    }

    public void setRemotePath(String remotePath) {
        this.remotePath = remotePath;
    }

    public String getModuleName() {
        return moduleName;
    }

    public void setModuleName(String moduleName) {
        this.moduleName = moduleName;
    }

    public String getDeployTargetFileList() {
        return deployTargetFileList;
    }

    public void setDeployTargetFileList(String deployTargetFileList) {
        this.deployTargetFileList = deployTargetFileList;
    }

}
