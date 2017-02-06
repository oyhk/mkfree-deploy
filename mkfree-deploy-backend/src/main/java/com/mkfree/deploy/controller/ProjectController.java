package com.mkfree.deploy.controller;

import com.mkfree.deploy.Routes;
import com.mkfree.deploy.common.BaseController;
import com.mkfree.deploy.common.JsonResult;
import com.mkfree.deploy.common.PageResult;
import com.mkfree.deploy.common.RestDoing;
import com.mkfree.deploy.domain.*;
import com.mkfree.deploy.domain.enumclass.ProjectStructureStepType;
import com.mkfree.deploy.helper.ShellHelper;
import com.mkfree.deploy.repository.*;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.List;

/**
 *
 * Created by oyhk on 2017/1/23.
 *
 */
@RestController
public class ProjectController extends BaseController {

    private final Logger log = LoggerFactory.getLogger(UserController.class);

    @Autowired
    private ProjectRepository projectRepository;
    @Autowired
    private ProjectServerMachineRepository projectServerMachineRepository;
    @Autowired
    private ServerMachineRepository serverMachineRepository;
    @Autowired
    private ProjectStructureStepRepository projectStructureStepRepository;
    @Autowired
    private SystemConfigRepository systemConfigRepository;
    @Autowired
    private ResourceLoader resourceLoader;

    @RequestMapping(value = Routes.PROJECT_PAGE, method = RequestMethod.GET)
    public JsonResult page(Integer pageNo, Integer pageSize, HttpServletRequest request) {
        RestDoing doing = jsonResult -> {
            Page page = projectRepository.findAll(this.getPageRequest(pageNo, pageSize));
            jsonResult.data = new PageResult(page, Routes.PROJECT_PAGE);
        };
        return doing.go(request, log);
    }

    @RequestMapping(value = Routes.PROJECT_SAVE, method = RequestMethod.POST)
    public JsonResult save(@RequestBody Project dto, HttpServletRequest request) {
        RestDoing doing = jsonResult -> {
            if (StringUtils.isBlank(dto.getName())) {
                jsonResult.errorParam("名称不能为空");
                return;
            }
            if (StringUtils.isBlank(dto.getGitUrl())) {
                jsonResult.errorParam("项目git仓库url不能为空");
                return;
            }
            Project project = new Project();
            BeanUtils.copyProperties(dto, project);






            projectRepository.save(project);
        };
        return doing.go(request, log);
    }

    @RequestMapping(value = Routes.PROJECT_UPDATE, method = RequestMethod.PATCH)
    public JsonResult update(@RequestBody Project dto, HttpServletRequest request) {
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
            if (StringUtils.isNotBlank(dto.getPublishBranch())) {
                project.setPublishBranch(dto.getPublishBranch());
            }
            if (StringUtils.isNotBlank(dto.getRemotePath())) {
                project.setRemotePath(dto.getRemotePath());
            }
            if (StringUtils.isNotBlank(dto.getModuleName())) {
                project.setModuleName(dto.getModuleName());
            }
            if (StringUtils.isNotBlank(dto.getDeployTargetFile())) {
                project.setDeployTargetFile(dto.getDeployTargetFile());
            }
            projectRepository.save(project);
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
            projectRepository.delete(dto.getId());
        };
        return doing.go(request, log);
    }


    @RequestMapping(value = Routes.PROJECT_STRUCTURE, method = RequestMethod.POST)
    public JsonResult structure(@RequestBody Project dto, HttpServletRequest request) {
        RestDoing doing = jsonResult -> {
            if (dto.getId() == null) {
                jsonResult.errorParam("id不能为空");
                return;
            }
            if (dto.getEnv() == null) {
                jsonResult.errorParam("发布环境不能为空");
                return;
            }

            Resource resource = resourceLoader.getResource("classpath:/shell/deploy.sh");

//            String deployShellPath = resource.getFile().getPath();
            String deployShellPath = "/Users/oyhk/rockcent/project/mkfree-deploy/mkfree-deploy-backend/src/main/resources/shell/deploy.sh";
            ShellHelper.SINGLEONE.executeShellCommand(log, "chmod u+x " + deployShellPath);
            Project project = projectRepository.findOne(dto.getId());
            SystemConfig systemConfig = systemConfigRepository.findOne(1L);
            // 当发布分支为空时，默认为master
            if (StringUtils.isBlank(project.getPublishBranch())) {
                project.setPublishBranch("master");
            }

            List<ProjectServerMachine> projectServerMachineList = projectServerMachineRepository.findByProjectId(project.getId());

            if (projectServerMachineList.size() == 0) {
                jsonResult.remind("没有配置发布机器", log);
                return;
            }
            for (ProjectServerMachine projectServerMachine : projectServerMachineList) {

                ServerMachine serverMachine = serverMachineRepository.findOne(projectServerMachine.getServerMachineId());

                // 构建前命令
                List<ProjectStructureStep> projectStructureStepBeforeList = projectStructureStepRepository.findByProjectIdAndType(project.getId(), ProjectStructureStepType.BEFORE);
                StringBuilder projectStructureStepBeforeBuilder = new StringBuilder();
                if (projectStructureStepBeforeList.size() > 0) {
                    projectStructureStepBeforeList.forEach(projectStructureStep -> {
                        projectStructureStepBeforeBuilder.append(projectStructureStep.getStep()).append(";");
                    });
                    projectStructureStepBeforeBuilder.deleteCharAt(projectStructureStepBeforeBuilder.length() - 1);
                }

                // 构建后命令
                List<ProjectStructureStep> projectStructureStepAfterList = projectStructureStepRepository.findByProjectIdAndType(project.getId(), ProjectStructureStepType.AFTER);
                StringBuilder projectStructureStepAfterBuilder = new StringBuilder();
                if (projectStructureStepAfterList.size() > 0) {
                    projectStructureStepAfterList.forEach(projectStructureStep -> {
                        projectStructureStepAfterBuilder.append(projectStructureStep.getStep()).append(";");
                    });
                    projectStructureStepAfterBuilder.deleteCharAt(projectStructureStepAfterBuilder.length() - 1);
                }

                String result = ShellHelper.SINGLEONE.executeShellFile(log, deployShellPath,
                        project.getName(),
                        systemConfig.getProjectPath(),
                        project.getGitUrl(),
                        project.getPublishBranch(),
                        project.getRemotePath(),
                        project.getModuleName(),
                        project.getDeployTargetFile(),
                        serverMachine.getIp(),
                        serverMachine.getUsername(),
                        serverMachine.getPort(),
                        projectStructureStepBeforeBuilder.toString(),
                        projectStructureStepAfterBuilder.toString());
                jsonResult.data = result;
            }
        };
        return doing.go(request, log);
    }


}
