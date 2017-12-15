package com.mkfree.deploy.controller;

import com.mkfree.deploy.Routes;
import com.mkfree.deploy.common.BaseController;
import com.mkfree.deploy.common.JsonResult;
import com.mkfree.deploy.repository.EnvRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

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

}
