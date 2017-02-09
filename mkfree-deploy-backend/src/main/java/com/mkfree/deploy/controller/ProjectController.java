package com.mkfree.deploy.controller;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mkfree.deploy.Routes;
import com.mkfree.deploy.common.BaseController;
import com.mkfree.deploy.common.JsonResult;
import com.mkfree.deploy.common.PageResult;
import com.mkfree.deploy.common.RestDoing;
import com.mkfree.deploy.domain.*;
import com.mkfree.deploy.domain.enumclass.ProjectStructureStepType;
import com.mkfree.deploy.dto.ProjectDto;
import com.mkfree.deploy.dto.ProjectEnvConfigDto;
import com.mkfree.deploy.helper.ObjectMapperHelper;
import com.mkfree.deploy.helper.ProjectStructureStepHelper;
import com.mkfree.deploy.helper.ShellHelper;
import com.mkfree.deploy.repository.*;
import com.mkfree.deploy.service.ProjectStructureLogService;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.io.File;
import java.util.ArrayList;
import java.util.List;

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
    private ProjectStructureLogService projectStructureLogSrv;

    @RequestMapping(value = Routes.PROJECT_PAGE, method = RequestMethod.GET)
    public JsonResult page(Integer pageNo, Integer pageSize, HttpServletRequest request) {
        RestDoing doing = jsonResult -> {
            Page page = projectRepository.findAll(this.getPageRequest(pageNo, pageSize));
            jsonResult.data = new PageResult(page, Routes.PROJECT_PAGE);
        };
        return doing.go(request, log);
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

            project = new Project();
            BeanUtils.copyProperties(dto, project);
            project.setDeployTargetFileList(objectMapper.writeValueAsString(dto.getDeployTargetFileList()));

            project = projectRepository.save(project);

            // 项目环境配置
            List<ProjectEnvConfigDto> projectEnvConfigList = dto.getProjectEnvConfigList();
            if (projectEnvConfigList != null) {
                for (ProjectEnvConfigDto projectEnvConfigDto : projectEnvConfigList) {
                    ProjectEnvConfig projectEnvConfig = new ProjectEnvConfig();
                    projectEnvConfig.setEnv(projectEnvConfigDto.getEnv());
                    projectEnvConfig.setProjectId(project.getId());
                    projectEnvConfig.setServerMachineList(objectMapper.writeValueAsString(projectEnvConfigDto.getServerMachineIdList()));
                    projectEnvConfig.setPublicBranch(projectEnvConfigDto.getPublicBranch());
                    projectEnvConfig = projectEnvConfigRepository.save(projectEnvConfig);

                    // 项目构建前命令
                    if (projectEnvConfigDto.getStructureBeforeList() != null) {
                        for (String command : projectEnvConfigDto.getStructureBeforeList()) {
                            projectStructureStepRepository.save(ProjectStructureStepHelper.SINGLEONE.create(command, ProjectStructureStepType.BEFORE, projectEnvConfig.getEnv(), project.getId(), projectEnvConfig.getId()));
                        }
                    }
                    // 项目构建后命令
                    if (projectEnvConfigDto.getStructureAfterList() != null) {
                        for (String command : projectEnvConfigDto.getStructureAfterList()) {
                            projectStructureStepRepository.save(ProjectStructureStepHelper.SINGLEONE.create(command, ProjectStructureStepType.AFTER, projectEnvConfig.getEnv(), project.getId(), projectEnvConfig.getId()));
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

            if (dto.getDeployTargetFileList() != null) {
                project.setDeployTargetFileList(objectMapper.writeValueAsString(dto.getDeployTargetFileList()));
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
                    projectEnvConfig.setServerMachineList(objectMapper.writeValueAsString(projectEnvConfigDto.getServerMachineIdList()));
                    projectEnvConfig.setPublicBranch(projectEnvConfigDto.getPublicBranch());
                    projectEnvConfig = projectEnvConfigRepository.save(projectEnvConfig);


                    // 项目构建前命令
                    if (projectEnvConfigDto.getStructureBeforeList() != null) {

                        List<ProjectStructureStep> projectStructureStepList = projectStructureStepRepository.findByProjectIdAndTypeAndProjectEnvConfigId(project.getId(), ProjectStructureStepType.BEFORE, projectEnvConfig.getId());
                        projectStructureStepRepository.delete(projectStructureStepList);
                        for (String command : projectEnvConfigDto.getStructureBeforeList()) {
                            projectStructureStepRepository.save(ProjectStructureStepHelper.SINGLEONE.create(command, ProjectStructureStepType.BEFORE, projectEnvConfig.getEnv(), project.getId(), projectEnvConfig.getId()));
                        }
                    }
                    // 项目构建后命令
                    if (projectEnvConfigDto.getStructureAfterList() != null) {
                        List<ProjectStructureStep> projectStructureStepList = projectStructureStepRepository.findByProjectIdAndTypeAndProjectEnvConfigId(project.getId(), ProjectStructureStepType.AFTER, projectEnvConfig.getId());
                        projectStructureStepRepository.delete(projectStructureStepList);
                        for (String command : projectEnvConfigDto.getStructureAfterList()) {
                            projectStructureStepRepository.save(ProjectStructureStepHelper.SINGLEONE.create(command, ProjectStructureStepType.AFTER, projectEnvConfig.getEnv(), project.getId(), projectEnvConfig.getId()));
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
            projectDto.setDeployTargetFileList(ObjectMapperHelper.SINGLEONE.jsonToListString(objectMapper, project.getDeployTargetFileList()));
            projectDto.setName(project.getName());
            projectDto.setRemotePath(project.getRemotePath());

            // 项目配置环境
            List<ProjectEnvConfigDto> projectEnvConfigDtoList = new ArrayList<>();
            List<ProjectEnvConfig> projectEnvConfigList = projectEnvConfigRepository.findByProjectId(project.getId());
            for (ProjectEnvConfig projectEnvConfig : projectEnvConfigList) {
                ProjectEnvConfigDto projectEnvConfigDto = new ProjectEnvConfigDto();
                projectEnvConfigDto.setEnv(projectEnvConfig.getEnv());
                projectEnvConfigDto.setServerMachineIdList(ObjectMapperHelper.SINGLEONE.jsonToListLong(objectMapper, projectEnvConfig.getServerMachineList()));
                projectEnvConfigDto.setPublicBranch(projectEnvConfig.getPublicBranch());


                // 项目配置环境构建前步骤
                List<ProjectStructureStep> projectStructureStepBeforeList = projectStructureStepRepository.findByProjectIdAndTypeAndProjectEnvConfigId(project.getId(), ProjectStructureStepType.BEFORE, projectEnvConfig.getId());
                for (ProjectStructureStep projectStructureStep : projectStructureStepBeforeList) {
                    if(projectEnvConfigDto.getStructureBeforeList() == null){
                        projectEnvConfigDto.setStructureBeforeList(new ArrayList<>());
                    }
                    projectEnvConfigDto.getStructureBeforeList().add(projectStructureStep.getStep());
                }

                // 项目配置环境构建后步骤
                List<ProjectStructureStep> projectStructureStepAfterList = projectStructureStepRepository.findByProjectIdAndTypeAndProjectEnvConfigId(project.getId(), ProjectStructureStepType.BEFORE, projectEnvConfig.getId());
                for (ProjectStructureStep projectStructureStep : projectStructureStepAfterList) {
                    if(projectEnvConfigDto.getStructureAfterList() == null){
                        projectEnvConfigDto.setStructureAfterList(new ArrayList<>());
                    }
                    projectEnvConfigDto.getStructureAfterList().add(projectStructureStep.getStep());
                }

                projectEnvConfigDtoList.add(projectEnvConfigDto);
            }
            projectDto.setProjectEnvConfigList(projectEnvConfigDtoList);
            jsonResult.data = projectDto;

        };
        return doing.go(request, log);
    }

    @RequestMapping(value = Routes.PROJECT_STRUCTURE, method = RequestMethod.POST)
    public JsonResult structure(@RequestBody ProjectDto dto, HttpServletRequest request) {
        RestDoing doing = jsonResult -> {
            if (dto.getId() == null) {
                jsonResult.errorParam("id不能为空");
                return;
            }
            if (dto.getEnv() == null) {
                jsonResult.errorParam("发布环境不能为空");
                return;
            }

            String deployShellPath = new File("").getAbsolutePath() + "/src/main/resources/shell/deploy.sh";

//            String deployShellPath = "/Users/oyhk/rockcent/project/mkfree-deploy/mkfree-deploy-backend/src/main/resources/shell/deploy.sh";
            ShellHelper.SINGLEONE.executeShellCommand(log, "chmod u+x " + deployShellPath);
            Project project = projectRepository.findOne(dto.getId());
            SystemConfig systemConfig = systemConfigRepository.findOne(1L);


            Long projectId = project.getId();
            ProjectEnvConfig projectEnvConfig = projectEnvConfigRepository.findByProjectIdAndEnv(projectId, dto.getEnv());
            if (projectEnvConfig == null) {
                jsonResult.remind("发布环境不存在", log);
                return;
            }

            String serverMachineList1 = projectEnvConfig.getServerMachineList();
            if (StringUtils.isBlank(serverMachineList1)) {
                jsonResult.remind("没有配置发布机器", log);
                return;
            }

            List<Long> serverMachineIdList = objectMapper.readValue(projectEnvConfig.getServerMachineList(), new TypeReference<List<Long>>() {
            });
            if (serverMachineIdList == null || serverMachineIdList.size() == 0) {
                jsonResult.remind("没有配置发布机器", log);
                return;
            }

            List<String> deployTargetFileList = objectMapper.readValue(project.getDeployTargetFileList(), new TypeReference<List<String>>() {
            });
            StringBuilder shellDeployTargetFileList = new StringBuilder();
            if (deployTargetFileList.size() > 0) {
                deployTargetFileList.forEach(s -> {
                    shellDeployTargetFileList.append(s).append(";");
                });
                shellDeployTargetFileList.deleteCharAt(shellDeployTargetFileList.length() - 1);
            }


            List<ServerMachine> serverMachineList = serverMachineRepository.findByIdIn(serverMachineIdList);
            for (ServerMachine serverMachine : serverMachineList) {

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
                String result = ShellHelper.SINGLEONE.executeShellFile(log, deployShellPath,
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
                projectStructureLogSrv.add(projectId,result);
                jsonResult.data = result;
            }
        };
        return doing.go(request, log);
    }


}
