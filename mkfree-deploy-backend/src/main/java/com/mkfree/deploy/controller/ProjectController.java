package com.mkfree.deploy.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mkfree.deploy.Routes;
import com.mkfree.deploy.common.BaseController;
import com.mkfree.deploy.common.JsonResult;
import com.mkfree.deploy.common.PageResult;
import com.mkfree.deploy.common.RestDoing;
import com.mkfree.deploy.domain.*;
import com.mkfree.deploy.domain.enumclass.*;
import com.mkfree.deploy.dto.*;
import com.mkfree.deploy.helper.*;
import com.mkfree.deploy.repository.*;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.text.StrSubstitutor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
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
    private ProjectStructureStepRepository projectStructureStepRepository;
    @Autowired
    private ProjectEnvConfigRepository projectEnvConfigRepository;
    @Autowired
    private SystemConfigRepository systemConfigRepository;
    @Autowired
    private ObjectMapper objectMapper;
    @Autowired
    private ProjectStructureLogRepository projectStructureLogRepository;
    @Autowired
    private ProjectDeployFileRepository projectDeployFileRepository;
    @Autowired
    private UserProjectPermissionRepository userProjectPermissionRepository;
    @Autowired
    private ExecutorService commonExecutorService;


    @RequestMapping(value = Routes.PROJECT_ENV_LIST, method = RequestMethod.GET)
    public JsonResult envList(HttpServletRequest request) {
        RestDoing doing = jsonResult -> {
            List<ProjectEnvConfigDto> projectEnvConfigDtoList = new ArrayList<>();

            for (int i = 0; i < ProjectEnv.values().length; i++) {
                ProjectEnv projectEnv = ProjectEnv.values()[i];
                ProjectEnvConfigDto projectEnvConfigDto = new ProjectEnvConfigDto();
                projectEnvConfigDto.setEnv(projectEnv);
                // 项目配置环境构建前步骤
                projectEnvConfigDto.setBuildBeforeList(Collections.singletonList(new ProjectBuildStep()));
                // 项目配置环境构建后步骤
                projectEnvConfigDto.setBuildAfterList(Collections.singletonList(new ProjectBuildStep()));
                projectEnvConfigDtoList.add(projectEnvConfigDto);
            }
            jsonResult.data = projectEnvConfigDtoList;
        };
        return doing.go(request, log);
    }


    @RequestMapping(value = Routes.PROJECT_PAGE, method = RequestMethod.GET)
    public JsonResult page(Integer pageNo, Integer pageSize, HttpServletRequest request) {
        UserDto userDto = UserHelper.SINGLEONE.getSession(request);

        // 首先把用户可发布的项目权限分组
        Map<Long, UserProjectPermissionDto> userProjectPermissionDtoMap = userDto.getUserProjectPermissionList().stream().collect(Collectors.toMap(UserProjectPermissionDto::getProjectId, userProjectPermissionDto -> userProjectPermissionDto));

        RestDoing doing = jsonResult -> {

            List<ProjectDto> projectDtoList = new ArrayList<>();

            Page<Project> page = projectRepository.findAll(this.getPageRequest(pageNo, pageSize, Sort.Direction.DESC, "name"));
            page.getContent().forEach(project -> {

                ProjectDto projectDto = new ProjectDto();
                projectDto.setName(project.getName());
                projectDto.setId(project.getId());
                // 最后发布时间
                ProjectBuildLog projectBuildLog = projectStructureLogRepository.findTop1ByProjectIdOrderByIdDesc(project.getId());
                if (null != projectBuildLog) {
                    projectDto.setLastPublishDate(projectBuildLog.getCreatedAt());
                }


                // 查询对应项目的部署环境
                List<ProjectEnvConfig> projectEnvConfigList = projectEnvConfigRepository.findByProjectId(project.getId());
                projectEnvConfigList = projectEnvConfigList.stream().filter(projectEnvConfig -> !projectEnvConfig.getServerMachineIp().equals("[]")).collect(Collectors.toList());
                List<ProjectEnvConfigDto> projectEnvConfigDtoList = new ArrayList<>();
                if (userDto.getRoleType() == RoleType.ADMIN) {

                    this.projectEnvConfigList(projectEnvConfigList, projectEnvConfigDtoList);
                } else {
                    UserProjectPermissionDto userProjectPermissionDto = userProjectPermissionDtoMap.get(project.getId());
                    // 普通操作人员
                    if (userProjectPermissionDto != null) {
                        projectEnvConfigList = projectEnvConfigList.stream().filter(projectEnvConfig -> userProjectPermissionDto.getProjectEnv().contains(projectEnvConfig.getEnv())).collect(Collectors.toList());
                        if (projectEnvConfigList != null) {
                            this.projectEnvConfigList(projectEnvConfigList, projectEnvConfigDtoList);
                        }
                    }
                }
                projectDto.setProjectEnvConfigList(projectEnvConfigDtoList);
                projectDtoList.add(projectDto);

            });


            jsonResult.data = new PageResult<>(page.getNumber(), page.getSize(), page.getTotalElements(), projectDtoList, Routes.PROJECT_PAGE);
        };
        return doing.go(request, objectMapper, log);
    }

    @RequestMapping(value = Routes.PROJECT_SAVE, method = RequestMethod.POST)
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
            project.setSystemPath(systemConfig.getValue() + "/" + dto.getName());
            project = projectRepository.save(project);

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
                    ProjectEnvConfig projectEnvConfig = new ProjectEnvConfig();
                    projectEnvConfig.setEnv(projectEnvConfigDto.getEnv());
                    projectEnvConfig.setProjectId(project.getId());
                    projectEnvConfig.setProjectName(project.getName());
                    projectEnvConfig.setServerMachineIp(objectMapper.writeValueAsString(projectEnvConfigDto.getServerMachineIpList()));
                    projectEnvConfig.setPublicBranch(projectEnvConfigDto.getPublicBranch());
                    projectEnvConfig = projectEnvConfigRepository.save(projectEnvConfig);

                    // 项目构建前命令
                    if (projectEnvConfigDto.getBuildBeforeList() != null) {
                        for (ProjectBuildStep projectStructureStep : projectEnvConfigDto.getBuildBeforeList()) {
                            projectStructureStepRepository.save(ProjectStructureStepHelper.SINGLEONE.create(projectStructureStep.getStep(), ProjectBuildStepType.BEFORE, projectEnvConfig.getEnv(), project.getId(), project.getName(), projectEnvConfig.getId()));
                        }
                    }
                    // 项目构建后命令
                    if (projectEnvConfigDto.getBuildAfterList() != null) {
                        for (ProjectBuildStep projectStructureStep : projectEnvConfigDto.getBuildAfterList()) {
                            projectStructureStepRepository.save(ProjectStructureStepHelper.SINGLEONE.create(projectStructureStep.getStep(), ProjectBuildStepType.AFTER, projectEnvConfig.getEnv(), project.getId(), project.getName(), projectEnvConfig.getId()));
                        }
                    }
                    // 项目同步后命令
                    if (projectEnvConfigDto.getBuildSyncList() != null) {
                        for (ProjectBuildStep projectStructureStep : projectEnvConfigDto.getBuildSyncList()) {
                            projectStructureStepRepository.save(ProjectStructureStepHelper.SINGLEONE.create(projectStructureStep.getStep(), ProjectBuildStepType.SYNC, projectEnvConfig.getEnv(), project.getId(), project.getName(), projectEnvConfig.getId()));
                        }
                    }
                }
            }
        };
        return doing.go(request, log);
    }

    @RequestMapping(value = Routes.PROJECT_UPDATE, method = RequestMethod.PUT)
    public JsonResult update(@RequestBody ProjectDto dto, HttpServletRequest request) {
        RestDoing doing = jsonResult -> {
            if (dto.getId() == null) {
                jsonResult.errorParam("id不能为空");
                return;
            }
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

            // 项目环境配置
            List<ProjectEnvConfigDto> projectEnvConfigList = dto.getProjectEnvConfigList();
            if (projectEnvConfigList != null) {
                for (ProjectEnvConfigDto projectEnvConfigDto : projectEnvConfigList) {
                    ProjectEnvConfig projectEnvConfig = projectEnvConfigRepository.findByProjectIdAndEnv(project.getId(), projectEnvConfigDto.getEnv());
                    if (projectEnvConfig == null) {
                        projectEnvConfig = new ProjectEnvConfig();
                        projectEnvConfig.setProjectId(project.getId());
                    }
                    projectEnvConfig.setEnv(projectEnvConfigDto.getEnv());
                    projectEnvConfig.setProjectName(project.getName());
                    projectEnvConfig.setServerMachineIp(objectMapper.writeValueAsString(projectEnvConfigDto.getServerMachineIpList()));
                    projectEnvConfig.setPublicBranch(projectEnvConfigDto.getPublicBranch());
                    projectEnvConfig = projectEnvConfigRepository.save(projectEnvConfig);


                    // 项目构建前命令
                    if (projectEnvConfigDto.getBuildBeforeList() != null) {

                        List<ProjectBuildStep> projectBuildStepList = projectStructureStepRepository.findByProjectIdAndTypeAndProjectEnvConfigId(project.getId(), ProjectBuildStepType.BEFORE, projectEnvConfig.getId());
                        projectStructureStepRepository.delete(projectBuildStepList);
                        for (ProjectBuildStep projectStructureStep : projectEnvConfigDto.getBuildBeforeList()) {
                            if (StringUtils.isBlank(projectStructureStep.getStep())) {
                                continue;
                            }
                            projectStructureStepRepository.save(ProjectStructureStepHelper.SINGLEONE.create(projectStructureStep.getStep(), ProjectBuildStepType.BEFORE, projectEnvConfig.getEnv(), project.getId(), project.getName(), projectEnvConfig.getId()));
                        }
                    }
                    // 项目构建后命令
                    if (projectEnvConfigDto.getBuildAfterList() != null) {
                        List<ProjectBuildStep> projectBuildStepList = projectStructureStepRepository.findByProjectIdAndTypeAndProjectEnvConfigId(project.getId(), ProjectBuildStepType.AFTER, projectEnvConfig.getId());
                        projectStructureStepRepository.delete(projectBuildStepList);
                        for (ProjectBuildStep projectStructureStep : projectEnvConfigDto.getBuildAfterList()) {
                            if (StringUtils.isBlank(projectStructureStep.getStep())) {
                                continue;
                            }
                            projectStructureStepRepository.save(ProjectStructureStepHelper.SINGLEONE.create(projectStructureStep.getStep(), ProjectBuildStepType.AFTER, projectEnvConfig.getEnv(), project.getId(), project.getName(), projectEnvConfig.getId()));
                        }
                    }
                    // 项目同步后命令
                    if (projectEnvConfigDto.getBuildSyncList() != null) {
                        List<ProjectBuildStep> projectBuildStepList = projectStructureStepRepository.findByProjectIdAndTypeAndProjectEnvConfigId(project.getId(), ProjectBuildStepType.SYNC, projectEnvConfig.getId());
                        projectStructureStepRepository.delete(projectBuildStepList);
                        for (ProjectBuildStep projectStructureStep : projectEnvConfigDto.getBuildSyncList()) {
                            if (StringUtils.isBlank(projectStructureStep.getStep())) {
                                continue;
                            }
                            projectStructureStepRepository.save(ProjectStructureStepHelper.SINGLEONE.create(projectStructureStep.getStep(), ProjectBuildStepType.SYNC, projectEnvConfig.getEnv(), project.getId(), project.getName(), projectEnvConfig.getId()));
                        }
                    }
                }
            }
        };
        return doing.go(request, log);
    }

    @RequestMapping(value = Routes.PROJECT_DELETE, method = RequestMethod.DELETE)
    public JsonResult delete(@RequestBody Project dto, HttpServletRequest request) {
        RestDoing doing = jsonResult -> {
            if (dto.getId() == null) {
                jsonResult.errorParam("id不能为空");
                return;
            }

            // 删除项目部署文件或目录
            List<ProjectDeployFile> projectDeployFileList = projectDeployFileRepository.findByProjectId(dto.getId());
            projectDeployFileRepository.delete(projectDeployFileList);

            // 删除对应项目用户分配权限
            List<UserProjectPermission> userProjectPermissionList = userProjectPermissionRepository.findByProjectId(dto.getId());
            userProjectPermissionRepository.delete(userProjectPermissionList);

            // 删除构建步骤
            List<ProjectBuildStep> projectBuildStepList = projectStructureStepRepository.findByProjectId(dto.getId());
            projectStructureStepRepository.delete(projectBuildStepList);

            // 删除各个环境配置
            List<ProjectEnvConfig> projectEnvConfigList = projectEnvConfigRepository.findByProjectId(dto.getId());
            projectEnvConfigRepository.delete(projectEnvConfigList);

            // 删除项目基本信息
            projectRepository.delete(dto.getId());
        };
        return doing.go(request, log);
    }

    @RequestMapping(value = Routes.PROJECT_BRANCH_LIST, method = RequestMethod.GET)
    public JsonResult branchList(Long id, HttpServletRequest request) {
        RestDoing doing = jsonResult -> {
            if (id == null) {
                jsonResult.errorParam(Project.CHECK_IDENTIFIER_IS_NOT_NULL);
                return;
            }
            Project project = projectRepository.findOne(id);
            if (project == null) {
                jsonResult.remind(Project.REMIND_RECORD_IS_NOT_EXIST);
                return;
            }
            SystemConfig systemConfig = systemConfigRepository.findByKey(SystemConfig.keyProjectPath);

            String projectPath = systemConfig.getValue() + "/" + project.getName();

            Map<String, String> params = new HashMap<>();
            StringBuilder shellBuilder = new StringBuilder();
            StrSubstitutor strSubstitutor = new StrSubstitutor(params, "#{", "}");

            // 1. cd 项目路劲
            shellBuilder.append("cd #{projectPath}").append("\n");
            params.put("projectPath", projectPath);

            // 2. git pull 拉去所有分支
            shellBuilder.append("git pull").append("\n");

            // 3. 查看分支列表
            shellBuilder.append("git branch -a | grep remotes/origin").append("\n");

            String lastShell = strSubstitutor.replace(shellBuilder.toString());
            String branchListTemp = ShellHelper.SINGLEONE.executeShellCommand(log, lastShell);
            String[] branchListArray = branchListTemp.split("remotes/origin/");

            jsonResult.data = Arrays.stream(branchListArray).filter(s -> !s.contains("Already") && !s.contains("HEAD") && !s.contains("Updating")).map(String::trim).sorted().collect(Collectors.toList());
        };
        return doing.go(request, log);
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
                ProjectEnvConfigDto projectEnvConfigDto = new ProjectEnvConfigDto();
                projectEnvConfigDto.setEnv(projectEnvConfig.getEnv());
                projectEnvConfigDto.setServerMachineIpList(ObjectMapperHelper.SINGLEONE.jsonToListString(objectMapper, projectEnvConfig.getServerMachineIp()));
                projectEnvConfigDto.setPublicBranch(projectEnvConfig.getPublicBranch());

                // 项目配置环境构建前步骤
                if (projectEnvConfigDto.getBuildBeforeList() == null) {
                    projectEnvConfigDto.setBuildBeforeList(new ArrayList<>());
                }
                List<ProjectBuildStep> projectBuildStepBeforeList = projectStructureStepRepository.findByProjectIdAndTypeAndProjectEnvConfigId(project.getId(), ProjectBuildStepType.BEFORE, projectEnvConfig.getId());
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
                List<ProjectBuildStep> projectBuildStepAfterList = projectStructureStepRepository.findByProjectIdAndTypeAndProjectEnvConfigId(project.getId(), ProjectBuildStepType.AFTER, projectEnvConfig.getId());
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
                List<ProjectBuildStep> projectStructureSyncList = projectStructureStepRepository.findByProjectIdAndTypeAndProjectEnvConfigId(project.getId(), ProjectBuildStepType.SYNC, projectEnvConfig.getId());
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
        UserDto userDto = UserHelper.SINGLEONE.getSession(request);
        RestDoing doing = jsonResult -> {
            Long projectId = dto.getId();
            ProjectEnv projectEnv = dto.getEnv();
            String publicServerMachineIp = dto.getServerMachineIp();
            if (projectId == null) {
                jsonResult.errorParam(Project.CHECK_IDENTIFIER_IS_NOT_NULL);
                return;
            }

            log.info("project sync >> start");
            Project project = projectRepository.findOne(projectId);
            ServerMachine serverMachine = serverMachineRepository.findByIp(publicServerMachineIp);

            SystemConfig systemConfig = systemConfigRepository.findByKey(SystemConfig.keyProjectPath);

            ProjectEnvConfig projectEnvConfig = projectEnvConfigRepository.findByProjectIdAndEnv(projectId, projectEnv);
            if (projectEnvConfig == null) {
                jsonResult.remind("发布环境不存在", log);
                return;
            }

            String projectPath = systemConfig.getValue() + "/" + project.getName();

            Map<String, String> params = new HashMap<>();
            StringBuilder shellBuilder = new StringBuilder();
            StrSubstitutor strSubstitutor = new StrSubstitutor(params, "#{", "}");

            // 公共参数
            params.put("port", serverMachine.getPort());
            params.put("username", serverMachine.getUsername());
            params.put("ip", serverMachine.getIp());

            String publicBranch = projectEnvConfig.getPublicBranch();
            params.put("publicBranch", publicBranch);

            // 1. cd 项目路劲
            shellBuilder.append("cd #{projectPath}").append("\n");
            params.put("projectPath", projectPath);

            String lastShell = ProjectHelper.SINGLEONE.createDeployShell(strSubstitutor, shellBuilder, params, projectPath, publicBranch, projectId, projectEnv, projectDeployFileRepository, projectStructureStepRepository, true);
            ShellHelper.SINGLEONE.executeShellCommand(log, lastShell);

        };
        return doing.go(userDto, request, objectMapper, log);
    }


    @Transactional
    @RequestMapping(value = Routes.PROJECT_STRUCTURE, method = RequestMethod.POST)
    public JsonResult structure(@RequestBody ProjectDto dto, HttpServletRequest request) {
        UserDto userDto = UserHelper.SINGLEONE.getSession(request);

        RestDoing doing = jsonResult -> {

            Long projectId = dto.getId();
            ProjectEnv projectEnv = dto.getEnv();
            String publicServerMachineIp = dto.getServerMachineIp();

            if (projectId == null) {
                jsonResult.errorParam("id不能为空");
                return;
            }
            if (projectEnv == null) {
                jsonResult.errorParam("发布环境不能为空");
                return;
            }
            // 需要发布的机器ip
            if (StringUtils.isBlank(publicServerMachineIp)) {
                jsonResult.errorParam("发布机器ip不能为空", log);
                return;
            }

            // 发布权限
            if (userDto.getRoleType() != RoleType.ADMIN) {
                long count = userDto.getUserProjectPermissionList().stream().filter(userProjectPermissionDto -> Objects.equals(userProjectPermissionDto.getProjectId(), dto.getId())).filter(userProjectPermissionDto -> userProjectPermissionDto.getProjectEnv().contains(dto.getEnv())).count();
                if (count == 0) {
                    jsonResult.custom("10021", "没有此项目发布权限", log);
                    return;
                }
            }

            Project project = projectRepository.findOne(dto.getId());
            SystemConfig systemConfig = systemConfigRepository.findByKey(SystemConfig.keyProjectPath);


            ProjectEnvConfig projectEnvConfig = projectEnvConfigRepository.findByProjectIdAndEnv(projectId, projectEnv);
            if (projectEnvConfig == null) {
                jsonResult.remind("发布环境不存在", log);
                return;
            }

            ServerMachine serverMachine = serverMachineRepository.findByIp(publicServerMachineIp);


            Map<String, String> params = new HashMap<>();

            // 公共参数
            params.put("port", serverMachine.getPort());
            params.put("username", serverMachine.getUsername());
            params.put("ip", serverMachine.getIp());

            String publicBranch = projectEnvConfig.getPublicBranch();
            params.put("publicBranch", publicBranch);
            String remoteProjectPath = project.getRemotePath();
            params.put("remoteProjectPath", remoteProjectPath);


            StringBuilder shellBuilder = new StringBuilder();
            StrSubstitutor strSubstitutor = new StrSubstitutor(params, "#{", "}");

            // 1. cd 项目路劲
            String projectPath = systemConfig.getValue() + "/" + project.getName();
            shellBuilder.append("echo 'cd #{projectPath}'").append("\n");
            shellBuilder.append("cd #{projectPath}").append("\n");
            params.put("projectPath", projectPath);

            // 2. git pull 用git拉去最新代码
            shellBuilder.append("echo 'git pull'").append("\n");
            shellBuilder.append("git pull").append("\n");

            // 3. git 切换到项目发布分支 并且 拉取发布分支最新代码
            if (StringUtils.isBlank(publicBranch)) {
                publicBranch = "master"; // 如果不填分支默认 master
            }
            shellBuilder.append("echo 'git checkout #{publicBranch}'").append("\n");
            shellBuilder.append("git checkout #{publicBranch}").append("\n");


            shellBuilder.append("echo 'git pull origin #{publicBranch}'").append("\n");
            shellBuilder.append("git pull origin #{publicBranch}").append("\n");
            params.put("publicBranch", publicBranch);

            // 4. 执行构建命令
            List<ProjectBuildStep> beforeProjectBuildStepList = projectStructureStepRepository.findByProjectIdAndTypeAndEnv(projectId, ProjectBuildStepType.BEFORE, projectEnv);
            beforeProjectBuildStepList.forEach(projectStructureStep -> {
                shellBuilder.append("echo ").append(projectStructureStep.getStep()).append("\n");
                shellBuilder.append(projectStructureStep.getStep()).append("\n");
            });


            String lastShell = ProjectHelper.SINGLEONE.createDeployShell(strSubstitutor, shellBuilder, params, projectPath, publicBranch, projectId, projectEnv, projectDeployFileRepository, projectStructureStepRepository, true);
            ShellHelper.SINGLEONE.executeShellCommand(log, lastShell);

        };
        return doing.go(log);
    }

    private void projectEnvConfigList(List<ProjectEnvConfig> projectEnvConfigList, List<ProjectEnvConfigDto> projectEnvConfigDtoList) {
        projectEnvConfigList.forEach(projectEnvConfig -> {
            ProjectEnvConfigDto projectEnvConfigDto = new ProjectEnvConfigDto();
            projectEnvConfigDto.setEnv(projectEnvConfig.getEnv());
            List<String> serverMachineIpList = ObjectMapperHelper.SINGLEONE.jsonToListString(objectMapper, projectEnvConfig.getServerMachineIp());
            projectEnvConfigDto.setServerMachineIpList(serverMachineIpList);
            projectEnvConfigDtoList.add(projectEnvConfigDto);
        });
    }

}
