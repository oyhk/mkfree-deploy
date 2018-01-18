package com.mkfree.deploy.domain;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Transient;
import java.util.List;

/**
 * Created by oyhk on 2017/1/23.
 * 用户项目权限
 */
@Entity
public class UserProjectPermission extends IDEntity {

    //用户id
    @Column(columnDefinition = "bigint comment '用户id'")
    private Long userId;
    //项目id
    @Column(columnDefinition = "bigint comment '项目id'")
    private Long projectId;
    //项目允许发布环境列表
    @Column(columnDefinition = "varchar(255) comment '项目允许发布环境列表'")
    private String projectEnvIdList;
    //项目名称
    @Column(columnDefinition = "varchar(255) comment '项目名称'")
    private String projectName;
    @Transient
    private List<Long> projectEnvIdListTemp;

    public List<Long> getProjectEnvIdListTemp() {
        return projectEnvIdListTemp;
    }

    public void setProjectEnvIdListTemp(List<Long> projectEnvIdListTemp) {
        this.projectEnvIdListTemp = projectEnvIdListTemp;
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

    public String getProjectEnvIdList() {
        return projectEnvIdList;
    }

    public void setProjectEnvIdList(String projectEnvIdList) {
        this.projectEnvIdList = projectEnvIdList;
    }

    public String getProjectName() {
        return projectName;
    }

    public void setProjectName(String projectName) {
        this.projectName = projectName;
    }
}
