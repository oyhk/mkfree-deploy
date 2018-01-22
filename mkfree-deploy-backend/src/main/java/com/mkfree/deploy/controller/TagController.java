package com.mkfree.deploy.controller;

import com.mkfree.deploy.Routes;
import com.mkfree.deploy.common.BaseController;
import com.mkfree.deploy.common.CheckHelper;
import com.mkfree.deploy.common.JsonResult;
import com.mkfree.deploy.common.PageResult;
import com.mkfree.deploy.domain.Project;
import com.mkfree.deploy.domain.ProjectTag;
import com.mkfree.deploy.repository.ProjectTagRepository;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Created by oyhk on 2018/1/22.
 */
@RestController
public class TagController extends BaseController {

    @Autowired
    private ProjectTagRepository projectTagRepository;

    @GetMapping(Routes.TAG_PAGE)
    public JsonResult page(Integer pageNo, Integer pageSize) {
        JsonResult jsonResult = new JsonResult();
        Page<ProjectTag> page = projectTagRepository.findAll(this.getPageRequest(pageNo, pageSize));
        jsonResult.data = new PageResult<>(page);
        return jsonResult;
    }

    @GetMapping(Routes.TAG_LIST)
    public JsonResult list() {
        JsonResult jsonResult = new JsonResult();
        jsonResult.data = projectTagRepository.findByStatus(true);
        return jsonResult;
    }




    @PutMapping(Routes.TAG_ENABLE)
    public JsonResult enable(@RequestBody ProjectTag projectTag) {
        JsonResult jsonResult = new JsonResult();
        Long id = projectTag.getId();
        CheckHelper.checkNotNull(id, Project.CHECK_ID_IS_NOT_NULL);
        ProjectTag dbProjectTag = projectTagRepository.findOne(id);
        CheckHelper.remindIsNotExist(dbProjectTag, ProjectTag.REMIND_RECORD_IS_NOT_EXIST);

        dbProjectTag.setStatus(projectTag.getStatus());
        projectTagRepository.save(dbProjectTag);

        return jsonResult;
    }

    @PutMapping(Routes.TAG_UPDATE)
    public JsonResult update(@RequestBody ProjectTag projectTag) {
        JsonResult jsonResult = new JsonResult();
        Long id = projectTag.getId();
        CheckHelper.checkNotNull(id, Project.CHECK_ID_IS_NOT_NULL);
        ProjectTag dbProjectTag = projectTagRepository.findOne(id);
        CheckHelper.remindIsNotExist(dbProjectTag, ProjectTag.REMIND_RECORD_IS_NOT_EXIST);

        String name = projectTag.getName();
        Boolean status = projectTag.getStatus();
        if(StringUtils.isNotBlank(name)){
            dbProjectTag.setName(name);
        }
        if(status != null){
            dbProjectTag.setStatus(status);
        }
        dbProjectTag.setStatus(projectTag.getStatus());
        projectTagRepository.save(dbProjectTag);

        return jsonResult;
    }

    @GetMapping(Routes.TAG_INFO)
    public JsonResult info(Long id) {
        JsonResult jsonResult = new JsonResult();
        CheckHelper.checkNotNull(id, Project.CHECK_ID_IS_NOT_NULL);
        ProjectTag dbProjectTag = projectTagRepository.findOne(id);
        CheckHelper.remindIsNotExist(dbProjectTag, ProjectTag.REMIND_RECORD_IS_NOT_EXIST);
        jsonResult.data = dbProjectTag;
        return jsonResult;
    }


    @PostMapping(Routes.TAG_SAVE)
    public JsonResult save(@RequestBody ProjectTag projectTag) {
        JsonResult jsonResult = new JsonResult();
        CheckHelper.checkNotNull(projectTag.getName(), "name is not null");
        CheckHelper.checkNotNull(projectTag.getStatus(), "status is not null");

        projectTagRepository.save(projectTag);
        return jsonResult;
    }
}
