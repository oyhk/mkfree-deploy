package com.mkfree.deploy.helper;

import com.mkfree.deploy.domain.User;
import com.mkfree.deploy.domain.UserProjectPermission;
import org.apache.commons.codec.digest.DigestUtils;

import javax.servlet.http.HttpServletRequest;
import java.util.Date;

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
    public UserProjectPermission create(String projectEnvList,Long projectId,String projectName,Long userId){
        UserProjectPermission userProjectPermission = new UserProjectPermission();
        userProjectPermission.setProjectName(projectName);
        userProjectPermission.setUserId(userId);
        userProjectPermission.setProjectEnvList(projectEnvList);
        userProjectPermission.setProjectId(projectId);
        return userProjectPermission;
    }
}
