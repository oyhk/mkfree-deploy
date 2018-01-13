package com.mkfree.deploy.helper;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mkfree.deploy.domain.User;
import com.mkfree.deploy.domain.UserProjectPermission;
import com.mkfree.deploy.domain.enumclass.ProjectEnv;
import com.mkfree.deploy.dto.UserProjectPermissionDto;
import org.apache.commons.codec.digest.DigestUtils;
import org.slf4j.Logger;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.util.Date;
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

    /**
     * 转换dtoList
     * @param userProjectPermissionList
     * @param objectMapper
     * @param log
     * @return
     */
    public List<UserProjectPermissionDto> toDtoList(List<UserProjectPermission> userProjectPermissionList, ObjectMapper objectMapper, Logger log) {
        List<UserProjectPermissionDto> userProjectPermissionDtoList = userProjectPermissionList.stream().map(userProjectPermission -> {
            UserProjectPermissionDto userProjectPermissionDto = new UserProjectPermissionDto();
            userProjectPermissionDto.setId(userProjectPermission.getId());
            userProjectPermissionDto.setProjectName(userProjectPermission.getProjectName());
            userProjectPermissionDto.setProjectId(userProjectPermission.getProjectId());
            try {
                userProjectPermissionDto.setProjectEnv(objectMapper.readValue(userProjectPermission.getProjectEnvList(), new TypeReference<List<ProjectEnv>>() {
                }));
            } catch (IOException e) {
                log.info(e.getMessage());
            }
            return userProjectPermissionDto;
        }).collect(Collectors.toList());
        return userProjectPermissionDtoList;
    }
}
