package com.mkfree.deploy.domain;

import com.mkfree.deploy.domain.enumclass.ProjectEnv;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Transient;
import java.util.List;

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
    @Column(columnDefinition = "varchar (255) comment '发布分支名称，可以模糊匹配'")
    private String publishBranch;
    @Column(columnDefinition = "varchar (255) comment '远程机器项目路劲'")
    private String remotePath;
    @Column(columnDefinition = "varchar (255) comment '部署的项目模块名称'")
    private String moduleName;
    @Column(columnDefinition = "varchar (255) comment '部署的项目模块的目标文件或者目录'")
    private String deployTargetFile;

    /*******下面是 Transient 字段 start ********/
    // 项目的发布环境
    @Transient
    private ProjectEnv env;
    // 构建前执行命令
    @Transient
    private List<String> structureBeforeList;

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

    public String getPublishBranch() {
        return publishBranch;
    }

    public void setPublishBranch(String publishBranch) {
        this.publishBranch = publishBranch;
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

    public String getDeployTargetFile() {
        return deployTargetFile;
    }

    public void setDeployTargetFile(String deployTargetFile) {
        this.deployTargetFile = deployTargetFile;
    }

    public List<String> getStructureBeforeList() {
        return structureBeforeList;
    }

    public void setStructureBeforeList(List<String> structureBeforeList) {
        this.structureBeforeList = structureBeforeList;
    }
}
