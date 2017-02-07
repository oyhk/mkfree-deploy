package com.mkfree.deploy.dto;

import java.util.List;

/**
 * Created by DK on 17/2/6.
 */
public class UserProjectPermissionDto extends DtoEntity{

    //用户id
    private Long userId;

    //项目id
    private Long projectId;

    //项目允许发布环境列表
    private List<String> projectEnv;

    //项目名称
    private String projectName;

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

    public List<String> getProjectEnv() {
        return projectEnv;
    }

    public void setProjectEnv(List<String> projectEnv) {
        this.projectEnv = projectEnv;
    }

    public String getProjectName() {
        return projectName;
    }

    public void setProjectName(String projectName) {
        this.projectName = projectName;
    }
}
