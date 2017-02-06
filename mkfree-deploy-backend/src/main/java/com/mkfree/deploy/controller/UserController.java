package com.mkfree.deploy.controller;

import com.mkfree.deploy.Routes;
import com.mkfree.deploy.common.BaseController;
import com.mkfree.deploy.common.PageResult;
import com.mkfree.deploy.repository.UserRepository;
import com.mkfree.deploy.common.JsonResult;
import com.mkfree.deploy.common.RestDoing;
import com.mkfree.deploy.domain.User;
import com.mkfree.deploy.helper.UserHelper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;

/**
 * Created by oyhk on 2017/1/23.
 *
 */
@RestController
public class UserController extends BaseController {

    private final Logger log = LoggerFactory.getLogger(UserController.class);
    @Autowired
    private UserRepository userRepository;

    @RequestMapping(value = Routes.USER_LOGIN, method = RequestMethod.POST)
    public JsonResult login(@RequestBody User dto, HttpServletRequest request) {
        RestDoing doing = jsonResult -> {
            if (StringUtils.isEmpty(dto.getUsername())) {
                jsonResult.errorParam("用户名不能为空", log);
                return;
            }
            if (StringUtils.isEmpty(dto.getPassword())) {
                jsonResult.errorParam("密码不能为空", log);
                return;
            }
            User user = userRepository.findByUsername(dto.getUsername());
            if (user == null) {
                jsonResult.remind("用户不存在", log);
                return;
            }

            String MD5Password = UserHelper.SINGLEONE.getMd5Password(user.getPasswordSalt(), dto.getPassword());
            if (!user.getPassword().equals(MD5Password)) {
                jsonResult.remind("密码错误", log);
                return;
            }

            user.setUserToken(UserHelper.SINGLEONE.getUserToken(user.getId(), user.getUsername()));
            userRepository.save(user);

            jsonResult.data = user.getUserToken();
        };
        return doing.go(request, log);
    }

    @RequestMapping(value = Routes.USER_PAGE, method = RequestMethod.GET)
    public JsonResult page(Integer pageNo, Integer pageSize, HttpServletRequest request) {
        RestDoing doing = jsonResult -> {
            PageRequest pageRequest = this.getPageRequest(pageNo, pageSize);
            Page page = userRepository.findAll(pageRequest);
            PageResult pageResult = new PageResult(page, Routes.USER_PAGE);
            jsonResult.data = pageResult;
        };
        return doing.go(request, log);
    }




}
