package com.mkfree.deploy.controller;

import com.mkfree.deploy.Routes;
import com.mkfree.deploy.common.BaseController;
import com.mkfree.deploy.common.JsonResult;
import com.mkfree.deploy.common.RestDoing;
import com.mkfree.deploy.domain.ProjectStructureLog;
import com.mkfree.deploy.service.ProjectStructureLogService;
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
    private ProjectStructureLogService projectStructureLogSrv;

    /**
     * 查询项目的构建历史列表
     *
     * @param projectId 项目名
     * @param request
     * @return
     */
    @RequestMapping(value = Routes.PROJECT_STRUCTURE_LOG_LIST, method = RequestMethod.GET)
    public JsonResult list(Long projectId, HttpServletRequest request) {


        RestDoing doing = jsonResult -> {
            if (projectId == null) {
                jsonResult.remind("项目id为空", log);
                return;
            }
            List list = projectStructureLogSrv.findAll(projectId);
            jsonResult.data = list;
        };
        return doing.go(request, log);
    }


    /**
     * @param projectId
     * @param name
     * @param request
     * @return
     */
    @RequestMapping(value = Routes.PROJECT_STRUCTURE_LOG_INFO, method = RequestMethod.GET)
    public JsonResult info(Long projectId, String name, HttpServletRequest request) {
        RestDoing doing = jsonResult -> {
            if (projectId == null) {
                jsonResult.remind("项目id为空", log);
                return;
            }
            ProjectStructureLog info = projectStructureLogSrv.info(projectId, name);
            jsonResult.data = info;
        };
        return doing.go(request, log);
    }


}
