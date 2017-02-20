package com.mkfree.deploy.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * Created by oyhk on 2017/1/22.
 */
@Controller
public class IndexController {

    /**
     * 配置react路由
     * @return
     */
    @RequestMapping(value = {"/deploy/**","/**.js","/**.css"},method = RequestMethod.GET)
    public String index() {
        return "index";
    }

    /**
     * 配置react路由
     * @return
     */
    @RequestMapping(value = "/websocket",method = RequestMethod.GET)
    public String websocket() {
        return "stomp";
    }
}
