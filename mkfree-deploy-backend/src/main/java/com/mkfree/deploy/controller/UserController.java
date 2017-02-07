package com.mkfree.deploy.controller;

import com.mkfree.deploy.Routes;
import com.mkfree.deploy.common.BaseController;
import com.mkfree.deploy.common.PageResult;
import com.mkfree.deploy.dto.UserDto;
import com.mkfree.deploy.repository.UserRepository;
import com.mkfree.deploy.common.JsonResult;
import com.mkfree.deploy.common.RestDoing;
import com.mkfree.deploy.domain.User;
import com.mkfree.deploy.helper.UserHelper;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import java.util.Date;

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
            if (StringUtils.isBlank(dto.getUsername())) {
                jsonResult.errorParam("用户名不能为空", log);
                return;
            }
            if (StringUtils.isBlank(dto.getPassword())) {
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

    @RequestMapping(value = Routes.USER_SAVE, method = RequestMethod.POST)
    public JsonResult save(@RequestBody UserDto dto, HttpServletRequest request) {
        RestDoing doing = jsonResult -> {
            if (StringUtils.isBlank(dto.getUsername())) {
                jsonResult.errorParam("用户名不能为空", log);
                return;
            }
            if (StringUtils.isBlank(dto.getPassword())) {
                jsonResult.errorParam("密码不能为空", log);
                return;
            }
            User user = new User();
            BeanUtils.copyProperties(dto, user);
            userRepository.save(user);
        };
        return doing.go(request, log);
    }

    @RequestMapping(value = Routes.USER_UPDATE, method = RequestMethod.PUT)
    public JsonResult update(@RequestBody UserDto dto, HttpServletRequest request) {
        RestDoing doing = jsonResult -> {
            if (dto.getId() == null) {
                jsonResult.errorParam("id 不能为空", log);
                return;
            }

            User user = userRepository.findOne(dto.getId());
            if (user == null) {
                jsonResult.remind(User.REMIND_RECORD_IS_NOT_EXIST);
                return;
            }
            if (StringUtils.isNotBlank(user.getUsername())) {
                user.setUsername(dto.getUsername());
            }
            if(StringUtils.isNotBlank(dto.getUsername())){
                user.setUsername(dto.getUsername());
            }
            if (StringUtils.isNotBlank(dto.getPassword())) {
                user.setPassword(UserHelper.SINGLEONE.getMd5Password(new Date().getTime() + "", dto.getPassword()));
            }
            userRepository.save(user);
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
