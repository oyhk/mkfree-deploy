package com.mkfree.deploy.dto;

import com.mkfree.deploy.domain.ProjectEnvConfig;
import com.mkfree.deploy.domain.ProjectStructureStep;

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
    // 构建前执行命令
    private List<ProjectStructureStep> structureBeforeList;
    // 构建后命令
    private List<ProjectStructureStep> structureAfterList;
    // 同步后命令
    private List<ProjectStructureStep> structureSyncList;

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

    public List<ProjectStructureStep> getStructureBeforeList() {
        return structureBeforeList;
    }

    public void setStructureBeforeList(List<ProjectStructureStep> structureBeforeList) {
        this.structureBeforeList = structureBeforeList;
    }

    public List<ProjectStructureStep> getStructureAfterList() {
        return structureAfterList;
    }

    public void setStructureAfterList(List<ProjectStructureStep> structureAfterList) {
        this.structureAfterList = structureAfterList;
    }

    public List<ProjectStructureStep> getStructureSyncList() {
        return structureSyncList;
    }

    public void setStructureSyncList(List<ProjectStructureStep> structureSyncList) {
        this.structureSyncList = structureSyncList;
    }
}
