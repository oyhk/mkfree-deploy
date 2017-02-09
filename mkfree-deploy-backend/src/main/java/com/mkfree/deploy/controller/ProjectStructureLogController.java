package com.mkfree.deploy.controller;

import com.mkfree.deploy.Routes;
import com.mkfree.deploy.common.BaseController;
import com.mkfree.deploy.common.JsonResult;
import com.mkfree.deploy.common.RestDoing;
import com.mkfree.deploy.srv.ProjectStructureLogSrv;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

/**
 * Created by zhangjh on 2017/2/8.
 */
@RestController
public class ProjectStructureLogController extends BaseController {

    private final Logger log = LoggerFactory.getLogger(ProjectStructureLogController.class);
    @Autowired
    private ProjectStructureLogSrv projectStructureLogSrv;

    /**
     * 查询项目的构建历史列表
     *
     * @param projectName 项目名
     * @param request
     * @return
     */
    @RequestMapping(value = Routes.PROJECT_STRUCTURE_LOG_LIST, method = RequestMethod.GET)
    public JsonResult page(String projectName, HttpServletRequest request) {
        RestDoing doing = jsonResult -> {
            List list = projectStructureLogSrv.findAll(projectName);
            jsonResult.data = list;
        };
        return doing.go(request, log);
    }


    /**
     * @param projectName
     * @param name
     * @param request
     * @return
     */
    @RequestMapping(value = Routes.PROJECT_STRUCTURE_LOG_LIST, method = RequestMethod.GET)
    public JsonResult page(String projectName, String name, HttpServletRequest request) {
        RestDoing doing = jsonResult -> {
            List list = projectStructureLogSrv.findAll(projectName);
            jsonResult.data = list;
        };
        return doing.go(request, log);
    }


}
