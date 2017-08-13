package com.mkfree.deploy.dto;

import com.mkfree.deploy.domain.ProjectBuildStep;
import com.mkfree.deploy.domain.ProjectEnvConfig;

import java.util.List;

/**
 * Created by oyhk on 2017/2/7.
 *
 */
public class ProjectEnvConfigDto extends ProjectEnvConfig {

    //需要发布的服务机器id列表
    private List<Long> serverMachineIdList;
    //需要发布的服务机器ip列表
    private List<String> serverMachineIpList;
    // 构建前命令
    private List<ProjectBuildStep> buildBeforeList;
    // 构建后命令
    private List<ProjectBuildStep> buildAfterList;
    // 同步后命令
    private List<ProjectBuildStep> buildSyncList;

    public List<String> getServerMachineIpList() {
        return serverMachineIpList;
    }

    public void setServerMachineIpList(List<String> serverMachineIpList) {
        this.serverMachineIpList = serverMachineIpList;
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

    public List<ProjectBuildStep> getBuildSyncList() {
        return buildSyncList;
    }

    public void setBuildSyncList(List<ProjectBuildStep> buildSyncList) {
        this.buildSyncList = buildSyncList;
    }
}
