package com.mkfree.deploy.dto;

import com.mkfree.deploy.domain.ProjectEnv;
import com.mkfree.deploy.domain.ProjectEnvIp;

import java.util.List;

/**
 * Created by oyhk on 2018/1/9.
 */
public class ProjectEnvDto extends ProjectEnv {
    private List<ProjectEnvIp> projectEnvIpList;

    public List<ProjectEnvIp> getProjectEnvIpList() {
        return projectEnvIpList;
    }

    public void setProjectEnvIpList(List<ProjectEnvIp> projectEnvIpList) {
        this.projectEnvIpList = projectEnvIpList;
    }

}
