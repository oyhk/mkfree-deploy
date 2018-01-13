package com.mkfree.deploy.dto;

import com.mkfree.deploy.domain.User;
import com.mkfree.deploy.domain.enumclass.ProjectEnv;
import com.mkfree.deploy.domain.enumclass.RoleType;

import javax.persistence.Column;
import java.util.List;

/**
 *
 * Created by oyhk on 2017/2/6.
 *
 */
public class UserDto extends User {

    // 用户项目权限列表
    private List<UserProjectPermissionDto> userProjectPermissionList;

    public List<UserProjectPermissionDto> getUserProjectPermissionList() {
        return userProjectPermissionList;
    }

    public void setUserProjectPermissionList(List<UserProjectPermissionDto> userProjectPermissionList) {
        this.userProjectPermissionList = userProjectPermissionList;
    }


}
