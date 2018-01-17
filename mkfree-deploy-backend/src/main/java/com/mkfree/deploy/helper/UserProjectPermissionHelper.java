package com.mkfree.deploy.helper;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mkfree.deploy.domain.UserProjectPermission;
import com.mkfree.deploy.dto.UserProjectPermissionDto;
import org.slf4j.Logger;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

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
        userProjectPermission.setProjectEnvList(projectEnvList);
        userProjectPermission.setProjectId(projectId);
        return userProjectPermission;
    }

}
