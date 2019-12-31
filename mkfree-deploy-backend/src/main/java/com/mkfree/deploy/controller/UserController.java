package com.mkfree.deploy.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mkfree.deploy.Routes;
import com.mkfree.deploy.common.*;
import com.mkfree.deploy.domain.Project;
import com.mkfree.deploy.domain.SystemConfig;
import com.mkfree.deploy.domain.UserProjectPermission;
import com.mkfree.deploy.dto.UserDto;
import com.mkfree.deploy.dto.UserProjectPermissionDto;
import com.mkfree.deploy.repository.ProjectRepository;
import com.mkfree.deploy.repository.SystemConfigRepository;
import com.mkfree.deploy.repository.UserProjectPermissionRepository;
import com.mkfree.deploy.repository.UserRepository;
import com.mkfree.deploy.domain.User;
import com.mkfree.deploy.helper.UserHelper;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import java.util.*;

/**
 * Created by oyhk on 2017/1/23.
 *
 */
@RestController
public class UserController extends BaseController {

    private final Logger log = LoggerFactory.getLogger(UserController.class);
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ProjectRepository projectRepository;
    @Autowired
    private ObjectMapper objectMapper;
    @Autowired
    private UserProjectPermissionRepository userProjectPermissionRepository;
    @Autowired
    private SystemConfigRepository systemConfigRepository;

    @RequestMapping(value = Routes.USER_LOGIN, method = RequestMethod.POST)
    public JsonResult login(@RequestBody User dto, HttpServletRequest request) {
        RestDoing doing = jsonResult -> {
            if (StringUtils.isBlank(dto.getUsername())) {
                jsonResult.custom(JsonResult.CD106[0], JsonResult.CD106[1], log);
                return;
            }
            if (StringUtils.isBlank(dto.getPassword())) {
                jsonResult.custom(JsonResult.CD107[0], JsonResult.CD107[1], log);
                return;
            }
            User user = userRepository.findByUsername(dto.getUsername());
            if (user == null) {
                jsonResult.custom(JsonResult.CD101[0], JsonResult.CD101[1], log);
                return;
            }

            String MD5Password = UserHelper.SINGLEONE.getMd5Password(user.getPasswordSalt(), dto.getPassword());
            if (!user.getPassword().equals(MD5Password)) {
                jsonResult.custom(JsonResult.CD103[0], JsonResult.CD103[1], log);
                return;
            }

            user.setAccessToken(UserHelper.SINGLEONE.getAccessToken(user.getId(), user.getUsername()));
            userRepository.save(user);

            Map<String, Object> result = new HashMap<>();
            result.put("username", user.getUsername());
            result.put("accessToken", user.getAccessToken());

            SystemConfig eureka = systemConfigRepository.findByKey("eureka");
            result.put("eurekaUser", eureka.getKey());
            result.put("eurekaPassword", Base64.getEncoder().encodeToString((eureka.getKey() + ":" + eureka.getValue()).getBytes()));
            jsonResult.data = result;
        };
        return doing.go(request, log);
    }

    @RequestMapping(value = Routes.USER_LOGIN_USER_TOKEN, method = RequestMethod.POST)
    public JsonResult loginUserToken(@RequestBody UserDto dto, HttpServletRequest request) {
        RestDoing doing = jsonResult -> {
            if (StringUtils.isBlank(dto.getAccessToken())) {
                jsonResult.errorParam("用户名不能为空", log);
                return;
            }
            User user = userRepository.findByAccessToken(dto.getAccessToken());
            if (user == null) {
                jsonResult.remind("userToken 无效", log);
                return;
            }
            List<UserProjectPermission> userProjectPermissionList = userProjectPermissionRepository.findByProjectId(user.getId());
            jsonResult.data = user.getAccessToken();
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

            User user = userRepository.findByUsername(dto.getUsername());
            if (user != null) {
                jsonResult.remind("用户名已存在");
                return;
            }

            user = new User();
            user.setUsername(dto.getUsername());
            String passwordSalt = new Date().getTime() + "";
            user.setPassword(UserHelper.SINGLEONE.getMd5Password(passwordSalt, dto.getPassword()));
            user.setPasswordSalt(passwordSalt);
            userRepository.save(user);
            if (dto.getUserProjectPermissionList() != null) {
                for (UserProjectPermissionDto userProjectPermissionDto : dto.getUserProjectPermissionList()) {
                    Optional<Project> optionalProject = projectRepository.findById(userProjectPermissionDto.getProjectId());
                    if (optionalProject.isEmpty()) {
                        continue;
                    }
                }
            }

        };
        return doing.go(request, log);
    }

    @RequestMapping(value = Routes.USER_UPDATE, method = RequestMethod.PUT)
    public JsonResult update(@RequestBody UserDto dto, HttpServletRequest request) {
        RestDoing doing = jsonResult -> {
            if (dto.getId() == null) {
                jsonResult.errorParam(UserDto.CHECK_ID_IS_NOT_NULL, log);
                return;
            }

            Optional<User> optionalUser = userRepository.findById(dto.getId());
            optionalUser.orElseThrow(() -> new RemindException(User.CLASS_NAME + User.REMIND_RECORD_IS_NOT_EXIST));
            User user = optionalUser.get();

            if (StringUtils.isNotBlank(user.getUsername())) {
                user.setUsername(dto.getUsername());
            }
            if (StringUtils.isNotBlank(dto.getPassword())) {
                String passwordSalt = new Date().getTime() + "";
                user.setPassword(UserHelper.SINGLEONE.getMd5Password(passwordSalt, dto.getPassword()));
                user.setPasswordSalt(passwordSalt);
            }

            if (dto.getUserProjectPermissionList() != null) {
                List<UserProjectPermission> userProjectPermissionList = userProjectPermissionRepository.findByProjectId(user.getId());
                userProjectPermissionRepository.deleteAll(userProjectPermissionList);
                for (UserProjectPermissionDto userProjectPermissionDto : dto.getUserProjectPermissionList()) {
                    Optional<Project> optionalProject = projectRepository.findById(userProjectPermissionDto.getProjectId());
                    if (optionalProject.isEmpty()) {
                        continue;
                    }
                }
            }
            userRepository.save(user);
        };
        return doing.go(request, log);
    }

    @RequestMapping(value = Routes.USER_DELETE, method = RequestMethod.DELETE)
    public JsonResult delete(@RequestBody UserDto dto, HttpServletRequest request) {
        RestDoing doing = jsonResult -> {
            if (dto.getId() == null) {
                jsonResult.errorParam(User.CHECK_ID_IS_NOT_NULL, log);
                return;
            }
            // 删除用户项目权限
            List<UserProjectPermission> userProjectPermissionList = userProjectPermissionRepository.findByProjectId(dto.getId());
            userProjectPermissionRepository.deleteAll(userProjectPermissionList);
            // 删除用户
            userRepository.deleteById(dto.getId());
        };
        return doing.go(request, log);
    }

    @RequestMapping(value = Routes.USER_INFO, method = RequestMethod.GET)
    public JsonResult info(Long id) {
        JsonResult jsonResult = new JsonResult();
        CheckHelper.checkNotNull(id, User.CHECK_ID_IS_NOT_NULL);

        Optional<User> optionalUser = userRepository.findById(id);
        optionalUser.orElseThrow(() -> new RemindException(User.CLASS_NAME + User.REMIND_RECORD_IS_NOT_EXIST));
        User user = optionalUser.get();

        UserDto userDto = new UserDto();
        userDto.setId(user.getId());
        userDto.setUsername(user.getUsername());
        List<UserProjectPermission> userProjectPermissionList = userProjectPermissionRepository.findByProjectId(user.getId());

        jsonResult.data = userDto;

        return jsonResult;
    }

    @RequestMapping(value = Routes.USER_PAGE, method = RequestMethod.GET)
    public JsonResult page(Integer pageNo, Integer pageSize) {
        JsonResult jsonResult = new JsonResult();
        PageRequest pageRequest = this.getPageRequest(pageNo, pageSize);
        Page<User> page = userRepository.findAll(pageRequest);

        page.getContent().forEach(user -> {
            user.setPassword(null);
            user.setPasswordSalt(null);
        });

        jsonResult.data = new PageResult(page, Routes.USER_PAGE);
        return jsonResult;
    }


}
