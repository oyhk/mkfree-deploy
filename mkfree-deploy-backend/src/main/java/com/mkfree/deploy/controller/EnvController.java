package com.mkfree.deploy.controller;

import com.mkfree.deploy.Routes;
import com.mkfree.deploy.common.BaseController;
import com.mkfree.deploy.common.CheckHelper;
import com.mkfree.deploy.common.JsonResult;
import com.mkfree.deploy.common.PageResult;
import com.mkfree.deploy.domain.Env;
import com.mkfree.deploy.domain.User;
import com.mkfree.deploy.domain.UserProjectPermission;
import com.mkfree.deploy.dto.UserDto;
import com.mkfree.deploy.helper.UserProjectPermissionHelper;
import com.mkfree.deploy.repository.EnvRepository;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Created by oyhk on 2017/12/14.
 */
@RestController
public class EnvController extends BaseController {

    @Autowired
    private EnvRepository envRepository;

    @GetMapping(value = Routes.ENV_LIST)
    public JsonResult list() {
        JsonResult jsonResult = new JsonResult();
        jsonResult.data = envRepository.findAll();
        return jsonResult;
    }

    @RequestMapping(value = Routes.ENV_PAGE, method = RequestMethod.GET)
    public JsonResult page(Integer pageNo, Integer pageSize) {
        JsonResult jsonResult = new JsonResult();
        PageRequest pageRequest = this.getPageRequest(pageNo, pageSize,Sort.Direction.DESC,"sort");
        Page<Env> page = envRepository.findAll(pageRequest);
        jsonResult.data = new PageResult(page, Routes.ENV_PAGE);
        return jsonResult;
    }

    @RequestMapping(value = Routes.ENV_INFO, method = RequestMethod.GET)
    public JsonResult info(Long id) {
        JsonResult jsonResult = new JsonResult();
        CheckHelper.checkNotNull(id, User.CHECK_ID_IS_NOT_NULL);

        Env env = envRepository.findOne(id);
        CheckHelper.remindIsNotExist(env, User.REMIND_RECORD_IS_NOT_EXIST);


        jsonResult.data = env;

        return jsonResult;
    }

    @PostMapping(value = Routes.ENV_SAVE)
    public JsonResult save(@RequestBody Env env) {
        JsonResult jsonResult = new JsonResult();
        String name = env.getName();
        CheckHelper.checkNotBlank(name, "环境名称不能为空");

        Env dbEnv = envRepository.findByName(name);
        CheckHelper.remindIsExist(dbEnv, "环境名称已存在");

        dbEnv = envRepository.save(env);
        jsonResult.data = dbEnv;
        return jsonResult;
    }

    @PutMapping(value = Routes.ENV_UPDATE)
    public JsonResult update(@RequestBody Env env) {
        JsonResult jsonResult = new JsonResult();

        Long id = env.getId();
        String name = env.getName();
        Integer sort = env.getSort();
        CheckHelper.checkNotNull(id, Env.CHECK_ID_IS_NOT_NULL);

        Env dbEnv = envRepository.findOne(id);
        CheckHelper.remindIsNotExist(dbEnv, Env.REMIND_RECORD_IS_NOT_EXIST);
        if (StringUtils.isNotBlank(name)) {
            dbEnv.setName(name);
        }
        if(sort != null){
            dbEnv.setSort(sort);
        }

        dbEnv = envRepository.save(env);
        jsonResult.data = dbEnv;
        return jsonResult;
    }

    @DeleteMapping(value = Routes.ENV_DELETE)
    public JsonResult delete(@RequestBody Env env) {
        JsonResult jsonResult = new JsonResult();

        Long id = env.getId();
        CheckHelper.checkNotNull(id, Env.CHECK_ID_IS_NOT_NULL);

        Env dbEnv = envRepository.findOne(id);
        CheckHelper.remindIsNotExist(dbEnv, Env.REMIND_RECORD_IS_NOT_EXIST);
        envRepository.delete(dbEnv);
        return jsonResult;
    }
}
