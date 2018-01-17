package com.mkfree.deploy.dto;

import java.util.List;

/**
 * Created by oyhk on 2018/1/17.
 */
public class UserProjectPermissionProjectAssignDto {
    private Long userId;
    private Long projectId;
    private List<Long> envIdList;


    public List<Long> getEnvIdList() {
        return envIdList;
    }

    public void setEnvIdList(List<Long> envIdList) {
        this.envIdList = envIdList;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getProjectId() {
        return projectId;
    }

    public void setProjectId(Long projectId) {
        this.projectId = projectId;
    }

}
