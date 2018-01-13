package com.mkfree.deploy.dto;

import com.mkfree.deploy.domain.UserProjectPermission;
import com.mkfree.deploy.domain.enumclass.OptionType;
import com.mkfree.deploy.domain.enumclass.ProjectEnv;

import java.util.List;

/**
 * Created by DK on 17/2/6.
 */
public class UserProjectPermissionDto extends UserProjectPermission {

    //用户id
    private Long userId;

    //项目id
    private Long projectId;

    //项目允许发布环境列表
    private List<ProjectEnv> projectEnv;
    // 项目 可操作权限
    private List<OptionType> optionTypeList;

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


    public String getProjectName() {
        return projectName;
    }

    public void setProjectName(String projectName) {
        this.projectName = projectName;
    }

    public List<ProjectEnv> getProjectEnv() {
        return projectEnv;
    }

    public void setProjectEnv(List<ProjectEnv> projectEnv) {
        this.projectEnv = projectEnv;
    }

    public List<OptionType> getOptionTypeList() {
        return optionTypeList;
    }

    public void setOptionTypeList(List<OptionType> optionTypeList) {
        this.optionTypeList = optionTypeList;
    }
}
