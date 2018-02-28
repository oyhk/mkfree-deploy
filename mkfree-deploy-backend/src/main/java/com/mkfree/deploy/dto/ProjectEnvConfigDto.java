package com.mkfree.deploy.dto;

import com.mkfree.deploy.domain.ProjectBuildStep;
import com.mkfree.deploy.domain.ProjectEnvConfig;
import com.mkfree.deploy.domain.ProjectEnvIp;

import java.util.List;
import java.util.Map;

/**
 * Created by oyhk on 2017/2/7.
 *
 */
public class ProjectEnvConfigDto extends ProjectEnvConfig {


    //需要发布的服务机器id列表
    private List<Long> serverMachineIdList;
    //需要发布的服务机器ip列表
    private List<ProjectEnvIp> projectEnvIpList;
    // 环境ip map
    private Map<String,ProjectEnvIp> projectEnvIpMap;
    // 构建前命令
    private List<ProjectBuildStep> buildBeforeList;
    // 构建后命令
    private List<ProjectBuildStep> buildAfterList;
    // 同步后命令
    private List<ProjectBuildStep> syncAfterList;

    public Map<String, ProjectEnvIp> getProjectEnvIpMap() {
        return projectEnvIpMap;
    }

    public void setProjectEnvIpMap(Map<String, ProjectEnvIp> projectEnvIpMap) {
        this.projectEnvIpMap = projectEnvIpMap;
    }

    public List<ProjectEnvIp> getProjectEnvIpList() {
        return projectEnvIpList;
    }

    public void setProjectEnvIpList(List<ProjectEnvIp> projectEnvIpList) {
        this.projectEnvIpList = projectEnvIpList;
    }

    public List<Long> getServerMachineIdList() {
        return serverMachineIdList;
    }

    public void setServerMachineIdList(List<Long> serverMachineIdList) {
        this.serverMachineIdList = serverMachineIdList;
    }

    public List<ProjectBuildStep> getBuildBeforeList() {
        return buildBeforeList;
    }

    public void setBuildBeforeList(List<ProjectBuildStep> buildBeforeList) {
        this.buildBeforeList = buildBeforeList;
    }

    public List<ProjectBuildStep> getBuildAfterList() {
        return buildAfterList;
    }

    public void setBuildAfterList(List<ProjectBuildStep> buildAfterList) {
        this.buildAfterList = buildAfterList;
    }

    public List<ProjectBuildStep> getSyncAfterList() {
        return syncAfterList;
    }

    public void setSyncAfterList(List<ProjectBuildStep> syncAfterList) {
        this.syncAfterList = syncAfterList;
    }
}
