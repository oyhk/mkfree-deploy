package com.mkfree.deploy.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mkfree.deploy.Config;
import com.mkfree.deploy.Routes;
import com.mkfree.deploy.common.*;
import com.mkfree.deploy.domain.*;
import com.mkfree.deploy.domain.enumclass.*;
import com.mkfree.deploy.dto.*;
import com.mkfree.deploy.helper.*;
import com.mkfree.deploy.repository.*;
import org.apache.commons.io.FileUtils;
import org.apache.commons.lang3.StringUtils;
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

    @GetMapping(value = Routes.PROJECT_INIT_GIT)
    public JsonResult initGit(ProjectDto dto, HttpServletRequest request) {
        RestDoing doing = jsonResult -> {

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
            File devProject = new File(projectPath + "/DEV");
            File testProject = new File(projectPath + "/TEST");
            File uatProject = new File(projectPath + "/UAT");
            File preprodProject = new File(projectPath + "/PREPROD");
            File prodProject = new File(projectPath + "/PROD");
            FileUtils.copyDirectory(defaultProject, devProject);
            FileUtils.copyDirectory(defaultProject, testProject);
            FileUtils.copyDirectory(defaultProject, uatProject);
            FileUtils.copyDirectory(defaultProject, preprodProject);
            FileUtils.copyDirectory(defaultProject, prodProject);

        };
        return doing.go(request, log);
    }

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
    public JsonResult page(Integer pageNo, Integer pageSize, String projectTagId, HttpServletRequest request) {
        UserDto userDto = UserHelper.SINGLEONE.getSession(request);

        // 首先把用户可发布的项目权限分组
        Map<Long, UserProjectPermissionDto> userProjectPermissionDtoMap = userDto.getUserProjectPermissionList().stream().collect(Collectors.toMap(UserProjectPermissionDto::getProjectId, userProjectPermissionDto -> userProjectPermissionDto));


        List<ServerMachine> serverMachineList = serverMachineRepository.findAll();
        Map<String, ServerMachine> serverMachineMap = serverMachineList.stream().collect(Collectors.toMap(ServerMachine::getIp, o -> o));

        RestDoing doing = (JsonResult jsonResult) -> {
            Page<Project> page;
            if (StringUtils.isBlank(projectTagId) || projectTagId.equals("ALL")) {
                page = projectRepository.findAll(this.getPageRequest(pageNo, 100000, Sort.Direction.DESC, "name"));
            } else {
                page = projectRepository.findByProjectTagId(this.getPageRequest(pageNo, 100000, Sort.Direction.DESC, "name"), Long.valueOf(projectTagId));
            }

            List<ProjectAntTableDto> projectAntTableDtoList = new ArrayList<>();

            // 表格 项目名称合并 rowSpan
            HashMap<Long, Integer> projectNameAntTableRowSpanMap = new HashMap<>();
            // 表格 项目环境合并 rowSpan
            HashMap<String, Integer> projectEnvAntTableRowSpanMap = new HashMap<>();

            page.forEach(project -> {
                Long projectId = project.getId();
                projectNameAntTableRowSpanMap.put(projectId, 0);
                // 查询对应项目的部署环境
                List<ProjectEnvConfig> projectEnvConfigList = projectEnvConfigRepository.findByProjectId(project.getId());
                // 暂时这样做权限控制
                if (!userDto.getUsername().equals("oyhk")) {
                    projectEnvConfigList = projectEnvConfigList.stream().filter(projectEnvConfig -> projectEnvConfig.getEnv() != ProjectEnv.PROD).collect(Collectors.toList());
                }

                projectEnvConfigList.forEach(projectEnvConfig -> {
                    List<String> serverMachineIpList = ObjectMapperHelper.SINGLE.jsonToListString(objectMapper, projectEnvConfig.getServerMachineIp());
                    if (serverMachineIpList != null && serverMachineIpList.size() > 0) {
                        int ipSize = serverMachineIpList.size();
                        projectEnvAntTableRowSpanMap.put(projectId + projectEnvConfig.getEnv().toString(), ipSize);

                        Integer projectNameAntTableRowSpan = projectNameAntTableRowSpanMap.get(projectId);
                        projectNameAntTableRowSpanMap.put(projectId, projectNameAntTableRowSpan + ipSize);
                        serverMachineIpList.forEach(ip -> {


                            ProjectAntTableDto projectAntTableDto = new ProjectAntTableDto();
                            projectAntTableDto.setBranchList(project.getBranchList());
                            projectAntTableDto.setName(project.getName());
                            projectAntTableDto.setId(project.getId());
                            projectAntTableDto.setBranchList(project.getBranchList());
                            projectAntTableDto.setProjectNameAntTableRowSpan(0);
                            projectAntTableDto.setProjectEnvAntTableRowSpan(0);
                            projectAntTableDto.setProjectEnv(projectEnvConfig.getEnv());

                            projectAntTableDto.setIp(ip);
                            ServerMachine serverMachine = serverMachineMap.get(ip);
                            if (serverMachine != null) {
                                projectAntTableDto.setPublish(serverMachine.getPublish());
                            }

                            projectAntTableDtoList.add(projectAntTableDto);
                        });
                    }
                });

            });

            final Long[] prevProjectId = new Long[]{0L};
            final String[] prevProjectEnv = new String[]{"0env"};
            projectAntTableDtoList.forEach(projectAntTableDto -> {

                Long projectId = projectAntTableDto.getId();
                ProjectEnv projectEnv = projectAntTableDto.getProjectEnv();

                // 项目名称rowSpan 合并单元格
                Integer projectNameAntTableRowSpan = projectNameAntTableRowSpanMap.get(projectAntTableDto.getId());
                // 项目环境rowSpan 合并单元格
                Integer projectEnvAntTableRowSpan = projectEnvAntTableRowSpanMap.get(projectAntTableDto.getId() + projectEnv.toString());
                if (prevProjectId[0] == 0L) {
                    prevProjectId[0] = projectAntTableDto.getId();
                    projectAntTableDto.setProjectNameAntTableRowSpan(projectNameAntTableRowSpan);
                }
                if (!Objects.equals(prevProjectId[0], projectAntTableDto.getId())) {
                    projectAntTableDto.setProjectNameAntTableRowSpan(projectNameAntTableRowSpan);
                    prevProjectId[0] = projectAntTableDto.getId();
                }

                if (prevProjectEnv[0].equals("0env")) {
                    prevProjectEnv[0] = projectAntTableDto.getId() + projectEnv.toString();
                    projectAntTableDto.setProjectEnvAntTableRowSpan(projectEnvAntTableRowSpan);
                }
                if (!prevProjectEnv[0].equals(projectAntTableDto.getId() + projectEnv.toString())) {
                    projectAntTableDto.setProjectEnvAntTableRowSpan(projectEnvAntTableRowSpan);
                    prevProjectEnv[0] = projectAntTableDto.getId() + projectEnv.toString();
                }
                ProjectBuildLog projectBuildLog;
                // 最新发布时间
                if (projectAntTableDto.getPublish() != null && projectAntTableDto.getPublish()) {
                    projectBuildLog = projectBuildLogRepository.findTop1ByProjectIdAndBuildTypeAndProjectEnvOrderByCreatedAtDesc(projectId, ProjectBuildType.BUILD, projectEnv);
                } else {
                    projectBuildLog = projectBuildLogRepository.findTop1ByProjectIdAndBuildTypeAndProjectEnvOrderByCreatedAtDesc(projectId, ProjectBuildType.SYNC, projectEnv);
                }
                if (projectBuildLog != null) {
                    projectAntTableDto.setPublishTime(projectBuildLog.getCreatedAt());
                    projectAntTableDto.setPublishVersion(projectBuildLog.getBuildVersion());
                }
            });


            jsonResult.data = new PageResult<>(page.getNumber(), page.getSize(), page.getTotalElements(), projectAntTableDtoList, Routes.PROJECT_PAGE);
        };
        return doing.go(request, objectMapper, log);
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
                            projectBuildStepRepository.save(ProjectStructureStepHelper.SINGLEONE.create(projectStructureStep.getStep(), ProjectBuildStepType.BEFORE, projectEnvConfig.getEnv(), project.getId(), project.getName(), projectEnvConfig.getId()));
                        }
                    }
                    // 项目构建后命令
                    if (projectEnvConfigDto.getBuildAfterList() != null) {
                        for (ProjectBuildStep projectStructureStep : projectEnvConfigDto.getBuildAfterList()) {
                            projectBuildStepRepository.save(ProjectStructureStepHelper.SINGLEONE.create(projectStructureStep.getStep(), ProjectBuildStepType.AFTER, projectEnvConfig.getEnv(), project.getId(), project.getName(), projectEnvConfig.getId()));
                        }
                    }
                    // 项目同步后命令
                    if (projectEnvConfigDto.getBuildSyncList() != null) {
                        for (ProjectBuildStep projectStructureStep : projectEnvConfigDto.getBuildSyncList()) {
                            projectBuildStepRepository.save(ProjectStructureStepHelper.SINGLEONE.create(projectStructureStep.getStep(), ProjectBuildStepType.SYNC, projectEnvConfig.getEnv(), project.getId(), project.getName(), projectEnvConfig.getId()));
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

                        List<ProjectBuildStep> projectBuildStepList = projectBuildStepRepository.findByProjectIdAndTypeAndProjectEnvConfigId(project.getId(), ProjectBuildStepType.BEFORE, projectEnvConfig.getId());
                        projectBuildStepRepository.delete(projectBuildStepList);
                        for (ProjectBuildStep projectStructureStep : projectEnvConfigDto.getBuildBeforeList()) {
                            if (StringUtils.isBlank(projectStructureStep.getStep())) {
                                continue;
                            }
                            projectBuildStepRepository.save(ProjectStructureStepHelper.SINGLEONE.create(projectStructureStep.getStep(), ProjectBuildStepType.BEFORE, projectEnvConfig.getEnv(), project.getId(), project.getName(), projectEnvConfig.getId()));
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
                            projectBuildStepRepository.save(ProjectStructureStepHelper.SINGLEONE.create(projectStructureStep.getStep(), ProjectBuildStepType.AFTER, projectEnvConfig.getEnv(), project.getId(), project.getName(), projectEnvConfig.getId()));
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
                            projectBuildStepRepository.save(ProjectStructureStepHelper.SINGLEONE.create(projectStructureStep.getStep(), ProjectBuildStepType.SYNC, projectEnvConfig.getEnv(), project.getId(), project.getName(), projectEnvConfig.getId()));
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
            List<ProjectBuildStep> projectBuildStepList = projectBuildStepRepository.findByProjectId(dto.getId());
            projectBuildStepRepository.delete(projectBuildStepList);

            // 删除各个环境配置
            List<ProjectEnvConfig> projectEnvConfigList = projectEnvConfigRepository.findByProjectId(dto.getId());
            projectEnvConfigRepository.delete(projectEnvConfigList);

            // 删除项目基本信息
            projectRepository.delete(dto.getId());
        };
        return doing.go(request, log);
    }

    @RequestMapping(value = Routes.PROJECT_BRANCH_REFRESH, method = RequestMethod.GET)
    public JsonResult branchRefresh(Long id, HttpServletRequest request) {
        RestDoing doing = jsonResult -> {
            if (id == null) {
                jsonResult.errorParam(Project.CHECK_ID_IS_NOT_NULL);
                return;
            }
            Project project = projectRepository.findOne(id);
            if (project == null) {
                jsonResult.remind(Project.REMIND_RECORD_IS_NOT_EXIST);
                return;
            }
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
        };
        return doing.go(request, objectMapper, log);
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
                ProjectEnvConfigDto projectEnvConfigDto = new ProjectEnvConfigDto();
                projectEnvConfigDto.setEnv(projectEnvConfig.getEnv());
                projectEnvConfigDto.setServerMachineIpList(ObjectMapperHelper.SINGLE.jsonToListString(objectMapper, projectEnvConfig.getServerMachineIp()));
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
        UserDto userDto = UserHelper.SINGLEONE.getSession(request);
        RestDoing doing = jsonResult -> {
            Long projectId = dto.getId();
            ProjectEnv projectEnv = dto.getEnv();
            String publicServerMachineIp = dto.getServerMachineIp();
            if (projectId == null) {
                jsonResult.errorParam(Project.CHECK_ID_IS_NOT_NULL);
                return;
            }

            Project project = projectRepository.findOne(projectId);
            ServerMachine serverMachine = serverMachineRepository.findByIp(publicServerMachineIp);

            SystemConfig systemConfig = systemConfigRepository.findByKey(SystemConfig.keyProjectPath);
            SystemConfig buildPathSystemConfig = systemConfigRepository.findByKey(SystemConfig.keyBuildPath);


            ProjectEnvConfig projectEnvConfig = projectEnvConfigRepository.findByProjectIdAndEnv(projectId, projectEnv);
            if (projectEnvConfig == null) {
                jsonResult.remind("发布环境不存在", log);
                return;
            }

            String projectPath = systemConfig.getValue() + File.separator + project.getName();

            Map<String, String> params = new HashMap<>();
            StringBuilder shellBuilder = new StringBuilder();
            StrSubstitutor strSubstitutor = new StrSubstitutor(params, "#{", "}");

            // 公共参数
            params.put("port", serverMachine.getPort());
            params.put("username", serverMachine.getUsername());
            params.put("ip", serverMachine.getIp());
            params.put("env", projectEnv.toString());


            String publicBranch = projectEnvConfig.getPublicBranch();
            params.put("publicBranch", publicBranch);

            // 1. cd 项目路劲
            shellBuilder.append("echo cd #{projectPath}").append("\n");
            shellBuilder.append("cd #{projectPath}").append("\n");
            params.put("projectPath", projectPath);
            params.put("remoteProjectPath", project.getRemotePath());

            // 2. 查询项目相同环境最新发布版本
            ProjectBuildLog projectBuildLog = projectBuildLogRepository.findTop1ByProjectIdAndBuildTypeAndProjectEnvOrderByCreatedAtDesc(projectId, ProjectBuildType.BUILD, projectEnv);
            String projectVersionDir = projectBuildLog.getBuildVersion();
            params.put("projectVersionDir", projectVersionDir);

            String buildPath = buildPathSystemConfig.getValue() + File.separator + project.getName();
            params.put("buildPath", buildPath);


            // 9. 远程服务器: 创建标准目录结构
            shellBuilder.append("echo ssh -p #{port} #{username}@#{ip} ").append("mkdir -p #{remoteProjectPath}/version").append("\n");
            shellBuilder.append("ssh -p #{port} #{username}@#{ip} ").append("'").append("mkdir -p #{remoteProjectPath}/version").append("'").append("\n");

            // 10. 远程服务器: 上传版本文件
            shellBuilder.append("echo scp -P #{port} -r #{buildPath}/#{env}/version/#{projectVersionDir}  #{username}@#{ip}:#{remoteProjectPath}/version").append("\n");
            shellBuilder.append("scp -P #{port} -r #{buildPath}/#{env}/version/#{projectVersionDir}  #{username}@#{ip}:#{remoteProjectPath}/version").append("\n");

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
            List<ProjectBuildStep> afterProjectBuildStepList = projectBuildStepRepository.findByProjectIdAndTypeAndEnv(projectId, ProjectBuildStepType.SYNC, projectEnv);
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
            projectBuildLogNew.setProjectEnv(projectEnv);
            projectBuildLogRepository.save(projectBuildLogNew);


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
            String publishBranch = dto.getPublishBranch();

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

            Shell shell = new Shell();
            // 公共参数
            shell.addParams("port", serverMachine.getPort());
            shell.addParams("username", serverMachine.getUsername());
            shell.addParams("ip", serverMachine.getIp());
            shell.addParams("env", projectEnv.toString());
            // 指定分支发布
            if (StringUtils.isBlank(publishBranch)) {
                publishBranch = projectEnvConfig.getPublicBranch();
            }
            shell.addParams("publicBranch", publishBranch);
            String remoteProjectPath = project.getRemotePath();
            shell.addParams("remoteProjectPath", remoteProjectPath);


            // 1. cd 项目路劲
            String projectPath = systemConfig.getValue() + File.separator + project.getName();
            shell.appendN("echo 'cd #{projectPath}/#{env}'");
            shell.appendN("cd #{projectPath}/#{env}");
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
            List<ProjectBuildStep> beforeProjectBuildStepList = projectBuildStepRepository.findByProjectIdAndTypeAndEnv(projectId, ProjectBuildStepType.BEFORE, projectEnv);
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
            shell.appendN("echo 'mkdir -p #{buildPath}/#{env}/version/#{projectVersionDir}'");
            shell.appendN("mkdir -p #{buildPath}/#{env}/version/#{projectVersionDir}");
            shell.addParams("projectVersionDir", projectVersionDir);


            // 7. 把构建好的文件 并且 是需要上传的文件 copy到版本文件夹中
            List<ProjectDeployFile> projectDeployFileList = projectDeployFileRepository.findByProjectId(projectId);
            for (int i = 0; i < projectDeployFileList.size(); i++) {
                ProjectDeployFile projectDeployFile = projectDeployFileList.get(i);
                shell.appendN("echo 'cp -r #{projectPath}/#{env}/#{projectDeployFileLocalFilePath" + i + "} #{buildPath}/#{env}/version/#{projectVersionDir}/#{projectDeployFileRemoteFilePath" + i + "}'");
                shell.appendN("cp -r #{projectPath}/#{env}/#{projectDeployFileLocalFilePath" + i + "} #{buildPath}/#{env}/version/#{projectVersionDir}/#{projectDeployFileRemoteFilePath" + i + "}");
                shell.addParams("projectDeployFileLocalFilePath" + i, projectDeployFile.getLocalFilePath());
                shell.addParams("projectDeployFileRemoteFilePath" + i, projectDeployFile.getRemoteFilePath());
            }

            // 8. 创建本地最新版本软连接
            shell.appendN("cd #{buildPath}/#{env}");
            shell.appendN("echo 'ln -sf #{buildPath}/#{env}/current'");
            shell.appendN("ln -sf #{buildPath}/#{env}/current");
            shell.appendN("echo 'rm -rf #{buildPath}/#{env}/current'");
            shell.appendN("rm -rf #{buildPath}/#{env}/current");
            shell.appendN("echo 'ln -s #{buildPath}/#{env}/version/#{projectVersionDir} #{buildPath}/#{env}/current'");
            shell.appendN("ln -s #{buildPath}/#{env}/version/#{projectVersionDir} #{buildPath}/#{env}/current");

            // 9. 远程服务器: 创建标准目录结构
            shell.appendN("echo 'ssh -p #{port} #{username}@#{ip} mkdir -p #{remoteProjectPath}/version'");
            shell.appendN("ssh -p #{port} #{username}@#{ip} 'mkdir -p #{remoteProjectPath}/version'");

            // 10. 远程服务器: 上传版本文件
            shell.appendN("echo 'scp -P #{port} -r #{buildPath}/#{env}/version/#{projectVersionDir}  #{username}@#{ip}:#{remoteProjectPath}/version'");
            shell.appendN("scp -P #{port} -r #{buildPath}/#{env}/version/#{projectVersionDir}  #{username}@#{ip}:#{remoteProjectPath}/version");

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
            List<ProjectBuildStep> afterProjectBuildStepList = projectBuildStepRepository.findByProjectIdAndTypeAndEnv(projectId, ProjectBuildStepType.AFTER, projectEnv);
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
            projectBuildLog.setProjectEnv(projectEnv);
            projectBuildLogRepository.save(projectBuildLog);

        };
        return doing.go(log);
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

    private void projectEnvConfigList(List<ProjectEnvConfig> projectEnvConfigList, List<ProjectEnvConfigDto> projectEnvConfigDtoList) {
        projectEnvConfigList.forEach(projectEnvConfig -> {
            ProjectEnvConfigDto projectEnvConfigDto = new ProjectEnvConfigDto();
            projectEnvConfigDto.setEnv(projectEnvConfig.getEnv());
            List<String> serverMachineIpList = ObjectMapperHelper.SINGLE.jsonToListString(objectMapper, projectEnvConfig.getServerMachineIp());
            projectEnvConfigDto.setServerMachineIpList(serverMachineIpList);
            projectEnvConfigDtoList.add(projectEnvConfigDto);
        });
    }

}
