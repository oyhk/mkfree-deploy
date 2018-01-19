package com.mkfree.deploy.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mkfree.deploy.Config;
import com.mkfree.deploy.Routes;
import com.mkfree.deploy.common.*;
import com.mkfree.deploy.domain.*;
import com.mkfree.deploy.domain.ProjectEnv;
import com.mkfree.deploy.domain.enumclass.*;
import com.mkfree.deploy.dto.*;
import com.mkfree.deploy.helper.*;
import com.mkfree.deploy.repository.*;
import org.apache.commons.io.FileUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.exception.ExceptionUtils;
import org.apache.commons.lang3.text.StrSubstitutor;
import org.apache.commons.lang3.time.DateFormatUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.io.File;
import java.io.IOException;
import java.util.*;
import java.util.concurrent.ExecutorService;
import java.util.stream.Collectors;

/**
 *
 * Created by oyhk on 2017/1/23.
 *
 */
@RestController
public class ProjectController extends BaseController {

    private final Logger log = LoggerFactory.getLogger(ProjectController.class);

    @Autowired
    private ProjectRepository projectRepository;
    @Autowired
    private ServerMachineRepository serverMachineRepository;
    @Autowired
    private ProjectBuildStepRepository projectBuildStepRepository;
    @Autowired
    private ProjectEnvConfigRepository projectEnvConfigRepository;
    @Autowired
    private SystemConfigRepository systemConfigRepository;
    @Autowired
    private ObjectMapper objectMapper;
    @Autowired
    private ProjectBuildLogRepository projectBuildLogRepository;
    @Autowired
    private ProjectDeployFileRepository projectDeployFileRepository;
    @Autowired
    private UserProjectPermissionRepository userProjectPermissionRepository;
    @Autowired
    private ExecutorService commonExecutorService;
    @Autowired
    private ProjectEnvIpRepository projectEnvIpRepository;
    @Autowired
    private EnvRepository envRepository;

    @GetMapping(value = Routes.PROJECT_INIT_GIT)
    public JsonResult initGit(ProjectDto dto) {
        JsonResult jsonResult = new JsonResult();
        try {
            Project project = projectRepository.findOne(dto.getId());

            // 1. 清空文件夹所有文件
            String projectPath = project.getSystemPath();
            File projectFile = new File(projectPath);
            if (projectFile.exists()) {
                FileUtils.cleanDirectory(new File(projectPath));
            } else {
                projectFile.mkdirs();
            }

            // 2. 重新拉取代码
            String gitUrl = project.getGitUrl();
            Shell shell = new Shell();
            shell.appendN("echo 'cd #{projectPath}'");
            shell.appendN("cd #{projectPath}");
            shell.addParams("projectPath", projectPath);

            shell.appendN("echo 'git clone #{gitUrl} DEFAULT'");
            shell.appendN("git clone #{gitUrl} DEFAULT");
            shell.addParams("gitUrl", gitUrl);

            ShellHelper.SINGLEONE.executeShellCommand(shell.getShell(), log);
            // 2.1 复制到各种环境
            File defaultProject = new File(projectPath + "/DEFAULT");

            List<ProjectEnv> projectEnvList = envRepository.findByEnable(true);
            for (ProjectEnv projectEnv : projectEnvList) {
                File file = new File(projectPath +"/"+ projectEnv.getCode());
                FileUtils.copyDirectory(defaultProject, file);
            }

        } catch (Exception e) {
            log.error(ExceptionUtils.getStackTrace(e));
        }
        return jsonResult;
    }

    @RequestMapping(value = Routes.PROJECT_ENV_CONFIG_LIST, method = RequestMethod.GET)
    public JsonResult envConfigList(HttpServletRequest request) {
        RestDoing doing = jsonResult -> {
            List<ProjectEnv> projectEnvList = envRepository.findAll();
            List<ProjectEnvConfigDto> projectEnvConfigDtoList = new ArrayList<>();
            projectEnvList.forEach(env -> {
                ProjectEnvConfigDto projectEnvConfigDto = new ProjectEnvConfigDto();
                projectEnvConfigDto.setEnvId(env.getId());
                projectEnvConfigDto.setEnvName(env.getName());
                // 项目配置环境构建前步骤
                projectEnvConfigDto.setBuildBeforeList(Collections.singletonList(new ProjectBuildStep()));
                // 项目配置环境构建后步骤
                projectEnvConfigDto.setBuildAfterList(Collections.singletonList(new ProjectBuildStep()));
                projectEnvConfigDtoList.add(projectEnvConfigDto);
            });

            jsonResult.data = projectEnvConfigDtoList;
        };
        return doing.go(request, log);
    }

    @GetMapping(value = Routes.PROJECT_PAGE)
    public JsonResult page(Integer pageNo, Integer pageSize, String projectTagId, HttpServletRequest request) {
        UserDto userDto = UserHelper.SINGLEONE.getSession(request);

        JsonResult jsonResult = new JsonResult();

        Page<Project> page;
        if (StringUtils.isBlank(projectTagId) || projectTagId.equals("ALL")) {
            page = projectRepository.findAll(this.getPageRequest(pageNo, pageSize, Sort.Direction.DESC, "name"));
        } else {
            page = projectRepository.findByProjectTagId(this.getPageRequest(pageNo, pageSize, Sort.Direction.DESC, "name"), Long.valueOf(projectTagId));
        }

        List<Project> projectList = page.getContent();

        List<Long> projectIdList = projectList.stream().map(Project::getId).collect(Collectors.toList());

        List<ProjectEnvConfig> projectEnvConfigList = projectEnvConfigRepository.findByProjectIdIn(projectIdList);

        Map<Long, List<ProjectEnvConfig>> projectEnvConfigMap = projectEnvConfigList.stream().collect(Collectors.groupingBy(ProjectEnvConfig::getProjectId));

        List<ProjectEnvIp> projectEnvIpList = projectEnvIpRepository.findByProjectIdIn(projectIdList);
        Map<String, List<ProjectEnvIp>> projectEnvIpMap = projectEnvIpList.stream().collect(Collectors.groupingBy(o -> o.getProjectId() + "_" + o.getEnvId()));


        Map<Long, List<Long>> userProjectPermissionProjectEnvIdMap = null;
        if (userDto.getRoleType() == RoleType.COMMON) {
            // 登录用户 项目环境权限
            List<UserProjectPermission> userProjectPermissionList = userProjectPermissionRepository.findByUserId(userDto.getId());
            // 用户对应每个项目的环境部署权限
            userProjectPermissionProjectEnvIdMap = userProjectPermissionList.stream().map(userProjectPermission -> {
                UserProjectPermission userProjectPermission1 = new UserProjectPermission();
                userProjectPermission1.setProjectId(userProjectPermission.getProjectId());
                userProjectPermission1.setUserId(userProjectPermission.getUserId());
                try {
                    userProjectPermission1.setProjectEnvIdListTemp(objectMapper.readValue(userProjectPermission.getProjectEnvIdList(), new TypeReference<List<Long>>() {
                    }));
                } catch (IOException e) {
                    log.error(ExceptionUtils.getStackTrace(e));
                }
                return userProjectPermission1;
            }).collect(Collectors.toMap(UserProjectPermission::getProjectId, UserProjectPermission::getProjectEnvIdListTemp));
        }

        Map<Long, List<Long>> finalUserProjectPermissionProjectEnvIdMap = userProjectPermissionProjectEnvIdMap;
        List<ProjectDto> projectDtoList = projectList.stream().map(project -> {
            ProjectDto projectDto = new ProjectDto();

            Long projectId = project.getId();
            List<ProjectEnvConfig> envConfigList = projectEnvConfigMap.get(projectId);


            List<ProjectEnvDto> projectEnvList = new ArrayList<>();
            // 普通用户对应每个项目的环境部署权限
            if (finalUserProjectPermissionProjectEnvIdMap != null) {
                List<Long> userProjectPermissionProjectEnvIdList = finalUserProjectPermissionProjectEnvIdMap.get(projectId);
                if (userProjectPermissionProjectEnvIdList != null) {
                    envConfigList = envConfigList.stream().filter(projectEnvConfig -> projectEnvConfig.getEnvId() != null).filter(projectEnvConfig -> userProjectPermissionProjectEnvIdList.contains(projectEnvConfig.getEnvId())).collect(Collectors.toList());
                }else{
                    envConfigList = new ArrayList<>();
                }
            }
            // 超级管理员 || 管理员
            else {
                envConfigList = envConfigList.stream().filter(projectEnvConfig -> projectEnvConfig.getEnvId() != null).collect(Collectors.toList());
            }

            envConfigList.stream().sorted(Comparator.comparing(ProjectEnvConfig::getEnvSort)).forEach(projectEnvConfig -> {
                ProjectEnvDto projectEnvDto = new ProjectEnvDto();
                projectEnvDto.setId(projectEnvConfig.getEnvId());
                projectEnvDto.setName(projectEnvConfig.getEnvName());
                List<ProjectEnvIp> envProjectEnvIpList = projectEnvIpMap.get(projectEnvConfig.getProjectId() + "_" + projectEnvConfig.getEnvId());
                if (envProjectEnvIpList != null) {
                    // 排序 publish true 排前面
                    projectEnvDto.setProjectEnvIpList(envProjectEnvIpList.stream().sorted(Comparator.comparing(ProjectEnvIp::getPublish).reversed()).collect(Collectors.toList()));
                }
                if (!projectEnvList.contains(projectEnvDto)) {
                    projectEnvList.add(projectEnvDto);
                }
            });

            projectDto.setProjectEnvList(projectEnvList);
            BeanUtils.copyProperties(project, projectDto);
            return projectDto;
        }).collect(Collectors.toList());


        jsonResult.data = new PageResult<>(page.getNumber(), page.getSize(), page.getTotalElements(), projectDtoList, Routes.PROJECT_PAGE);


        return jsonResult;
    }

    @RequestMapping(value = Routes.PROJECT_SAVE, method = RequestMethod.POST)
    @Transactional
    public JsonResult save(@RequestBody ProjectDto dto, HttpServletRequest request) {
        RestDoing doing = jsonResult -> {
            if (StringUtils.isBlank(dto.getName())) {
                jsonResult.errorParam("名称不能为空");
                return;
            }
            if (StringUtils.isBlank(dto.getGitUrl())) {
                jsonResult.errorParam("项目git仓库url不能为空");
                return;
            }

            Project project = projectRepository.findByName(dto.getName());
            if (project != null) {
                jsonResult.remind("项目名已存在", log);
                return;

            }


            SystemConfig systemConfig = systemConfigRepository.findByKey(SystemConfig.keyProjectPath);

            project = new Project();
            BeanUtils.copyProperties(dto, project);
            project.setSystemPath(systemConfig.getValue() + File.separator + dto.getName());
            project = projectRepository.save(project);
            Project finalProject = project;

            String projectSystemPath = project.getSystemPath();
            File projectFile = new File(projectSystemPath);
            // 当服务器不存在目录时,创建目录 并且 git clone 部署项目
            if (projectFile.exists()) {
                projectFile.delete();
            }
            projectFile.mkdir();
            List<ProjectDeployFileDto> projectDeployFileDtoList = dto.getDeployTargetFileList();
            if (projectDeployFileDtoList != null) {
                for (ProjectDeployFileDto projectDeployFileDto : projectDeployFileDtoList) {
                    ProjectDeployFile projectDeployFile = ProjectDeployFileHelper.SINGLEONE.create(projectDeployFileDto.getEnable(), projectDeployFileDto.getLocalFilePath(), projectDeployFileDto.getRemoteFilePath(), project.getId(), project.getName());
                    projectDeployFileRepository.save(projectDeployFile);
                }
            }

            // 项目环境配置
            List<ProjectEnvConfigDto> projectEnvConfigList = dto.getProjectEnvConfigList();
            if (projectEnvConfigList != null) {
                for (ProjectEnvConfigDto projectEnvConfigDto : projectEnvConfigList) {

                    Long envId = projectEnvConfigDto.getEnvId();
                    if (envId == null) {
                        return;
                    }
                    ProjectEnv projectEnv = envRepository.findOne(envId);
                    String envName = projectEnv.getName();

                    ProjectEnvConfig projectEnvConfig = new ProjectEnvConfig();
                    projectEnvConfig.setEnvId(projectEnvConfigDto.getEnvId());
                    projectEnvConfig.setEnvName(projectEnvConfigDto.getEnvName());
                    projectEnvConfig.setEnvSort(projectEnv.getSort());
                    projectEnvConfig.setProjectId(project.getId());
                    projectEnvConfig.setProjectName(project.getName());
                    projectEnvConfig.setPublicBranch(projectEnvConfigDto.getPublicBranch());
                    projectEnvConfig = projectEnvConfigRepository.save(projectEnvConfig);

                    List<ProjectEnvIp> ipList = projectEnvConfigDto.getProjectEnvIpList();

                    ipList.stream().filter(projectEnvIp -> StringUtils.isNotBlank(projectEnvIp.getServerIp())).forEach(projectEnvIp -> {
                        ProjectEnvIp dbProjectEnvIp = new ProjectEnvIp();
                        ServerMachine serverMachine = serverMachineRepository.findByIp(projectEnvIp.getServerIp());
                        if (serverMachine != null) {
                            dbProjectEnvIp.setServerIp(serverMachine.getIp());
                            dbProjectEnvIp.setServerName(serverMachine.getName());
                            dbProjectEnvIp.setProjectId(finalProject.getId());
                            dbProjectEnvIp.setProjectName(finalProject.getName());
                            dbProjectEnvIp.setEnvId(envId);
                            dbProjectEnvIp.setEnvName(projectEnv.getName());
                            dbProjectEnvIp.setPublish(projectEnvIp.getPublish());
                            projectEnvIpRepository.save(dbProjectEnvIp);
                        }


                    });

                    // 项目构建前命令
                    if (projectEnvConfigDto.getBuildBeforeList() != null) {
                        for (ProjectBuildStep projectStructureStep : projectEnvConfigDto.getBuildBeforeList()) {
                            projectBuildStepRepository.save(ProjectStructureStepHelper.SINGLEONE.create(projectStructureStep.getStep(), ProjectBuildStepType.BEFORE, envId, envName, project.getId(), project.getName(), projectEnvConfig.getId()));
                        }
                    }
                    // 项目构建后命令
                    if (projectEnvConfigDto.getBuildAfterList() != null) {
                        for (ProjectBuildStep projectStructureStep : projectEnvConfigDto.getBuildAfterList()) {
                            projectBuildStepRepository.save(ProjectStructureStepHelper.SINGLEONE.create(projectStructureStep.getStep(), ProjectBuildStepType.AFTER, envId, envName, project.getId(), project.getName(), projectEnvConfig.getId()));
                        }
                    }
                    // 项目同步后命令
                    if (projectEnvConfigDto.getBuildSyncList() != null) {
                        for (ProjectBuildStep projectStructureStep : projectEnvConfigDto.getBuildSyncList()) {
                            projectBuildStepRepository.save(ProjectStructureStepHelper.SINGLEONE.create(projectStructureStep.getStep(), ProjectBuildStepType.SYNC, envId, envName, project.getId(), project.getName(), projectEnvConfig.getId()));
                        }
                    }
                }
            }
        };
        return doing.go(request, log);
    }

    @RequestMapping(value = Routes.PROJECT_UPDATE, method = RequestMethod.PUT)
    @Transactional
    public JsonResult update(@RequestBody ProjectDto dto) {
        JsonResult jsonResult = new JsonResult();

        CheckHelper.checkNotNull(dto.getId(), Project.CHECK_ID_IS_NOT_NULL);
        Long projectId = dto.getId();

        Project project = projectRepository.findOne(dto.getId());
        if (StringUtils.isNotBlank(dto.getName())) {
            project.setName(dto.getName());
        }
        if (StringUtils.isNotBlank(dto.getGitUrl())) {
            project.setGitUrl(dto.getGitUrl());
        }
        if (StringUtils.isNotBlank(dto.getRemotePath())) {
            project.setRemotePath(dto.getRemotePath());
        }
        if (StringUtils.isNotBlank(dto.getModuleName())) {
            project.setModuleName(dto.getModuleName());
        }


        List<ProjectDeployFileDto> projectDeployFileDtoList = dto.getDeployTargetFileList();
        if (projectDeployFileDtoList != null) {

            // 删除之前的数据，再添加
            List<ProjectDeployFile> projectDeployFileList = projectDeployFileRepository.findByProjectId(project.getId());
            projectDeployFileRepository.delete(projectDeployFileList);

            for (ProjectDeployFileDto projectDeployFileDto : projectDeployFileDtoList) {
                ProjectDeployFile projectDeployFile = ProjectDeployFileHelper.SINGLEONE.create(projectDeployFileDto.getEnable(), projectDeployFileDto.getLocalFilePath(), projectDeployFileDto.getRemoteFilePath(), project.getId(), project.getName());
                projectDeployFileRepository.save(projectDeployFile);
            }
        }
        project = projectRepository.save(project);
        Project finalProject = project;


        List<ProjectEnvIp> existProjectEnvIpList = projectEnvIpRepository.findByProjectId(projectId);
        List<String> existProjectEnvIpIdList = existProjectEnvIpList.stream().filter(projectEnvIp -> StringUtils.isNotBlank(projectEnvIp.getServerIp())).map(ProjectEnvIp::getServerIp).collect(Collectors.toList());

        // 项目环境配置
        List<ProjectEnvConfigDto> projectEnvConfigList = dto.getProjectEnvConfigList();
        if (projectEnvConfigList != null) {
            for (ProjectEnvConfigDto projectEnvConfigDto : projectEnvConfigList) {

                Long envId = projectEnvConfigDto.getEnvId();

                ProjectEnvConfig projectEnvConfig = projectEnvConfigRepository.findByProjectIdAndEnvId(projectId, envId);
                if (projectEnvConfig == null) {
                    projectEnvConfig = new ProjectEnvConfig();
                    projectEnvConfig.setProjectId(projectId);
                }


                ProjectEnv projectEnv = envRepository.findOne(envId);
                String envName = projectEnv.getName();
                projectEnvConfig.setEnvId(envId);
                projectEnvConfig.setEnvName(envName);
                projectEnvConfig.setEnvSort(projectEnv.getSort());
                projectEnvConfig.setProjectName(project.getName());
                projectEnvConfig.setPublicBranch(projectEnvConfigDto.getPublicBranch());
                projectEnvConfig = projectEnvConfigRepository.save(projectEnvConfig);

                List<ProjectEnvIp> projectEnvIpList = projectEnvConfigDto.getProjectEnvIpList().stream().filter(projectEnvIp -> StringUtils.isNotBlank(projectEnvIp.getServerIp())).collect(Collectors.toList());


                projectEnvIpList.forEach(projectEnvIp -> {
                    ServerMachine serverMachine = serverMachineRepository.findByIp(projectEnvIp.getServerIp());
                    if (serverMachine != null) {
                        ProjectEnvIp dbProjectEnvIp = projectEnvIpRepository.findByProjectIdAndEnvIdAndServerIp(finalProject.getId(), envId, projectEnvIp.getServerIp());
                        if (dbProjectEnvIp == null) {
                            dbProjectEnvIp = new ProjectEnvIp();
                        }
                        dbProjectEnvIp.setServerIp(serverMachine.getIp());
                        dbProjectEnvIp.setServerName(serverMachine.getName());
                        dbProjectEnvIp.setProjectId(finalProject.getId());
                        dbProjectEnvIp.setProjectName(finalProject.getName());
                        dbProjectEnvIp.setEnvId(envId);
                        dbProjectEnvIp.setEnvName(envName);
                        dbProjectEnvIp.setPublish(projectEnvIp.getPublish());
                        dbProjectEnvIp.setSync(projectEnvIp.getSync());
                        projectEnvIpRepository.save(dbProjectEnvIp);
                    }

                });


                existProjectEnvIpIdList.removeAll(projectEnvIpList.stream().map(ProjectEnvIp::getServerIp).collect(Collectors.toList()));

                // 项目构建前命令
                if (projectEnvConfigDto.getBuildBeforeList() != null) {

                    List<ProjectBuildStep> projectBuildStepList = projectBuildStepRepository.findByProjectIdAndTypeAndProjectEnvConfigId(project.getId(), ProjectBuildStepType.BEFORE, projectEnvConfig.getId());
                    projectBuildStepRepository.delete(projectBuildStepList);
                    for (ProjectBuildStep projectStructureStep : projectEnvConfigDto.getBuildBeforeList()) {
                        if (StringUtils.isBlank(projectStructureStep.getStep())) {
                            continue;
                        }
                        projectBuildStepRepository.save(ProjectStructureStepHelper.SINGLEONE.create(projectStructureStep.getStep(), ProjectBuildStepType.BEFORE, envId, envName, project.getId(), project.getName(), projectEnvConfig.getId()));
                    }
                }
                // 项目构建后命令
                if (projectEnvConfigDto.getBuildAfterList() != null) {
                    List<ProjectBuildStep> projectBuildStepList = projectBuildStepRepository.findByProjectIdAndTypeAndProjectEnvConfigId(project.getId(), ProjectBuildStepType.AFTER, projectEnvConfig.getId());
                    projectBuildStepRepository.delete(projectBuildStepList);
                    for (ProjectBuildStep projectStructureStep : projectEnvConfigDto.getBuildAfterList()) {
                        if (StringUtils.isBlank(projectStructureStep.getStep())) {
                            continue;
                        }
                        projectBuildStepRepository.save(ProjectStructureStepHelper.SINGLEONE.create(projectStructureStep.getStep(), ProjectBuildStepType.AFTER, envId, envName, project.getId(), project.getName(), projectEnvConfig.getId()));
                    }
                }
                // 项目同步后命令
                if (projectEnvConfigDto.getBuildSyncList() != null) {
                    List<ProjectBuildStep> projectBuildStepList = projectBuildStepRepository.findByProjectIdAndTypeAndProjectEnvConfigId(project.getId(), ProjectBuildStepType.SYNC, projectEnvConfig.getId());
                    projectBuildStepRepository.delete(projectBuildStepList);
                    for (ProjectBuildStep projectStructureStep : projectEnvConfigDto.getBuildSyncList()) {
                        if (StringUtils.isBlank(projectStructureStep.getStep())) {
                            continue;
                        }
                        projectBuildStepRepository.save(ProjectStructureStepHelper.SINGLEONE.create(projectStructureStep.getStep(), ProjectBuildStepType.SYNC, envId, envName, project.getId(), project.getName(), projectEnvConfig.getId()));
                    }
                }
            }

            // 最后删除 项目环境ip
            projectEnvIpRepository.deleteByProjectIdAndServerIpIn(projectId, existProjectEnvIpIdList);
        }
        return jsonResult;
    }

    @RequestMapping(value = Routes.PROJECT_DELETE, method = RequestMethod.DELETE)
    public JsonResult delete(@RequestBody Project dto, HttpServletRequest request) {
        RestDoing doing = jsonResult -> {
            Long projectId = dto.getId();
            if (projectId == null) {
                jsonResult.errorParam("id不能为空");
                return;
            }

            // 删除项目部署文件或目录
            List<ProjectDeployFile> projectDeployFileList = projectDeployFileRepository.findByProjectId(projectId);
            projectDeployFileRepository.delete(projectDeployFileList);

            // 删除对应项目用户分配权限
            List<UserProjectPermission> userProjectPermissionList = userProjectPermissionRepository.findByProjectId(projectId);
            userProjectPermissionRepository.delete(userProjectPermissionList);

            // 删除构建步骤
            List<ProjectBuildStep> projectBuildStepList = projectBuildStepRepository.findByProjectId(projectId);
            projectBuildStepRepository.delete(projectBuildStepList);

            // 删除各个环境配置
            List<ProjectEnvConfig> projectEnvConfigList = projectEnvConfigRepository.findByProjectId(projectId);
            projectEnvConfigRepository.delete(projectEnvConfigList);

            List<ProjectEnvIp> projectEnvIpList = projectEnvIpRepository.findByProjectId(projectId);
            projectEnvIpRepository.delete(projectEnvIpList);
            // 删除项目基本信息
            projectRepository.delete(projectId);
        };
        return doing.go(request, log);
    }

    @RequestMapping(value = Routes.PROJECT_BRANCH_REFRESH, method = RequestMethod.GET)
    public JsonResult branchRefresh(Long id) throws JsonProcessingException {

        JsonResult jsonResult = new JsonResult();


        CheckHelper.checkNotNull(id, Project.CHECK_ID_IS_NOT_NULL);
        Project project = projectRepository.findOne(id);
        CheckHelper.remindIsNotExist(project, Project.REMIND_RECORD_IS_NOT_EXIST);

        SystemConfig systemConfig = systemConfigRepository.findByKey(SystemConfig.keyProjectPath);

        String projectPath = systemConfig.getValue() + File.separator + project.getName();

        Shell shell = new Shell();
        // 1. cd 项目路劲
        shell.appendN("cd #{projectPath}/DEFAULT");
        shell.addParams("projectPath", projectPath);
        // 2. git pull 拉去所有分支
        shell.appendN("git pull");
        shell.appendN("git remote update origin --prune");
        // 3. 查看分支列表
        shell.appendN("git branch -a | grep remotes/origin");

        String lastShell = shell.getShell();
        String branchListTemp = ShellHelper.SINGLEONE.executeShellCommand(lastShell, log);
        branchListTemp = branchListTemp.replaceAll("</br>", "");
        branchListTemp = branchListTemp.replaceAll("deploy finish", "");
        String[] branchListArray = branchListTemp.split("remotes/origin/");
        List<String> branchList = Arrays.stream(branchListArray).filter(s -> !s.contains("Already") && !s.contains("HEAD") && !s.contains("Updating") && !s.contains("更新") && !s.contains("++++++") && !s.contains("+----")).map(String::trim).sorted().collect(Collectors.toList());
        project.setBranchList(objectMapper.writeValueAsString(branchList));
        projectRepository.save(project);

        jsonResult.data = project.getBranchList();
        return jsonResult;
    }

    @RequestMapping(value = Routes.PROJECT_INFO, method = RequestMethod.GET)
    public JsonResult info(Long id, HttpServletRequest request) {
        RestDoing doing = jsonResult -> {
            if (id == null) {
                jsonResult.errorParam("id不能为空");
                return;
            }
            Project project = projectRepository.findOne(id);
            if (project == null) {
                jsonResult.remind(Project.REMIND_RECORD_IS_NOT_EXIST);
                return;
            }

            ProjectDto projectDto = new ProjectDto();
            projectDto.setId(project.getId());
            projectDto.setGitUrl(project.getGitUrl());
            projectDto.setModuleName(project.getModuleName());
            projectDto.setBranchList(project.getBranchList());


            // 上传部署文件或目录
            List<ProjectDeployFile> projectDeployFileList = projectDeployFileRepository.findByProjectId(project.getId());
            List<ProjectDeployFileDto> projectDeployFileDtoList = projectDeployFileList.stream().map(projectDeployFile -> {
                ProjectDeployFileDto projectDeployFileDto = new ProjectDeployFileDto();
                projectDeployFileDto.setEnable(projectDeployFile.getEnable());
                projectDeployFileDto.setLocalFilePath(projectDeployFile.getLocalFilePath());
                projectDeployFileDto.setRemoteFilePath(projectDeployFile.getRemoteFilePath());
                return projectDeployFileDto;
            }).collect(Collectors.toList());
            projectDto.setDeployTargetFileList(projectDeployFileDtoList);

            projectDto.setName(project.getName());
            projectDto.setRemotePath(project.getRemotePath());

            // 项目配置环境
            List<ProjectEnvConfigDto> projectEnvConfigDtoList = new ArrayList<>();
            List<ProjectEnvConfig> projectEnvConfigList = projectEnvConfigRepository.findByProjectId(project.getId());

            for (ProjectEnvConfig projectEnvConfig : projectEnvConfigList) {

                Long envId = projectEnvConfig.getEnvId();
                if (envId == null) {
                    continue;
                }
                ProjectEnvConfigDto projectEnvConfigDto = new ProjectEnvConfigDto();
                projectEnvConfigDto.setEnvId(projectEnvConfig.getEnvId());
                projectEnvConfigDto.setEnvName(projectEnvConfig.getEnvName());


                List<ProjectEnvIp> projectEnvIpList = projectEnvIpRepository.findByProjectIdAndEnvId(project.getId(), projectEnvConfig.getEnvId());
                projectEnvIpList = projectEnvIpList.stream().filter(projectEnvIp -> StringUtils.isNotBlank(projectEnvIp.getServerIp())).map(projectEnvIp -> {
                    ProjectEnvIp projectEnvIpDto = new ProjectEnvIp();
                    projectEnvIpDto.setPublish(projectEnvIp.getPublish());
                    projectEnvIpDto.setSync(projectEnvIp.getSync());
                    projectEnvIpDto.setServerIp(projectEnvIp.getServerIp());
                    return projectEnvIpDto;
                }).collect(Collectors.toList());
                projectEnvConfigDto.setProjectEnvIpMap(projectEnvIpList.stream().collect(Collectors.toMap(ProjectEnvIp::getServerIp, o -> o)));
                projectEnvConfigDto.setPublicBranch(projectEnvConfig.getPublicBranch());

                // 项目配置环境构建前步骤
                if (projectEnvConfigDto.getBuildBeforeList() == null) {
                    projectEnvConfigDto.setBuildBeforeList(new ArrayList<>());
                }
                List<ProjectBuildStep> projectBuildStepBeforeList = projectBuildStepRepository.findByProjectIdAndTypeAndProjectEnvConfigId(project.getId(), ProjectBuildStepType.BEFORE, projectEnvConfig.getId());
                for (ProjectBuildStep projectStructureStep : projectBuildStepBeforeList) {
                    projectEnvConfigDto.getBuildBeforeList().add(projectStructureStep);
                }
                // 环境没有添加时，默认添加
                if (projectEnvConfigDto.getBuildBeforeList().size() == 0) {
                    projectEnvConfigDto.getBuildBeforeList().add(new ProjectBuildStep());
                }


                // 项目配置环境构建后步骤
                if (projectEnvConfigDto.getBuildAfterList() == null) {
                    projectEnvConfigDto.setBuildAfterList(new ArrayList<>());
                }
                List<ProjectBuildStep> projectBuildStepAfterList = projectBuildStepRepository.findByProjectIdAndTypeAndProjectEnvConfigId(project.getId(), ProjectBuildStepType.AFTER, projectEnvConfig.getId());
                for (ProjectBuildStep projectStructureStep : projectBuildStepAfterList) {
                    projectEnvConfigDto.getBuildAfterList().add(projectStructureStep);
                }
                // 环境没有添加时，默认添加
                if (projectEnvConfigDto.getBuildAfterList().size() == 0) {
                    projectEnvConfigDto.getBuildAfterList().add(new ProjectBuildStep());
                }

                // 项目配置环境构建后步骤
                if (projectEnvConfigDto.getBuildSyncList() == null) {
                    projectEnvConfigDto.setBuildSyncList(new ArrayList<>());
                }
                List<ProjectBuildStep> projectStructureSyncList = projectBuildStepRepository.findByProjectIdAndTypeAndProjectEnvConfigId(project.getId(), ProjectBuildStepType.SYNC, projectEnvConfig.getId());
                for (ProjectBuildStep projectStructureStep : projectStructureSyncList) {
                    projectEnvConfigDto.getBuildSyncList().add(projectStructureStep);
                }
                // 环境没有添加时，默认添加
                if (projectEnvConfigDto.getBuildSyncList().size() == 0) {
                    projectEnvConfigDto.getBuildSyncList().add(new ProjectBuildStep());
                }

                projectEnvConfigDtoList.add(projectEnvConfigDto);
            }

            projectDto.setProjectEnvConfigList(projectEnvConfigDtoList);
            jsonResult.data = projectDto;

        };
        return doing.go(request, log);
    }

    @Transactional
    @RequestMapping(value = Routes.PROJECT_SYNC, method = RequestMethod.POST)
    public JsonResult sync(@RequestBody ProjectDto dto, HttpServletRequest request) {
        JsonResult jsonResult = new JsonResult();
        Date now = new Date();
        UserDto userDto = UserHelper.SINGLEONE.getSession(request);
        Long projectId = dto.getId();
        Long envId = dto.getEnvId();
        String publicServerMachineIp = dto.getServerMachineIp();
        if (projectId == null) {
            jsonResult.errorParam(Project.CHECK_ID_IS_NOT_NULL);
            return jsonResult;
        }

        ProjectEnv projectEnv = envRepository.findOne(envId);

        Project project = projectRepository.findOne(projectId);
        ServerMachine serverMachine = serverMachineRepository.findByIp(publicServerMachineIp);

        SystemConfig systemConfig = systemConfigRepository.findByKey(SystemConfig.keyProjectPath);
        SystemConfig buildPathSystemConfig = systemConfigRepository.findByKey(SystemConfig.keyBuildPath);


        ProjectEnvConfig projectEnvConfig = projectEnvConfigRepository.findByProjectIdAndEnvId(projectId, envId);
        if (projectEnvConfig == null) {
            jsonResult.remind("发布环境不存在", log);
            return jsonResult;
        }
        ProjectEnvIp projectEnvIp = projectEnvIpRepository.findByProjectIdAndEnvIdAndServerIp(projectId, envId, publicServerMachineIp);
        if (projectEnvIp == null) {
            jsonResult.remind("发布环境ip不存在", log);
            return jsonResult;
        }

        String projectPath = systemConfig.getValue() + File.separator + project.getName();

        Map<String, String> params = new HashMap<>();
        StringBuilder shellBuilder = new StringBuilder();
        StrSubstitutor strSubstitutor = new StrSubstitutor(params, "#{", "}");

        // 公共参数
        params.put("port", serverMachine.getPort());
        params.put("username", serverMachine.getUsername());
        params.put("ip", serverMachine.getIp());
        params.put("projectEnv", projectEnv.getCode());


        String publicBranch = projectEnvConfig.getPublicBranch();
        params.put("publicBranch", publicBranch);

        // 1. cd 项目路劲
        shellBuilder.append("echo cd #{projectPath}").append("\n");
        shellBuilder.append("cd #{projectPath}").append("\n");
        params.put("projectPath", projectPath);
        params.put("remoteProjectPath", project.getRemotePath());

        // 2. 查询项目相同环境最新发布版本
        ProjectBuildLog projectBuildLog = projectBuildLogRepository.findTop1ByProjectIdAndBuildTypeAndEnvIdOrderByCreatedAtDesc(projectId, ProjectBuildType.BUILD, envId);
        String projectVersionDir = projectBuildLog.getBuildVersion();
        params.put("projectVersionDir", projectVersionDir);

        String buildPath = buildPathSystemConfig.getValue() + File.separator + project.getName();
        params.put("buildPath", buildPath);


        // 9. 远程服务器: 创建标准目录结构
        shellBuilder.append("echo ssh -p #{port} #{username}@#{ip} ").append("mkdir -p #{remoteProjectPath}/version").append("\n");
        shellBuilder.append("ssh -p #{port} #{username}@#{ip} ").append("'").append("mkdir -p #{remoteProjectPath}/version").append("'").append("\n");

        // 10. 远程服务器: 上传版本文件
        shellBuilder.append("echo scp -P #{port} -r #{buildPath}/#{projectEnv}/version/#{projectVersionDir}  #{username}@#{ip}:#{remoteProjectPath}/version").append("\n");
        shellBuilder.append("scp -P #{port} -r #{buildPath}/#{projectEnv}/version/#{projectVersionDir}  #{username}@#{ip}:#{remoteProjectPath}/version").append("\n");

        // 11. 远程服务器: 创建当前版本软链接
        // 11.1 删除
        shellBuilder.append("echo exec #{username}@#{ip} shell \n");
        shellBuilder.append("ssh -p #{port} #{username}@#{ip} ");
        shellBuilder.append("'").append("\n");
        shellBuilder.append("echo ln -sf #{remoteProjectPath}/current").append("\n")
                .append("ln -sf #{remoteProjectPath}/current").append("\n")
                .append("echo rm -rf  #{remoteProjectPath}/current").append("\n")
                .append("rm -rf  #{remoteProjectPath}/current").append("\n");
        // 11.2 创建
        shellBuilder.append("echo ln -s #{remoteProjectPath}/version/#{projectVersionDir} #{remoteProjectPath}/current").append("\n");
        shellBuilder.append("ln -s #{remoteProjectPath}/version/#{projectVersionDir} #{remoteProjectPath}/current").append("\n");
        shellBuilder.append("ln -sf ~/current").append("\n").append("rm -rf ~/current").append("\n");


        // 12. 查看此版本上传后文件列表
        shellBuilder.append("echo tree #{remoteProjectPath}/version/#{projectVersionDir}").append("\n");
        shellBuilder.append("tree #{remoteProjectPath}/version/#{projectVersionDir}").append("\n");

        // 13. 执行构建后命令
        List<ProjectBuildStep> afterProjectBuildStepList = projectBuildStepRepository.findByProjectIdAndTypeAndEnvId(projectId, ProjectBuildStepType.SYNC, envId);
        afterProjectBuildStepList.forEach(projectStructureStep -> {
            shellBuilder.append("echo ").append(projectStructureStep.getStep()).append("\n");
            shellBuilder.append(projectStructureStep.getStep()).append("\n");
        });

        shellBuilder.append("'");

        String lastShell = strSubstitutor.replace(shellBuilder.toString());
        String result = ShellHelper.SINGLEONE.executeShellCommand(lastShell, "project_log_id_" + projectId, log);

        // 同步完成添加发布日志
        ProjectBuildLog projectBuildLogNew = new ProjectBuildLog();
        projectBuildLogNew.setDescription(result);
        projectBuildLogNew.setProjectId(projectId);
        projectBuildLogNew.setStatus(ProjectBuildStatus.SUCCESS);
        projectBuildLogNew.setBuildType(ProjectBuildType.SYNC);
        projectBuildLogNew.setProjectName(project.getName());
        projectBuildLogNew.setUserId(userDto.getId());
        projectBuildLogNew.setUsername(userDto.getUsername());
        projectBuildLogNew = projectBuildLogRepository.save(projectBuildLogNew);
        projectBuildLogNew.setName(project.getName() + "_" + projectVersionDir);
        projectBuildLogNew.setBuildVersion(projectVersionDir);
        projectBuildLogNew.setIp(publicServerMachineIp);
        projectBuildLogNew.setEnvId(envId);
        projectBuildLogNew.setEnvName(projectEnv.getName());
        projectBuildLogRepository.save(projectBuildLogNew);

        // 最后更新发布时间
        projectEnvIp.setPublishTime(now);
        projectEnvIp.setPublishVersion(projectVersionDir);
        projectEnvIpRepository.save(projectEnvIp);

        return jsonResult;

    }


    @Transactional
    @RequestMapping(value = Routes.PROJECT_STRUCTURE, method = RequestMethod.POST)
    public JsonResult structure(@RequestBody ProjectDto dto, HttpServletRequest request) {
        Date now = new Date();
        UserDto userDto = UserHelper.SINGLEONE.getSession(request);
        JsonResult jsonResult = new JsonResult();
        Long projectId = dto.getId();

        Long envId = dto.getEnvId();
        String publicServerMachineIp = dto.getServerMachineIp();
        String publishBranch = dto.getPublishBranch();

        if (projectId == null) {
            jsonResult.errorParam("id不能为空");
            return jsonResult;
        }
        if (envId == null) {
            jsonResult.errorParam("发布环境id不能为空");
            return jsonResult;
        }
        // 需要发布的机器ip
        if (StringUtils.isBlank(publicServerMachineIp)) {
            jsonResult.errorParam("发布机器ip不能为空", log);
            return jsonResult;
        }

        ProjectEnv projectEnv = envRepository.findOne(envId);

        // 发布权限
//        if (userDto.getRoleType() != RoleType.ADMIN) {
//            long count = userDto.getUserProjectPermissionList().stream().filter(userProjectPermissionDto -> Objects.equals(userProjectPermissionDto.getProjectId(), dto.getId())).filter(userProjectPermissionDto -> userProjectPermissionDto.getProjectEnv().contains(dto.getEnv())).count();
//            if (count == 0) {
//                jsonResult.custom("10021", "没有此项目发布权限", log);
//                return jsonResult;
//            }
//        }

        Project project = projectRepository.findOne(dto.getId());
        SystemConfig systemConfig = systemConfigRepository.findByKey(SystemConfig.keyProjectPath);


        ProjectEnvConfig projectEnvConfig = projectEnvConfigRepository.findByProjectIdAndEnvId(projectId, envId);
        if (projectEnvConfig == null) {
            jsonResult.remind("发布环境不存在", log);
            return jsonResult;
        }

        ProjectEnvIp projectEnvIp = projectEnvIpRepository.findByProjectIdAndEnvIdAndServerIp(projectId, envId, publicServerMachineIp);
        if (projectEnvIp == null) {
            jsonResult.remind("发布环境ip不存在", log);
            return jsonResult;
        }

        ServerMachine serverMachine = serverMachineRepository.findByIp(publicServerMachineIp);

        Shell shell = new Shell();
        // 公共参数
        shell.addParams("port", serverMachine.getPort());
        shell.addParams("username", serverMachine.getUsername());
        shell.addParams("ip", serverMachine.getIp());
        shell.addParams("projectEnv", projectEnv.getCode());
        // 指定分支发布
        if (StringUtils.isBlank(publishBranch)) {
            publishBranch = projectEnvConfig.getPublicBranch();
        }
        shell.addParams("publicBranch", publishBranch);
        String remoteProjectPath = project.getRemotePath();
        shell.addParams("remoteProjectPath", remoteProjectPath);


        // 1. cd 项目路劲
        String projectPath = systemConfig.getValue() + File.separator + project.getName();
        shell.appendN("echo 'cd #{projectPath}/#{projectEnv}'");
        shell.appendN("cd #{projectPath}/#{projectEnv}");
        shell.addParams("projectPath", projectPath);

        // 2. git pull 用git拉去最新代码
        shell.appendN("echo git pull");
        shell.appendN("git pull");

        // 3. git 切换到项目发布分支 并且 拉取发布分支最新代码
        if (StringUtils.isBlank(publishBranch)) {
            publishBranch = "master"; // 如果不填分支默认 master
        }
        shell.appendN("echo 'git checkout #{publicBranch}'");
        shell.appendN("git checkout .");
        shell.appendN("git checkout #{publicBranch}");


        shell.appendN("echo 'git pull origin #{publicBranch}'");
        shell.appendN("git pull origin #{publicBranch}");
        shell.addParams("publicBranch", publishBranch);

        // 4. 执行构建命令
        List<ProjectBuildStep> beforeProjectBuildStepList = projectBuildStepRepository.findByProjectIdAndTypeAndEnvId(projectId, ProjectBuildStepType.BEFORE, envId);
        beforeProjectBuildStepList.forEach(projectStructureStep -> {
            shell.appendN("echo ").appendN("'").appendN(projectStructureStep.getStep()).appendN("'");
            shell.appendN(projectStructureStep.getStep());
        });

        // 5. 创建build目录文件夹
        SystemConfig buildSystemConfig = systemConfigRepository.findByKey(SystemConfig.keyBuildPath);
        String buildPath = buildSystemConfig.getValue() + File.separator + project.getName();
        shell.appendN("echo 'mkdir -p #{buildPath}'");
        shell.appendN("mkdir -p #{buildPath}");
        shell.addParams("buildPath", buildPath);

        // 6. 创建发布版本文件夹 当前发布时间 + git 分支 + git log version  目录格式：20170608_release_2.1.0_f0a39fe52e3f1f4b3b42ee323623ae71ada21094
        String getLogVersionShell = "cd " + projectPath + "/DEFAULT" + " \n git pull \n git checkout " + publishBranch + " \n git pull origin " + publishBranch + " \n echo $(git log -1)";
        String gitLogVersion = ShellHelper.SINGLEONE.executeShellCommand(getLogVersionShell, log);
        if (StringUtils.isNotBlank(gitLogVersion)) {
            gitLogVersion = gitLogVersion.substring(gitLogVersion.indexOf("commit") + 6, gitLogVersion.indexOf("commit") + 19).trim();
        }
        String projectVersionDir = DateFormatUtils.format(new Date(), "yyyyMMdd") + "_" + publishBranch.replace("/", "_") + "_" + gitLogVersion;
        shell.appendN("echo 'mkdir -p #{buildPath}/#{projectEnv}/version/#{projectVersionDir}'");
        shell.appendN("mkdir -p #{buildPath}/#{projectEnv}/version/#{projectVersionDir}");
        shell.addParams("projectVersionDir", projectVersionDir);


        // 7. 把构建好的文件 并且 是需要上传的文件 copy到版本文件夹中
        List<ProjectDeployFile> projectDeployFileList = projectDeployFileRepository.findByProjectId(projectId);
        for (int i = 0; i < projectDeployFileList.size(); i++) {
            ProjectDeployFile projectDeployFile = projectDeployFileList.get(i);
            shell.appendN("echo 'cp -r #{projectPath}/#{projectEnv}/#{projectDeployFileLocalFilePath" + i + "} #{buildPath}/#{projectEnv}/version/#{projectVersionDir}/#{projectDeployFileRemoteFilePath" + i + "}'");
            shell.appendN("cp -r #{projectPath}/#{projectEnv}/#{projectDeployFileLocalFilePath" + i + "} #{buildPath}/#{projectEnv}/version/#{projectVersionDir}/#{projectDeployFileRemoteFilePath" + i + "}");
            shell.addParams("projectDeployFileLocalFilePath" + i, projectDeployFile.getLocalFilePath());
            shell.addParams("projectDeployFileRemoteFilePath" + i, projectDeployFile.getRemoteFilePath());
        }

        // 8. 创建本地最新版本软连接
        shell.appendN("cd #{buildPath}/#{projectEnv}");
        shell.appendN("echo 'ln -sf #{buildPath}/#{projectEnv}/current'");
        shell.appendN("ln -sf #{buildPath}/#{projectEnv}/current");
        shell.appendN("echo 'rm -rf #{buildPath}/#{projectEnv}/current'");
        shell.appendN("rm -rf #{buildPath}/#{projectEnv}/current");
        shell.appendN("echo 'ln -s #{buildPath}/#{projectEnv}/version/#{projectVersionDir} #{buildPath}/#{projectEnv}/current'");
        shell.appendN("ln -s #{buildPath}/#{projectEnv}/version/#{projectVersionDir} #{buildPath}/#{projectEnv}/current");

        // 9. 远程服务器: 创建标准目录结构
        shell.appendN("echo 'ssh -p #{port} #{username}@#{ip} mkdir -p #{remoteProjectPath}/version'");
        shell.appendN("ssh -p #{port} #{username}@#{ip} 'mkdir -p #{remoteProjectPath}/version'");

        // 10. 远程服务器: 上传版本文件
        shell.appendN("echo 'scp -P #{port} -r #{buildPath}/#{projectEnv}/version/#{projectVersionDir}  #{username}@#{ip}:#{remoteProjectPath}/version'");
        shell.appendN("scp -P #{port} -r #{buildPath}/#{projectEnv}/version/#{projectVersionDir}  #{username}@#{ip}:#{remoteProjectPath}/version");

        // 11. 远程服务器: 创建当前版本软链接
        // 11.1 删除
        shell.appendN("echo 'exec #{username}@#{ip} shell'");
        shell.appendN("ssh -p #{port} #{username}@#{ip} '");
        shell.appendN("echo \"ln -sf #{remoteProjectPath}/current\"")
                .appendN("ln -sf #{remoteProjectPath}/current")
                .appendN("echo \"rm -rf  #{remoteProjectPath}/current\"")
                .appendN("rm -rf  #{remoteProjectPath}/current");
        // 11.2 创建
        shell.appendN("echo \"ln -s #{remoteProjectPath}/version/#{projectVersionDir} #{remoteProjectPath}/current\"");
        shell.appendN("ln -s #{remoteProjectPath}/version/#{projectVersionDir} #{remoteProjectPath}/current");
        shell.appendN("ln -sf ~/current").appendN("rm -rf ~/current");


        // 12. 查看此版本上传后文件列表
        shell.appendN("echo \"tree #{remoteProjectPath}/version/#{projectVersionDir}\"");
        shell.appendN("tree #{remoteProjectPath}/version/#{projectVersionDir}");

        // 13. 执行构建后命令
        List<ProjectBuildStep> afterProjectBuildStepList = projectBuildStepRepository.findByProjectIdAndTypeAndEnvId(projectId, ProjectBuildStepType.AFTER, envId);
        afterProjectBuildStepList.forEach(projectStructureStep -> {
            shell.appendN("echo \"").appendN(projectStructureStep.getStep()).appendN("\"");
            shell.appendN(projectStructureStep.getStep());
        });

        shell.appendN("'");

        String lastShell = shell.getShell();
        String result = ShellHelper.SINGLEONE.executeShellCommand(lastShell, "project_log_id_" + projectId, log);


        // 发布完成添加发布日志
        ProjectBuildLog projectBuildLog = new ProjectBuildLog();
        projectBuildLog.setDescription(result);
        projectBuildLog.setProjectId(projectId);
        projectBuildLog.setStatus(ProjectBuildStatus.SUCCESS);
        projectBuildLog.setBuildType(ProjectBuildType.BUILD);
        projectBuildLog.setProjectName(project.getName());
        projectBuildLog.setUserId(userDto.getId());
        projectBuildLog.setUsername(userDto.getUsername());
        projectBuildLog = projectBuildLogRepository.save(projectBuildLog);
        projectBuildLog.setName(project.getName() + "_" + projectVersionDir);
        projectBuildLog.setBuildVersion(projectVersionDir);
        projectBuildLog.setIp(publicServerMachineIp);
        projectBuildLog.setEnvId(envId);
        projectBuildLog.setEnvName(projectEnv.getName());
        projectBuildLogRepository.save(projectBuildLog);

        // 最后更新发布时间
        projectEnvIp.setPublishTime(now);
        projectEnvIp.setPublishVersion(projectVersionDir);
        projectEnvIpRepository.save(projectEnvIp);
        return jsonResult;

    }

    @Transactional
    @RequestMapping(value = Routes.PROJECT_BUILD_LOG, method = RequestMethod.GET)
    public JsonResult buildLog(ProjectDto dto, HttpServletRequest request) {
        UserDto userDto = UserHelper.SINGLEONE.getSession(request);
        RestDoing doing = jsonResult -> {
            Long id = dto.getId();
            if (id == null) {
                jsonResult.errorParam(Project.CHECK_ID_IS_NOT_NULL);
                return;
            }
            StringBuilder result = Config.STRING_BUILDER_MAP.get("project_log_id_" + dto.getId());
            if (result == null) {
                result = new StringBuilder("");
            }
            jsonResult.data = result.toString().replaceAll("ERROR", "<span style=\"color:#c9302c\">ERROR</span>");
            jsonResult.data = result.toString().replaceAll("WARNING", "<span style=\"color:#ffbf00\">WARNING</span>");
        };
        return doing.go(log);
    }

}
