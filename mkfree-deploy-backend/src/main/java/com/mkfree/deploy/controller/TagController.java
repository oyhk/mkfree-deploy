package com.mkfree.deploy.controller;

import com.mkfree.deploy.Routes;
import com.mkfree.deploy.common.*;
import com.mkfree.deploy.domain.Project;
import com.mkfree.deploy.domain.ProjectTag;
import com.mkfree.deploy.repository.ProjectTagRepository;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

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
    public JsonResult enable(@RequestBody ProjectTag params) {
        JsonResult jsonResult = new JsonResult();
        Long id = params.getId();
        CheckHelper.checkNotNull(id, Project.CHECK_ID_IS_NOT_NULL);
        Optional<ProjectTag> optionalProjectTag = projectTagRepository.findById(id);
        optionalProjectTag.orElseThrow(() -> new RemindException(ProjectTag.CLASS_NAME + ProjectTag.REMIND_RECORD_IS_NOT_EXIST));
        ProjectTag projectTag = optionalProjectTag.get();
        projectTag.setStatus(params.getStatus());
        projectTagRepository.save(projectTag);

        return jsonResult;
    }

    @PutMapping(Routes.TAG_UPDATE)
    public JsonResult update(@RequestBody ProjectTag params) {
        JsonResult jsonResult = new JsonResult();
        Long id = params.getId();
        CheckHelper.checkNotNull(id, Project.CHECK_ID_IS_NOT_NULL);
        Optional<ProjectTag> optionalProjectTag = projectTagRepository.findById(id);
        optionalProjectTag.orElseThrow(() -> new RemindException(ProjectTag.CLASS_NAME + ProjectTag.REMIND_RECORD_IS_NOT_EXIST));
        ProjectTag projectTag = optionalProjectTag.get();

        String name = params.getName();
        Boolean status = params.getStatus();
        if (StringUtils.isNotBlank(name)) {
            projectTag.setName(name);
        }
        if (status != null) {
            projectTag.setStatus(status);
        }
        projectTag.setStatus(params.getStatus());
        projectTagRepository.save(projectTag);

        return jsonResult;
    }

    @GetMapping(Routes.TAG_INFO)
    public JsonResult info(Long id) {
        JsonResult jsonResult = new JsonResult();
        CheckHelper.checkNotNull(id, Project.CHECK_ID_IS_NOT_NULL);
        Optional<ProjectTag> optionalProjectTag = projectTagRepository.findById(id);
        optionalProjectTag.orElseThrow(() -> new RemindException(ProjectTag.CLASS_NAME + ProjectTag.REMIND_RECORD_IS_NOT_EXIST));
        ProjectTag projectTag = optionalProjectTag.get();
        jsonResult.data = projectTag;
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
