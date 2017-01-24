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
    @Column(columnDefinition = "varchar (255) comment '仓库地址'")
    private String repositoryUrl;
    @Column(columnDefinition = "text comment '分支列表'")
    private String branchList;

    /*******下面是 Transient 字段 start ********/
    // 项目的发布环境
    @Transient
    private ProjectEnv env;

    /*******下面是 Transient 字段 end ********/

    public String getRepositoryUrl() {
        return repositoryUrl;
    }

    public void setRepositoryUrl(String repositoryUrl) {
        this.repositoryUrl = repositoryUrl;
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
}
