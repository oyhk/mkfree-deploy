package com.mkfree.deploy.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mkfree.deploy.Routes;
import com.mkfree.deploy.common.BaseController;
import com.mkfree.deploy.common.JsonResult;
import com.mkfree.deploy.common.RestDoing;
import com.mkfree.deploy.domain.User;
import com.mkfree.deploy.domain.UserProjectPermission;
import com.mkfree.deploy.dto.UserProjectPermissionDto;
import com.mkfree.deploy.repository.UserProjectPermissionRepository;
import com.mkfree.deploy.repository.UserRepository;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

/**
 * Created by DK on 17/2/6.
 */
@RestController
public class UserPermissionController extends BaseController{
    private final Logger log = LoggerFactory.getLogger(UserPermissionController.class);

    @Autowired
    private UserProjectPermissionRepository userProjectPermissionRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @RequestMapping(value = Routes.USER_PROJECT_PERMISSION_SAVE, method = RequestMethod.POST)
    public JsonResult save(@RequestBody List<UserProjectPermissionDto> userPermissionDtoList, HttpServletRequest request) {
        RestDoing doing =jsonResult -> {
            for (UserProjectPermissionDto dto : userPermissionDtoList) {
                if (dto.getProjectId() == null) {
                    jsonResult.remind("项目ID 不能为空");
                    return;
                }

                if (dto.getUserId() == null) {
                    jsonResult.remind("用户ID 不能为空");
                    return;
                }

                if (dto.getProjectEnv() == null || dto.getProjectEnv().size() == 0) {
                    jsonResult.remind("项目允许发布环境 不能为空");
                    return;
                }

                if (StringUtils.isBlank(dto.getProjectName())) {
                    jsonResult.remind("项目名称 不能为空");
                    return;
                }

                UserProjectPermission permission = new UserProjectPermission();
                permission.setProjectId(dto.getProjectId());
                permission.setUserId(dto.getUserId());
                permission.setProjectEnvList(objectMapper.writeValueAsString(dto.getProjectEnv()));
                permission.setProjectName(dto.getProjectName());
                userProjectPermissionRepository.save(permission);
            }

        };
        return doing.go(request, log);
    }

    @RequestMapping(value = Routes.USER_PROJECT_PERMISSION_DELETE, method = RequestMethod.PUT)
    public JsonResult delete(@RequestBody UserProjectPermissionDto dto, HttpServletRequest request) {
        RestDoing doing =jsonResult -> {
            if (dto.getId() == null) {
                jsonResult.remind(UserProjectPermission.CHECK_ID_IS_NOT_NULL);
                return;
            }
            UserProjectPermission permission = userProjectPermissionRepository.findOne(dto.getId());
            if (permission == null) {
                jsonResult.remind(UserProjectPermission.REMIND_RECORD_IS_NOT_EXIST);
                return;
            }
            userProjectPermissionRepository.delete(dto.getId());
        };
        return doing.go(request, log);
    }

    @RequestMapping(value = Routes.USER_PROJECT_PERMISSION_UPDATE, method = RequestMethod.PUT)
    public JsonResult update(@RequestBody List<UserProjectPermissionDto> userPermissionDtoList, HttpServletRequest request) {
        RestDoing doing =jsonResult -> {
            for (UserProjectPermissionDto dto : userPermissionDtoList) {
                if (dto.getId() == null) {
                    jsonResult.remind(UserProjectPermission.CHECK_ID_IS_NOT_NULL);
                    return;
                }
                UserProjectPermission permission = userProjectPermissionRepository.findOne(dto.getId());
                if (permission == null) {
                    jsonResult.remind(UserProjectPermission.REMIND_RECORD_IS_NOT_EXIST);
                    return;
                }
                if (dto.getProjectId() != null) {
                    permission.setProjectId(dto.getProjectId());
                }

                if (dto.getUserId() != null) {
                    permission.setUserId(dto.getUserId());
                }
                if (dto.getProjectEnv() != null && dto.getProjectEnv().size() > 0) {
                    permission.setProjectEnvList(objectMapper.writeValueAsString(dto.getProjectEnv()));
                }
                if (StringUtils.isNotBlank(dto.getProjectName())) {
                    permission.setProjectName(dto.getProjectName());
                }
                userProjectPermissionRepository.save(permission);
            }
        };
        return doing.go(request, log);
    }

    @RequestMapping(value = Routes.USER_PROJECT_PERMISSION_LIST, method = RequestMethod.GET)
    public JsonResult projectList(Long userId, HttpServletRequest request) {
        RestDoing doing =jsonResult -> {
            if (userId == null) {
                jsonResult.remind("用户ID 不能为空");
                return;
            }
            User user = userRepository.findOne(userId);
            if (user == null) {
                jsonResult.remind("用户不存在");
                return;
            }
            List<UserProjectPermission> userProjectPermissionList = userProjectPermissionRepository.findByUserId(userId);
            jsonResult.data = userProjectPermissionList;
        };
        return doing.go(request, log);
    }
}
