package com.mkfree.deploy.dto;

import com.mkfree.deploy.domain.IDEntity;
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
    //需要发布的服务机器列表
    private List<Long> serverMachineIdList;
    //发布分支名称
    private String publicBranch;

    public ProjectEnv getEnv() {
        return env;
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
}
