package com.mkfree.deploy.controller;

import com.mkfree.deploy.Routes;
import com.mkfree.deploy.common.BaseController;
import com.mkfree.deploy.common.JsonResult;
import com.mkfree.deploy.common.RestDoing;
import com.mkfree.deploy.repository.ProjectBuildLogRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;

/**
 * Created by oyhk on 2017/2/8.
 */
@RestController
public class ProjectStructureLogController extends BaseController {

    private final Logger log = LoggerFactory.getLogger(ProjectStructureLogController.class);
    @Autowired
    private ProjectBuildLogRepository projectBuildLogRepository;

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
            jsonResult.data = projectBuildLogRepository.findTop10ByProjectIdOrderByCreatedAtDesc(projectId);

        };
        return doing.go(request, log);
    }


    /**
     * @param projectId
     * @param request
     * @return
     */
    @RequestMapping(value = Routes.PROJECT_STRUCTURE_LOG_INFO, method = RequestMethod.GET)
    public JsonResult info(Long projectId, Long seqNo, HttpServletRequest request) {
        RestDoing doing = jsonResult -> {
            if (projectId == null) {
                jsonResult.errorParam("项目id不能为空", log);
                return;
            }
            if (seqNo == null) {
                jsonResult.errorParam("日志序号不能为空", log);
                return;
            }

        };
        return doing.go(request, log);
    }


}
