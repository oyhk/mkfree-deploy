package com.mkfree.deploy.dto;

import com.mkfree.deploy.domain.enumclass.ProjectEnv;
import com.mkfree.deploy.domain.enumclass.RoleType;

import javax.persistence.Column;
import java.util.List;

/**
 *
 * Created by oyhk on 2017/2/6.
 *
 */
public class UserDto extends DtoEntity {


    //用户名
    private String username;
    //密码
    private String password;
    //密码盐
    private String passwordSalt;
    //登录后的userToken
    private String userToken;
    // 角色类型
    private RoleType roleType;
    // 用户项目权限列表
    private List<UserProjectPermissionDto> userProjectPermissionList;

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getPasswordSalt() {
        return passwordSalt;
    }

    public void setPasswordSalt(String passwordSalt) {
        this.passwordSalt = passwordSalt;
    }

    public String getUserToken() {
        return userToken;
    }

    public void setUserToken(String userToken) {
        this.userToken = userToken;
    }

    public List<UserProjectPermissionDto> getUserProjectPermissionList() {
        return userProjectPermissionList;
    }

    public void setUserProjectPermissionList(List<UserProjectPermissionDto> userProjectPermissionList) {
        this.userProjectPermissionList = userProjectPermissionList;
    }

    public RoleType getRoleType() {
        return roleType;
    }

    public void setRoleType(RoleType roleType) {
        this.roleType = roleType;
    }
}
