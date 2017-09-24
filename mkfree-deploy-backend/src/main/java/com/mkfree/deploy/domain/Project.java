package com.mkfree.deploy.domain;

import javax.persistence.Column;
import javax.persistence.Entity;

/**
 * Created by oyhk on 2017/1/23.
 *
 */
@Entity
public class Project extends IDEntity {

    //项目名称
    @Column(columnDefinition = "varchar (50) comment '项目名称'", unique = true)
    private String name;
    //git仓库地址
    @Column(columnDefinition = "varchar (1000) comment 'git仓库地址'", nullable = false)
    private String gitUrl;
    //分支列表
    @Column(columnDefinition = "varchar(1000) comment '分支列表'")
    private String branchList;
    //远程机器项目路劲
    @Column(columnDefinition = "varchar (255) comment '远程机器项目路劲'")
    private String remotePath;
    //部署的项目模块名称
    @Column(columnDefinition = "varchar (255) comment '部署的项目模块名称'")
    private String moduleName;
    //项目系统路劲
    @Column(columnDefinition = "varchar(255) comment '项目系统路劲'")
    private String systemPath;
    @Column(columnDefinition = "bigint comment '项目标签id'")
    private Long projectTagId;
    @Column(columnDefinition = "varchar(50) comment '项目标签名称'")
    private String projectTagName;

    public String getSystemPath() {
        return systemPath;
    }

    public void setSystemPath(String systemPath) {
        this.systemPath = systemPath;
    }

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

    public Long getProjectTagId() {
        return projectTagId;
    }

    public void setProjectTagId(Long projectTagId) {
        this.projectTagId = projectTagId;
    }

    public String getProjectTagName() {
        return projectTagName;
    }

    public void setProjectTagName(String projectTagName) {
        this.projectTagName = projectTagName;
    }
}
