package com.mkfree.deploy.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mkfree.deploy.Routes;
import com.mkfree.deploy.common.*;
import com.mkfree.deploy.domain.Project;
import com.mkfree.deploy.domain.UserProjectPermission;
import com.mkfree.deploy.dto.UserProjectPermissionProjectAssignDto;
import com.mkfree.deploy.repository.ProjectRepository;
import com.mkfree.deploy.repository.UserProjectPermissionRepository;
import com.mkfree.deploy.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

/**
 * Created by DK on 17/2/6.
 */
@RestController
public class UserPermissionController extends BaseController {
    private final Logger log = LoggerFactory.getLogger(UserPermissionController.class);

    @Autowired
    private UserProjectPermissionRepository userProjectPermissionRepository;

    @Autowired
    private ProjectRepository projectRepository;
    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    /**
     * 项目分页
     * @param pageNo
     * @param pageSize
     * @return
     */
    @GetMapping(Routes.USER_PROJECT_PERMISSION_PROJECT_PAGE)
    public JsonResult projectPage(Integer pageNo, Integer pageSize) {
        JsonResult jsonResult = new JsonResult();
        Page<Project> projectPage = projectRepository.findAll(this.getPageRequest(pageNo, pageSize));
        jsonResult.data = new PageResult<>(projectPage, Routes.USER_PROJECT_PERMISSION_PROJECT_PAGE);
        return jsonResult;
    }

    @PostMapping(Routes.USER_PROJECT_PERMISSION_PROJECT_ASSIGN)
    public JsonResult projectAssign(@RequestBody UserProjectPermissionProjectAssignDto userProjectPermissionProjectAssignDto) throws IOException {
        JsonResult jsonResult = new JsonResult();

        Long projectId = userProjectPermissionProjectAssignDto.getProjectId();
        Long userId = userProjectPermissionProjectAssignDto.getUserId();
        List<Long> envIdList = userProjectPermissionProjectAssignDto.getEnvIdList();

        CheckHelper.checkNotNull(projectId, "projectId is not null");
        CheckHelper.checkNotNull(envIdList, "envIdList is not null");
        CheckHelper.checkNotNull(userId, "userId is not null");


        Project project = projectRepository.findOne(projectId);

        UserProjectPermission userProjectPermission = userProjectPermissionRepository.findByProjectIdAndUserId(projectId, userId);
        if (userProjectPermission == null) {
            userProjectPermission = new UserProjectPermission();
            userProjectPermission.setProjectId(projectId);
            userProjectPermission.setUserId(userId);
        }
        userProjectPermission.setProjectName(project.getName());
        userProjectPermission.setProjectEnvIdList(objectMapper.writeValueAsString(envIdList));
        userProjectPermissionRepository.save(userProjectPermission);
        return jsonResult;
    }

}
