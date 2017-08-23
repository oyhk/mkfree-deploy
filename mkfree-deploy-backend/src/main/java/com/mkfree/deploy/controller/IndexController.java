package com.mkfree.deploy.controller;

import com.mkfree.deploy.Config;
import com.mkfree.deploy.Prop;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletResponse;

/**
 * Created by oyhk on 2017/1/22.
 */
@Controller
public class IndexController {

    @Autowired
    private Prop prop;

    /**
     * 配置react路由
     * @return
     */
    @RequestMapping(value = {"/deploy/**", "/**.js", "/**.css"}, method = RequestMethod.GET)
    public String index(HttpServletResponse response) {
        response.setHeader("Pragma", "No-cache");
        response.setHeader("Cache-Control", "no-cache");
        response.setDateHeader("Expires", 0);
        if (Config.ENV_PROD.equals(prop.env)) {
            return "index-prod";
        }
        return "index";
    }

}
