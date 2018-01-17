package com.mkfree.deploy.helper;

import com.mkfree.deploy.domain.UserProjectPermission;

/**
 * Created by oyhk on 2017/1/23.
 */
public enum UserProjectPermissionHelper {

    SINGLEONE;


    /**
     *
     * @param projectEnvList
     * @param projectId
     * @param projectName
     * @param userId
     * @return
     */
    public UserProjectPermission create(String projectEnvList, Long projectId, String projectName, Long userId) {
        UserProjectPermission userProjectPermission = new UserProjectPermission();
        userProjectPermission.setProjectName(projectName);
        userProjectPermission.setUserId(userId);
        userProjectPermission.setProjectEnvIdList(projectEnvList);
        userProjectPermission.setProjectId(projectId);
        return userProjectPermission;
    }

}
