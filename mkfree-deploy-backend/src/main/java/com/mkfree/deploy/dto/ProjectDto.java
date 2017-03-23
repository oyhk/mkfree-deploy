package com.mkfree.deploy.dto;

import com.mkfree.deploy.domain.enumclass.ProjectEnv;

import java.util.Date;
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
    //远程机器项目路劲
    private String remotePath;
    //部署的项目模块名称
    private String moduleName;
    //部署的项目模块的目标文件或者目录
    private List<ProjectDeployFileDto> deployTargetFileList;
    // 项目的发布环境
    private ProjectEnv env;
    // 各种环境配置
    private List<ProjectEnvConfigDto> projectEnvConfigList;

    // 发布机器id列表
    private List<Long> serverMachineIdList;

    // 最后发布时间
    private Date lastPublishDate;

    public List<Long> getServerMachineIdList() {
        return serverMachineIdList;
    }

    public void setServerMachineIdList(List<Long> serverMachineIdList) {
        this.serverMachineIdList = serverMachineIdList;
    }

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

    public ProjectEnv getEnv() {
        return env;
    }

    public void setEnv(ProjectEnv env) {
        this.env = env;
    }


    public List<ProjectEnvConfigDto> getProjectEnvConfigList() {
        return projectEnvConfigList;
    }

    public void setProjectEnvConfigList(List<ProjectEnvConfigDto> projectEnvConfigList) {
        this.projectEnvConfigList = projectEnvConfigList;
    }

    public List<ProjectDeployFileDto> getDeployTargetFileList() {
        return deployTargetFileList;
    }

    public void setDeployTargetFileList(List<ProjectDeployFileDto> deployTargetFileList) {
        this.deployTargetFileList = deployTargetFileList;
    }

    public Date getLastPublishDate() {
        return lastPublishDate;
    }

    public void setLastPublishDate(Date lastPublishDate) {
        this.lastPublishDate = lastPublishDate;
    }
}
