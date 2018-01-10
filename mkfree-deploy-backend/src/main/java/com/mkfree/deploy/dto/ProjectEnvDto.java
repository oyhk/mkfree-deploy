package com.mkfree.deploy.dto;

import com.mkfree.deploy.domain.ProjectEnvIp;

import java.util.List;

/**
 * Created by oyhk on 2018/1/9.
 */
public class ProjectEnvDto {
    private String env;
    private String name;
    private List<ProjectEnvIp> projectEnvIpList;

    public List<ProjectEnvIp> getProjectEnvIpList() {
        return projectEnvIpList;
    }

    public void setProjectEnvIpList(List<ProjectEnvIp> projectEnvIpList) {
        this.projectEnvIpList = projectEnvIpList;
    }

    public String getEnv() {
        return env;
    }

    public void setEnv(String env) {
        this.env = env;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
