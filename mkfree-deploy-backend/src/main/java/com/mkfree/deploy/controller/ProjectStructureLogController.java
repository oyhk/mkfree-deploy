package com.mkfree.deploy.controller;

import com.mkfree.deploy.Bootstrap;
import com.mkfree.deploy.Routes;
import com.mkfree.deploy.common.BaseController;
import com.mkfree.deploy.common.JsonResult;
import com.mkfree.deploy.common.RestDoing;
import com.mkfree.deploy.domain.ProjectStructureLog;
import com.mkfree.deploy.domain.enumclass.ProjectStructureLogStatus;
import com.mkfree.deploy.helper.ProjectStructureLogHelper;
import com.mkfree.deploy.repository.ProjectStructureLogRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

/**
 * Created by oyhk on 2017/2/8.
 */
@RestController
public class ProjectStructureLogController extends BaseController {

    private final Logger log = LoggerFactory.getLogger(ProjectStructureLogController.class);
    @Autowired
    private ProjectStructureLogRepository projectStructureLogRepository;

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
            jsonResult.data = projectStructureLogRepository.findByProjectId(projectId);

        };
        return doing.go(request, log);
    }


    /**
     * @param projectId
     * @param request
     * @return
     */
    @RequestMapping(value = Routes.PROJECT_STRUCTURE_LOG_INFO, method = RequestMethod.GET)
    public JsonResult info(Long projectId, Long logId, HttpServletRequest request) {
        RestDoing doing = jsonResult -> {
            if (projectId == null) {
                jsonResult.errorParam("项目id不能为空", log);
                return;
            }
            if (logId == null) {
                jsonResult.errorParam("日志id不能为空", log);
                return;
            }
            ProjectStructureLog projectStructureLog = projectStructureLogRepository.findByIdAndProjectId(logId, projectId);
            if (projectStructureLog == null) {
                jsonResult.remind(ProjectStructureLog.REMIND_RECORD_IS_NOT_EXIST);
                return;
            }


            if (projectStructureLog.getStatus() == ProjectStructureLogStatus.PROCESSING) {
                String logKey = ProjectStructureLogHelper.SINGLETONE.getLogKey(projectStructureLog);
                projectStructureLog.setDescription(Bootstrap.logStringBufferMap.get(logKey).toString());
            }
            jsonResult.data = projectStructureLog;

        };
        return doing.go(request, log);
    }


}
