package com.mkfree.deploy.dto;

import com.mkfree.deploy.domain.Project;
import com.mkfree.deploy.domain.ProjectBuildLog;
import com.mkfree.deploy.domain.enumclass.ProjectEnv;

import java.util.Date;
import java.util.List;
import java.util.Map;

/**
 *
 * Created by oyhk on 2017/2/6.
 *
 */
public class ProjectDto extends Project {


    private Map<String, List<ProjectBuildLog>> buildLog;

    private String moduleName;
    //部署的项目模块的目标文件或者目录
    private List<ProjectDeployFileDto> deployTargetFileList;
    // 项目的发布环境
    private ProjectEnv env;
    // 各种环境配置
    private List<ProjectEnvConfigDto> projectEnvConfigList;

    // 发布机器ip列表
    private List<String> serverMachineIpList;
    // 发布机器ip
    private String serverMachineIp;
    // 发布分支
    private String publishBranch;
    // 最后发布时间
    private Date lastPublishDate;

    public String getPublishBranch() {
        return publishBranch;
    }

    public void setPublishBranch(String publishBranch) {
        this.publishBranch = publishBranch;
    }

    public List<String> getServerMachineIpList() {
        return serverMachineIpList;
    }

    public void setServerMachineIpList(List<String> serverMachineIpList) {
        this.serverMachineIpList = serverMachineIpList;
    }

    public String getServerMachineIp() {
        return serverMachineIp;
    }

    public void setServerMachineIp(String serverMachineIp) {
        this.serverMachineIp = serverMachineIp;
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

    public Map<String, List<ProjectBuildLog>> getBuildLog() {
        return buildLog;
    }

    public void setBuildLog(Map<String, List<ProjectBuildLog>> buildLog) {
        this.buildLog = buildLog;
    }
}
