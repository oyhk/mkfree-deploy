package com.mkfree.deploy.controller;

import com.mkfree.deploy.Routes;
import com.mkfree.deploy.common.*;
import com.mkfree.deploy.domain.ProjectEnv;
import com.mkfree.deploy.domain.ProjectEnvConfig;
import com.mkfree.deploy.domain.User;
import com.mkfree.deploy.repository.EnvRepository;
import com.mkfree.deploy.repository.ProjectEnvConfigRepository;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

/**
 * Created by oyhk on 2017/12/14.
 */
@RestController
public class EnvController extends BaseController {

    @Autowired
    private EnvRepository envRepository;
    @Autowired
    private ProjectEnvConfigRepository projectEnvConfigRepository;

    @GetMapping(value = Routes.ENV_LIST)
    public JsonResult list() {
        JsonResult jsonResult = new JsonResult();
        jsonResult.data = envRepository.findAll();
        return jsonResult;
    }

    @RequestMapping(value = Routes.ENV_PAGE, method = RequestMethod.GET)
    public JsonResult page(Integer pageNo, Integer pageSize) {
        JsonResult jsonResult = new JsonResult();
        PageRequest pageRequest = this.getPageRequest(pageNo, pageSize, Sort.Direction.DESC, "sort");
        Page<ProjectEnv> page = envRepository.findAll(pageRequest);
        jsonResult.data = new PageResult(page, Routes.ENV_PAGE);
        return jsonResult;
    }

    @RequestMapping(value = Routes.ENV_INFO, method = RequestMethod.GET)
    public JsonResult info(Long id) {
        JsonResult jsonResult = new JsonResult();
        CheckHelper.checkNotNull(id, User.CHECK_ID_IS_NOT_NULL);

        Optional<ProjectEnv> optionalProjectEnv = envRepository.findById(id);

        optionalProjectEnv.orElseThrow(() -> {
            throw new RemindException(ProjectEnv.REMIND_RECORD_IS_NOT_EXIST);
        });

        jsonResult.data = optionalProjectEnv.get();

        return jsonResult;
    }

    @PostMapping(value = Routes.ENV_SAVE)
    public JsonResult save(@RequestBody ProjectEnv projectEnv) {
        JsonResult jsonResult = new JsonResult();
        String name = projectEnv.getName();
        CheckHelper.checkNotBlank(name, "环境名称不能为空");

        ProjectEnv dbProjectEnv = envRepository.findByName(name);
        CheckHelper.remindIsExist(dbProjectEnv, "环境名称已存在");

        dbProjectEnv = envRepository.save(projectEnv);
        jsonResult.data = dbProjectEnv;
        return jsonResult;
    }

    @PutMapping(value = Routes.ENV_UPDATE)
    public JsonResult update(@RequestBody ProjectEnv params) {
        JsonResult jsonResult = new JsonResult();

        Long id = params.getId();
        String name = params.getName();
        Integer sort = params.getSort();
        CheckHelper.checkNotNull(id, ProjectEnv.CHECK_ID_IS_NOT_NULL);

        Optional<ProjectEnv> optionalProjectEnv = envRepository.findById(id);
        optionalProjectEnv.orElseThrow(() -> new RemindException(ProjectEnv.CLASS_NAME + ProjectEnv.REMIND_RECORD_IS_NOT_EXIST));
        ProjectEnv projectEnv = optionalProjectEnv.get();

        if (StringUtils.isNotBlank(name)) {
            projectEnv.setName(name);
        }
        if (sort != null) {
            projectEnv.setSort(sort);
        }


        projectEnv = envRepository.save(params);
        // 同步更新
        List<ProjectEnvConfig> projectEnvConfigList = projectEnvConfigRepository.findByEnvId(id);
        ProjectEnv finalDbProjectEnv = projectEnv;
        projectEnvConfigList.forEach(projectEnvConfig -> {
            projectEnvConfig.setEnvName(finalDbProjectEnv.getName());
            projectEnvConfig.setEnvSort(finalDbProjectEnv.getSort());
        });
        jsonResult.data = projectEnv;
        return jsonResult;
    }

    @DeleteMapping(value = Routes.ENV_DELETE)
    public JsonResult delete(@RequestBody ProjectEnv params) {
        JsonResult jsonResult = new JsonResult();

        Long id = params.getId();
        CheckHelper.checkNotNull(id, ProjectEnv.CHECK_ID_IS_NOT_NULL);
        Optional<ProjectEnv> optionalProjectEnv = envRepository.findById(id);
        optionalProjectEnv.orElseThrow(() -> new RemindException(ProjectEnv.CLASS_NAME + ProjectEnv.REMIND_RECORD_IS_NOT_EXIST));
        ProjectEnv projectEnv = optionalProjectEnv.get();
        envRepository.delete(projectEnv);

        return jsonResult;
    }
}
