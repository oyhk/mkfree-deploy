package com.mkfree.deploy.domain;

import javax.persistence.Column;
import javax.persistence.Entity;

/**
 * Created by oyhk on 2017/1/23.
 * 用户权限
 */
@Entity
public class UserProjectPermission extends IDEntity {

    //用户id
    @Column(columnDefinition = "bigint")
    private Long userId;
    //项目id
    @Column(columnDefinition = "bigint")
    private Long projectId;
    //项目允许发布环境列表
    @Column(columnDefinition = "varchar(255)")
    private String projectEnvList;
    //项目名称
    @Column(columnDefinition = "varchar(255)")
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

    public String getProjectEnvList() {
        return projectEnvList;
    }

    public void setProjectEnvList(String projectEnvList) {
        this.projectEnvList = projectEnvList;
    }

    public String getProjectName() {
        return projectName;
    }

    public void setProjectName(String projectName) {
        this.projectName = projectName;
    }
}
