package com.mkfree.deploy.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mkfree.deploy.Bootstrap;
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
import java.util.*;
import java.util.concurrent.ExecutorService;
import java.util.stream.Collectors;
import java.util.stream.Stream;

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
                projectEnvConfigDto.setStructureBeforeList(Collections.singletonList(new ProjectStructureStep()));
                // 项目配置环境构建后步骤
                projectEnvConfigDto.setStructureAfterList(Collections.singletonList(new ProjectStructureStep()));
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
                ProjectStructureLog projectStructureLog = projectStructureLogRepository.findTop1ByProjectIdOrderByIdDesc(project.getId());
                if (null != projectStructureLog) {
                    projectDto.setLastPublishDate(projectStructureLog.getCreatedAt());
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

            SystemConfig systemConfig = systemConfigRepository.findOne(1L);

            project = new Project();
            BeanUtils.copyProperties(dto, project);
            project.setSystemPath(systemConfig.getProjectPath() + "/" + dto.getName());
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
                    if (projectEnvConfigDto.getStructureBeforeList() != null) {
                        for (ProjectStructureStep projectStructureStep : projectEnvConfigDto.getStructureBeforeList()) {
                            projectStructureStepRepository.save(ProjectStructureStepHelper.SINGLEONE.create(projectStructureStep.getStep(), ProjectStructureStepType.BEFORE, projectEnvConfig.getEnv(), project.getId(), project.getName(), projectEnvConfig.getId()));
                        }
                    }
                    // 项目构建后命令
                    if (projectEnvConfigDto.getStructureAfterList() != null) {
                        for (ProjectStructureStep projectStructureStep : projectEnvConfigDto.getStructureAfterList()) {
                            projectStructureStepRepository.save(ProjectStructureStepHelper.SINGLEONE.create(projectStructureStep.getStep(), ProjectStructureStepType.AFTER, projectEnvConfig.getEnv(), project.getId(), project.getName(), projectEnvConfig.getId()));
                        }
                    }
                    // 项目同步后命令
                    if (projectEnvConfigDto.getStructureSyncList() != null) {
                        for (ProjectStructureStep projectStructureStep : projectEnvConfigDto.getStructureSyncList()) {
                            projectStructureStepRepository.save(ProjectStructureStepHelper.SINGLEONE.create(projectStructureStep.getStep(), ProjectStructureStepType.SYNC, projectEnvConfig.getEnv(), project.getId(), project.getName(), projectEnvConfig.getId()));
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
                    if (projectEnvConfigDto.getStructureBeforeList() != null) {

                        List<ProjectStructureStep> projectStructureStepList = projectStructureStepRepository.findByProjectIdAndTypeAndProjectEnvConfigId(project.getId(), ProjectStructureStepType.BEFORE, projectEnvConfig.getId());
                        projectStructureStepRepository.delete(projectStructureStepList);
                        for (ProjectStructureStep projectStructureStep : projectEnvConfigDto.getStructureBeforeList()) {
                            if (StringUtils.isBlank(projectStructureStep.getStep())) {
                                continue;
                            }
                            projectStructureStepRepository.save(ProjectStructureStepHelper.SINGLEONE.create(projectStructureStep.getStep(), ProjectStructureStepType.BEFORE, projectEnvConfig.getEnv(), project.getId(), project.getName(), projectEnvConfig.getId()));
                        }
                    }
                    // 项目构建后命令
                    if (projectEnvConfigDto.getStructureAfterList() != null) {
                        List<ProjectStructureStep> projectStructureStepList = projectStructureStepRepository.findByProjectIdAndTypeAndProjectEnvConfigId(project.getId(), ProjectStructureStepType.AFTER, projectEnvConfig.getId());
                        projectStructureStepRepository.delete(projectStructureStepList);
                        for (ProjectStructureStep projectStructureStep : projectEnvConfigDto.getStructureAfterList()) {
                            if (StringUtils.isBlank(projectStructureStep.getStep())) {
                                continue;
                            }
                            projectStructureStepRepository.save(ProjectStructureStepHelper.SINGLEONE.create(projectStructureStep.getStep(), ProjectStructureStepType.AFTER, projectEnvConfig.getEnv(), project.getId(), project.getName(), projectEnvConfig.getId()));
                        }
                    }
                    // 项目同步后命令
                    if (projectEnvConfigDto.getStructureSyncList() != null) {
                        List<ProjectStructureStep> projectStructureStepList = projectStructureStepRepository.findByProjectIdAndTypeAndProjectEnvConfigId(project.getId(), ProjectStructureStepType.SYNC, projectEnvConfig.getId());
                        projectStructureStepRepository.delete(projectStructureStepList);
                        for (ProjectStructureStep projectStructureStep : projectEnvConfigDto.getStructureSyncList()) {
                            if (StringUtils.isBlank(projectStructureStep.getStep())) {
                                continue;
                            }
                            projectStructureStepRepository.save(ProjectStructureStepHelper.SINGLEONE.create(projectStructureStep.getStep(), ProjectStructureStepType.SYNC, projectEnvConfig.getEnv(), project.getId(), project.getName(), projectEnvConfig.getId()));
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
            List<ProjectStructureStep> projectStructureStepList = projectStructureStepRepository.findByProjectId(dto.getId());
            projectStructureStepRepository.delete(projectStructureStepList);

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
            String projectBranchListSplit = "##########branch_list##########";
            String branchListFile = new File("").getAbsolutePath() + "/src/main/resources/shell/branch_list.sh";
            ShellHelper.SINGLEONE.executeShellCommand(log, "chmod u+x " + branchListFile);
            String result = ShellHelper.SINGLEONE.executeShellFile(log, branchListFile, project.getSystemPath(), projectBranchListSplit);
            log.info("branchList executeShellFile result : {}", result);
            int start = result.indexOf(projectBranchListSplit);
            int end = result.lastIndexOf(projectBranchListSplit);
            String branchListTemp = result.substring(start + 31, end);
            Stream<String> stringStream = Stream.of(branchListTemp.split("remotes/origin/"));
            List<String> branchList = stringStream.filter(s -> !s.contains("master*")).filter(s -> !s.contains("HEAD")).map(String::trim).collect(Collectors.toList());
            branchList.add("release/*");// 如果选这个分支名称，会动态选择最新分支发布版本
            jsonResult.data = branchList;
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
                if (projectEnvConfigDto.getStructureBeforeList() == null) {
                    projectEnvConfigDto.setStructureBeforeList(new ArrayList<>());
                }
                List<ProjectStructureStep> projectStructureStepBeforeList = projectStructureStepRepository.findByProjectIdAndTypeAndProjectEnvConfigId(project.getId(), ProjectStructureStepType.BEFORE, projectEnvConfig.getId());
                for (ProjectStructureStep projectStructureStep : projectStructureStepBeforeList) {
                    projectEnvConfigDto.getStructureBeforeList().add(projectStructureStep);
                }
                // 环境没有添加时，默认添加
                if (projectEnvConfigDto.getStructureBeforeList().size() == 0) {
                    projectEnvConfigDto.getStructureBeforeList().add(new ProjectStructureStep());
                }


                // 项目配置环境构建后步骤
                if (projectEnvConfigDto.getStructureAfterList() == null) {
                    projectEnvConfigDto.setStructureAfterList(new ArrayList<>());
                }
                List<ProjectStructureStep> projectStructureStepAfterList = projectStructureStepRepository.findByProjectIdAndTypeAndProjectEnvConfigId(project.getId(), ProjectStructureStepType.AFTER, projectEnvConfig.getId());
                for (ProjectStructureStep projectStructureStep : projectStructureStepAfterList) {
                    projectEnvConfigDto.getStructureAfterList().add(projectStructureStep);
                }
                // 环境没有添加时，默认添加
                if (projectEnvConfigDto.getStructureAfterList().size() == 0) {
                    projectEnvConfigDto.getStructureAfterList().add(new ProjectStructureStep());
                }

                // 项目配置环境构建后步骤
                if (projectEnvConfigDto.getStructureSyncList() == null) {
                    projectEnvConfigDto.setStructureSyncList(new ArrayList<>());
                }
                List<ProjectStructureStep> projectStructureSyncList = projectStructureStepRepository.findByProjectIdAndTypeAndProjectEnvConfigId(project.getId(), ProjectStructureStepType.SYNC, projectEnvConfig.getId());
                for (ProjectStructureStep projectStructureStep : projectStructureSyncList) {
                    projectEnvConfigDto.getStructureSyncList().add(projectStructureStep);
                }
                // 环境没有添加时，默认添加
                if (projectEnvConfigDto.getStructureSyncList().size() == 0) {
                    projectEnvConfigDto.getStructureSyncList().add(new ProjectStructureStep());
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
            Long id = dto.getId();
            if (id == null) {
                jsonResult.errorParam(Project.CHECK_IDENTIFIER_IS_NOT_NULL);
                return;
            }

            log.info("project sync >> start");
            Project project = projectRepository.findOne(id);
            ServerMachine serverMachine = serverMachineRepository.findByIp(dto.getServerMachineIp());

            SystemConfig systemConfig = systemConfigRepository.findOne(1L);
            List<ProjectDeployFile> projectDeployFileList = projectDeployFileRepository.findByProjectIdAndIsEnable(id, true);
            projectDeployFileList.forEach(projectDeployFile -> {
                String filePath = String.format("%s/%s/%s", systemConfig.getProjectPath(), project.getName(), projectDeployFile.getLocalFilePath());
                String command = String.format("scp -P %s -r %s %s@%s:%s", serverMachine.getPort(), filePath, serverMachine.getUsername(), serverMachine.getIp(), project.getRemotePath() + "/" + projectDeployFile.getRemoteFilePath());
                log.info("project sync >> command : {}", command);
                ShellHelper.SINGLEONE.executeShellCommand(log, command);
            });

            ShellHelper.SINGLEONE.executeShellCommand(log, String.format("ssh -p %s -t %s@%s \"%s\"", serverMachine.getPort(), serverMachine.getUsername(), serverMachine.getIp(), "tree -a /mnt/usr/project/antbox-common-api"));


            // 找出同步后需要执行的命令
            List<ProjectStructureStep> projectStructureStepList = projectStructureStepRepository.findByProjectIdAndType(project.getId(), ProjectStructureStepType.SYNC);
            projectStructureStepList.forEach(projectStructureStep -> {
                String stepCommand = String.format("ssh -p %s -t %s@%s \"%s\"", serverMachine.getPort(), serverMachine.getUsername(), serverMachine.getIp(), projectStructureStep.getStep());
                log.info("project sync >> command : {}", stepCommand);
                ShellHelper.SINGLEONE.executeShellCommand(log, stepCommand);
            });

            log.info("project sync >> success");

        };
        return doing.go(userDto, request, objectMapper, log);
    }

    @Transactional
    @RequestMapping(value = Routes.PROJECT_STRUCTURE, method = RequestMethod.POST)
    public JsonResult structure(@RequestBody ProjectDto dto, HttpServletRequest request) {

        UserDto userDto = UserHelper.SINGLEONE.getSession(request);

        RestDoing doing = jsonResult -> {
            if (dto.getId() == null) {
                jsonResult.errorParam("id不能为空");
                return;
            }
            if (dto.getEnv() == null) {
                jsonResult.errorParam("发布环境不能为空");
                return;
            }
            // 需要发布的机器ip
            String publicServerMachineIp = dto.getServerMachineIp();
            if (StringUtils.isBlank(publicServerMachineIp)) {
                jsonResult.errorParam("发布机器ip不能为空", log);
                return;
            }

            if (userDto.getRoleType() != RoleType.ADMIN) {
                long count = userDto.getUserProjectPermissionList().stream().filter(userProjectPermissionDto -> Objects.equals(userProjectPermissionDto.getProjectId(), dto.getId())).filter(userProjectPermissionDto -> userProjectPermissionDto.getProjectEnv().contains(dto.getEnv())).count();
                if (count == 0) {
                    jsonResult.custom("10021", "没有此项目发布权限", log);
                    return;
                }
            }

            String deployShellPath = new File("").getAbsolutePath() + "/src/main/resources/shell/deploy.sh";

            ShellHelper.SINGLEONE.executeShellCommand(log, "chmod u+x " + deployShellPath);
            Project project = projectRepository.findOne(dto.getId());
            SystemConfig systemConfig = systemConfigRepository.findOne(1L);


            Long projectId = project.getId();
            ProjectEnvConfig projectEnvConfig = projectEnvConfigRepository.findByProjectIdAndEnv(projectId, dto.getEnv());
            if (projectEnvConfig == null) {
                jsonResult.remind("发布环境不存在", log);
                return;
            }


            // 部署目标模块文件或者目录
            List<ProjectDeployFile> projectDeployFileList = projectDeployFileRepository.findByProjectIdAndIsEnable(projectId, true);

            StringBuilder shellDeployTargetFileList = new StringBuilder();
            if (projectDeployFileList.size() > 0) {
                projectDeployFileList.forEach(projectDeployFile -> {
                    shellDeployTargetFileList.append(projectDeployFile.getLocalFilePath()).append(",").append(projectDeployFile.getRemoteFilePath()).append(";");
                });
                shellDeployTargetFileList.deleteCharAt(shellDeployTargetFileList.length() - 1);
            }


            // 异步线程构建发布项目
            commonExecutorService.execute(() -> {
                ServerMachine serverMachine = serverMachineRepository.findByIp(publicServerMachineIp);

                //构建前命令
                List<ProjectStructureStep> projectStructureStepBeforeList = projectStructureStepRepository.findByProjectIdAndTypeAndProjectEnvConfigId(projectId, ProjectStructureStepType.BEFORE, projectEnvConfig.getId());
                StringBuilder projectStructureStepBeforeBuilder = new StringBuilder();
                if (projectStructureStepBeforeList.size() > 0) {
                    projectStructureStepBeforeList.forEach(projectStructureStep -> {
                        projectStructureStepBeforeBuilder.append(projectStructureStep.getStep()).append(";");
                    });
                    projectStructureStepBeforeBuilder.deleteCharAt(projectStructureStepBeforeBuilder.length() - 1);
                }

                // 构建后命令
                List<ProjectStructureStep> projectStructureStepAfterList = projectStructureStepRepository.findByProjectIdAndTypeAndProjectEnvConfigId(projectId, ProjectStructureStepType.AFTER, projectEnvConfig.getId());
                StringBuilder projectStructureStepAfterBuilder = new StringBuilder();
                if (projectStructureStepAfterList.size() > 0) {
                    projectStructureStepAfterList.forEach(projectStructureStep -> {
                        projectStructureStepAfterBuilder.append(projectStructureStep.getStep()).append(";");
                    });
                    projectStructureStepAfterBuilder.deleteCharAt(projectStructureStepAfterBuilder.length() - 1);
                }

                String projectName = project.getName();
                String systemConfigProjectPath = systemConfig.getProjectPath();
                String projectGitUrl = project.getGitUrl();
                String projectEnvConfigPublicBranch = projectEnvConfig.getPublicBranch();
                String remotePath = project.getRemotePath();
                String moduleName = project.getModuleName();

                ProjectStructureLog projectStructureLog = projectStructureLogRepository.findTop1ByProjectIdOrderByIdDesc(projectId);
                Long nextSeqNo = ProjectStructureLogHelper.SINGLETONE.getNextSeqNo(projectStructureLog);

                // 保存构建日志
                ProjectStructureLog newLog = new ProjectStructureLog();
                newLog.setName("#" + nextSeqNo);
                newLog.setProjectId(projectId);
                newLog.setSeqNo(nextSeqNo);
                newLog.setProjectName(projectName);
                newLog = projectStructureLogRepository.save(newLog);

                //
                String logMapKey = project.getName() + "#" + newLog.getSeqNo();

                Bootstrap.logStringBufferMap.put(logMapKey, new StringBuffer());
                Bootstrap.logQueueMap.put(logMapKey, new LinkedList<>());

                // 异步线程向客户端推送构建中日志
                ProjectStructureLog finalNewLog = newLog;
                commonExecutorService.execute(() -> {
                    log.info("push structure log start ...");
                    Date date = new Date();
                    boolean isFailUpdate = false; //是否失败更新日志状态
                    boolean isSuccess = false; //构建成功
                    boolean isFail = false; //构建失败

                    // 无论成功 还是 失败 最终都会构建完成
                    boolean isProcessed = false; // 构建完成

                    while (true) {
                        Date currentDate = new Date();
                        // 当构建时间超过5分钟构建线程就结束
                        if (currentDate.getTime() - date.getTime() > 5 * 60 * 1000) {
                            log.info("push structure log end ...");
                            isProcessed = true;
                        }

                        try {
                            Thread.sleep(1000);
                        } catch (InterruptedException e) {
                            e.printStackTrace();
                        }

                        if (Bootstrap.logQueueMap.get(logMapKey).size() > 0) {
                            while (true) {
                                String value = Bootstrap.logQueueMap.get(logMapKey).poll();
                                log.info(value);
                                if (value.contains("deploy success")) {
                                    isSuccess = true;
                                    isProcessed = true;
                                } else if (value.contains("ERROR")) {
                                    isFail = true;
                                }
                                if (Bootstrap.logQueueMap.get(logMapKey).size() == 0) {
                                    break;
                                }
                            }
                        }

                        if (isSuccess) {
                            ProjectStructureLog updateProjectStructureLog = projectStructureLogRepository.findOne(finalNewLog.getId());
                            updateProjectStructureLog.setStatus(ProjectStructureLogStatus.SUCCESS);
                            projectStructureLogRepository.save(updateProjectStructureLog);
                        }
                        if (isFail && !isFailUpdate) {
                            ProjectStructureLog updateProjectStructureLog = projectStructureLogRepository.findOne(finalNewLog.getId());
                            updateProjectStructureLog.setStatus(ProjectStructureLogStatus.FAIL);
                            projectStructureLogRepository.save(updateProjectStructureLog);
                            isFailUpdate = true;
                        }

                        if (isProcessed) {
                            ProjectStructureLog updateProjectStructureLog = projectStructureLogRepository.findOne(finalNewLog.getId());
                            updateProjectStructureLog.setDescription(Bootstrap.logStringBufferMap.get(logMapKey).toString());
                            projectStructureLogRepository.save(updateProjectStructureLog);
                            break;
                        }

                    }
                });

                if (moduleName == null) {
                    moduleName = "";
                }
                ShellHelper.SINGLEONE.buildProjectExecuteShellFile(log, logMapKey, deployShellPath,
                        projectName,
                        systemConfigProjectPath,
                        projectGitUrl,
                        projectEnvConfigPublicBranch,
                        remotePath,
                        moduleName,
                        shellDeployTargetFileList.toString(),
                        serverMachine.getIp(),
                        serverMachine.getUsername(),
                        serverMachine.getPort(),
                        projectStructureStepBeforeBuilder.toString(),
                        projectStructureStepAfterBuilder.toString());


            });

        };
        return doing.go(dto, userDto, request, objectMapper, log);
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
