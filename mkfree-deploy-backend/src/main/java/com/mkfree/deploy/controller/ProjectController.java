package com.mkfree.deploy.controller;

import com.mkfree.deploy.Routes;
import com.mkfree.deploy.common.BaseController;
import com.mkfree.deploy.common.JsonResult;
import com.mkfree.deploy.common.PageResult;
import com.mkfree.deploy.common.RestDoing;
import com.mkfree.deploy.domain.Project;
import com.mkfree.deploy.repository.ProjectRepository;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

/**
 * Created by oyhk on 2017/1/23.
 */
@RestController
public class ProjectController extends BaseController {

    private final Logger log = LoggerFactory.getLogger(UserController.class);

    @Autowired
    private ProjectRepository projectRepository;
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
            project.setName(dto.getName());
            project.setGitUrl(dto.getGitUrl());
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
            this.executeShellCommand("chmod u+x " + resource.getFile().getPath());
            Project project = projectRepository.findOne(dto.getId());
            this.executeShellFile(resource.getFile().getPath(), project.getGitUrl(), project.getLocalPath());
        };
        return doing.go(request, log);
    }

    private void executeShellFile(String... command) {
        try {
            Process process = null;
            process = Runtime.getRuntime().exec(command);
            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
            String s;
            while ((s = reader.readLine()) != null) {
                log.info(s);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }


    }


    private String executeShellCommand(String command) {

        StringBuffer output = new StringBuffer();

        Process p;
        try {
            p = Runtime.getRuntime().exec(command);
            p.waitFor();
            BufferedReader reader = new BufferedReader(new InputStreamReader(p.getInputStream()));

            String line;
            while ((line = reader.readLine()) != null) {
                output.append(line).append("\n");
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        return output.toString();
    }

}
