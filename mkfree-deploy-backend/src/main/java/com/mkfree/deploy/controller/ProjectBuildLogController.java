package com.mkfree.deploy.controller;

import com.mkfree.deploy.Routes;
import com.mkfree.deploy.common.BaseController;
import com.mkfree.deploy.common.CheckHelper;
import com.mkfree.deploy.common.JsonResult;
import com.mkfree.deploy.common.RestDoing;
import com.mkfree.deploy.domain.Project;
import com.mkfree.deploy.domain.ProjectBuildLog;
import com.mkfree.deploy.repository.ProjectBuildLogRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Created by oyhk on 2017/2/8.
 */
@RestController
public class ProjectBuildLogController extends BaseController {

    private final Logger log = LoggerFactory.getLogger(ProjectBuildLogController.class);
    @Autowired
    private ProjectBuildLogRepository projectBuildLogRepository;

    /**
     * 查询项目的构建历史列表
     *
     * @param projectId 项目名
     * @param request
     * @return
     */
    @RequestMapping(value = Routes.PROJECT_BUILD_LOG_LIST, method = RequestMethod.GET)
    public JsonResult list(Long projectId, HttpServletRequest request) {
        JsonResult jsonResult = new JsonResult();
        CheckHelper.checkNotNull(projectId, "projectId is not null");
        List<ProjectBuildLog> projectBuildLogList = projectBuildLogRepository.findTop10ByProjectIdOrderByCreatedAtDesc(projectId);

        jsonResult.data = projectBuildLogList.stream().map(projectBuildLog -> {
            projectBuildLog.setDescription(null);
            return projectBuildLog;
        }).collect(Collectors.toList());

        return jsonResult;
    }


    /**
     * @param projectId
     * @return
     */
    @RequestMapping(value = Routes.PROJECT_BUILD_LOG_INFO, method = RequestMethod.GET)
    public JsonResult info(Long projectId, Long seqNo) {
        JsonResult jsonResult = new JsonResult();
        CheckHelper.checkNotNull(projectId, "projectId is not null");
        CheckHelper.checkNotNull(seqNo, "seqNo is not null");

        jsonResult.data = projectBuildLogRepository.findByProjectIdAndSeqNo(projectId, seqNo);
        return jsonResult;

    }


}
