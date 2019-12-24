package com.mkfree.deploy.controller;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mkfree.deploy.Routes;
import com.mkfree.deploy.common.*;
import com.mkfree.deploy.domain.Project;
import com.mkfree.deploy.domain.UserProjectPermission;
import com.mkfree.deploy.dto.ProjectDto;
import com.mkfree.deploy.dto.UserProjectPermissionProjectAssignDto;
import com.mkfree.deploy.repository.ProjectRepository;
import com.mkfree.deploy.repository.UserProjectPermissionRepository;
import com.mkfree.deploy.repository.UserRepository;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.exception.ExceptionUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

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
    public JsonResult projectPage(Integer pageNo, Integer pageSize, Long userId) {
        JsonResult jsonResult = new JsonResult();
        Page<Project> projectPage = projectRepository.findAll(this.getPageRequest(pageNo, pageSize, Sort.Direction.DESC, "name"));

        List<UserProjectPermission> userProjectPermissionList = userProjectPermissionRepository.findByUserId(userId);
        Map<Long, List<Long>> userProjectPermissionEnvIdMap = userProjectPermissionList.stream().map(userProjectPermission -> {
            UserProjectPermission userProjectPermissionTemp = new UserProjectPermission();
            String projectEnvIdListJson = userProjectPermission.getProjectEnvIdList();
            try {
                List<Long> envIdList = objectMapper.readValue(projectEnvIdListJson, new TypeReference<List<Long>>() {
                });
                userProjectPermissionTemp.setProjectEnvIdListTemp(envIdList);
            } catch (IOException e) {
                log.error(ExceptionUtils.getStackTrace(e));
            }
            userProjectPermissionTemp.setProjectId(userProjectPermission.getProjectId());
            return userProjectPermissionTemp;
        }).collect(Collectors.toMap(UserProjectPermission::getProjectId, UserProjectPermission::getProjectEnvIdListTemp));

        List<Project> projectList = projectPage.getContent();
        List<ProjectDto> projectDtoList = new ArrayList<>();
        projectList.forEach(project -> {
            ProjectDto projectDto = new ProjectDto();
            BeanUtils.copyProperties(project, projectDto);
            projectDto.setEnvIdList(userProjectPermissionEnvIdMap.get(project.getId()));
            projectDtoList.add(projectDto);
        });
        jsonResult.data = new PageResult<>(projectPage.getNumber(), projectPage.getSize(), projectPage.getTotalElements(), projectDtoList);
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


        Optional<Project> optionalProject = projectRepository.findById(projectId);
        optionalProject.orElseThrow(() -> new RemindException(Project.CLASS_NAME + Project.REMIND_RECORD_IS_NOT_EXIST));
        Project project = optionalProject.get();
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
