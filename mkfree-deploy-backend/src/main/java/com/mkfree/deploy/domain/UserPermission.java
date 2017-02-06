package com.mkfree.deploy.domain;

import com.mkfree.deploy.domain.enumclass.UserPermissionType;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;

/**
 * Created by oyhk on 2017/1/23.
 * 用户权限
 */
@Entity
public class UserPermission extends IDEntity {

    @Column(columnDefinition = "bigint comment '用户id'")
    private Long userId;
    @Column(columnDefinition = "bigint comment '项目id'")
    private Long projectId;
    @Column(columnDefinition = "varchar(255) comment '项目允许发布环境列表'")
    private String projectEnv;
    @Column(columnDefinition = "bigint comment '角色id'")
    private Long roleId;
    @Enumerated(value = EnumType.STRING)
    @Column(columnDefinition = "varchar(20) comment '权限类型'")
    private UserPermissionType type;

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

    public Long getRoleId() {
        return roleId;
    }

    public void setRoleId(Long roleId) {
        this.roleId = roleId;
    }

    public UserPermissionType getType() {
        return type;
    }

    public void setType(UserPermissionType type) {
        this.type = type;
    }

    public String getProjectEnv() {
        return projectEnv;
    }

    public void setProjectEnv(String projectEnv) {
        this.projectEnv = projectEnv;
    }
}
