package com.mkfree.deploy.domain;

import com.mkfree.deploy.domain.enumclass.ProjectEnv;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Transient;

/**
 * Created by oyhk on 2017/1/23.
 */
@Entity
public class Project extends IDEntity {

    @Column(columnDefinition = "varchar (100) comment '用户名'", unique = true)
    private String name;
    @Column(columnDefinition = "varchar (255) comment 'git仓库地址'")
    private String gitUrl;
    @Column(columnDefinition = "varchar (255) comment '本地项目路劲'")
    private String localPath;
    @Column(columnDefinition = "text comment '分支列表'")
    private String branchList;
    @Column(columnDefinition = "varchar (255) comment '发布分支名称，可以模糊匹配'")
    private String publishBranch;

    /*******下面是 Transient 字段 start ********/
    // 项目的发布环境
    @Transient
    private ProjectEnv env;

    /*******下面是 Transient 字段 end ********/

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

    public ProjectEnv getEnv() {
        return env;
    }

    public void setEnv(ProjectEnv env) {
        this.env = env;
    }

    public String getLocalPath() {
        return localPath;
    }

    public void setLocalPath(String localPath) {
        this.localPath = localPath;
    }

    public String getPublishBranch() {
        return publishBranch;
    }

    public void setPublishBranch(String publishBranch) {
        this.publishBranch = publishBranch;
    }
}
