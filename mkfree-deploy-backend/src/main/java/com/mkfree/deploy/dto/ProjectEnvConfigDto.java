package com.mkfree.deploy.dto;

import com.mkfree.deploy.domain.IDEntity;
import com.mkfree.deploy.domain.ServerMachine;
import com.mkfree.deploy.domain.enumclass.ProjectEnv;

import java.util.List;

/**
 * Created by oyhk on 2017/2/7.
 *
 */
public class ProjectEnvConfigDto extends IDEntity {

    // 项目id
    private Long projectId;
    //环境类型
    private ProjectEnv env;
    //需要发布的服务机器id列表
    private List<Long> serverMachineIdList;
    //需要发布的服务机器ip列表
    private List<String> serverMachineIpList;
    //需要发布的服务机器列表
    private List<ServerMachineDto> serverMachineList;
    //发布分支名称
    private String publicBranch;
    // 构建前执行命令
    private List<String> structureBeforeList;
    // 构建后命令
    private List<String> structureAfterList;

    public ProjectEnv getEnv() {
        return env;
    }

    public String getEnvText() {
        if (this.env != null) {
            return this.env.getText();
        }
        return null;
    }

    public List<String> getServerMachineIpList() {
        return serverMachineIpList;
    }

    public void setServerMachineIpList(List<String> serverMachineIpList) {
        this.serverMachineIpList = serverMachineIpList;
    }

    public void setEnv(ProjectEnv env) {
        this.env = env;
    }

    public List<Long> getServerMachineIdList() {
        return serverMachineIdList;
    }

    public void setServerMachineIdList(List<Long> serverMachineIdList) {
        this.serverMachineIdList = serverMachineIdList;
    }

    public String getPublicBranch() {
        return publicBranch;
    }

    public void setPublicBranch(String publicBranch) {
        this.publicBranch = publicBranch;
    }

    public Long getProjectId() {
        return projectId;
    }

    public void setProjectId(Long projectId) {
        this.projectId = projectId;
    }

    public List<String> getStructureBeforeList() {
        return structureBeforeList;
    }

    public void setStructureBeforeList(List<String> structureBeforeList) {
        this.structureBeforeList = structureBeforeList;
    }

    public List<String> getStructureAfterList() {
        return structureAfterList;
    }

    public void setStructureAfterList(List<String> structureAfterList) {
        this.structureAfterList = structureAfterList;
    }

    public List<ServerMachineDto> getServerMachineList() {
        return serverMachineList;
    }

    public void setServerMachineList(List<ServerMachineDto> serverMachineList) {
        this.serverMachineList = serverMachineList;
    }
}
