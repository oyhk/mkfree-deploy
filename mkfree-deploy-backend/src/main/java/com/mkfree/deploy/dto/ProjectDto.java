package com.mkfree.deploy.dto;

import com.mkfree.deploy.domain.enumclass.ProjectEnv;

import java.util.List;

/**
 *
 * Created by oyhk on 2017/2/6.
 *
 */
public class ProjectDto extends DtoEntity {

    //项目名称
    private String name;
    //git仓库地址
    private String gitUrl;
    //分支列表
    private String branchList;
    //发布分支名称，可以模糊匹配
    private String publishBranch;
    //远程机器项目路劲
    private String remotePath;
    //部署的项目模块名称
    private String moduleName;
    //部署的项目模块的目标文件或者目录
    private String deployTargetFile;
    // 项目的发布环境
    private ProjectEnv env;
    // 构建前执行命令
    private List<String> structureBeforeList;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getGitUrl() {
        return gitUrl;
    }

    public void setGitUrl(String gitUrl) {
        this.gitUrl = gitUrl;
    }

    public String getBranchList() {
        return branchList;
    }

    public void setBranchList(String branchList) {
        this.branchList = branchList;
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

    public ProjectEnv getEnv() {
        return env;
    }

    public void setEnv(ProjectEnv env) {
        this.env = env;
    }

    public List<String> getStructureBeforeList() {
        return structureBeforeList;
    }

    public void setStructureBeforeList(List<String> structureBeforeList) {
        this.structureBeforeList = structureBeforeList;
    }
}
