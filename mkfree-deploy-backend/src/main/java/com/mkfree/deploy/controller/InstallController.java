package com.mkfree.deploy.controller;

import com.mkfree.deploy.Routes;
import com.mkfree.deploy.common.BaseController;
import com.mkfree.deploy.common.CheckHelper;
import com.mkfree.deploy.common.JsonResult;
import com.mkfree.deploy.domain.SystemConfig;
import com.mkfree.deploy.domain.User;
import com.mkfree.deploy.domain.enumclass.RoleType;
import com.mkfree.deploy.dto.InstallDto;
import com.mkfree.deploy.helper.UserHelper;
import com.mkfree.deploy.repository.SystemConfigRepository;
import com.mkfree.deploy.repository.UserRepository;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

/**
 * Created by oyhk on 2018/1/10.
 */
@RestController
public class InstallController extends BaseController {

    @Autowired
    private SystemConfigRepository systemConfigRepository;
    @Autowired
    private UserRepository userRepository;

    /**
     * 检查系统是否已安装
     *
     * @return
     */
    @GetMapping(value = Routes.INSTALLED)
    public JsonResult isInstalled() {
        JsonResult jsonResult = new JsonResult();
        SystemConfig systemConfig = systemConfigRepository.findByKey(SystemConfig.keyIsInstalled);
        Map<String, Object> result = new HashMap<>();
        result.put("installed", false);
        if (systemConfig != null && StringUtils.isNotBlank(systemConfig.getValue()) && systemConfig.getValue().equals("true")) {
            result.put("installed", true);
        }

        SystemConfig domainSystemConfig = systemConfigRepository.findByKey(SystemConfig.KeyDomain);

        result.put("domain", domainSystemConfig.getValue());

        jsonResult.data = result;
        return jsonResult;
    }

    /**
     * 安装系统
     * @param installDto
     * @return
     */
    @PostMapping(value = Routes.INSTALL)
    public JsonResult install(@RequestBody InstallDto installDto) {
        JsonResult jsonResult = new JsonResult();
        String buildPath = installDto.getBuildPath();
        String projectPath = installDto.getProjectPath();
        String username = installDto.getUsername();
        String password = installDto.getPassword();
        String domain = installDto.getDomain();

        CheckHelper.checkNotBlank(buildPath, "buildPath 不能为空");
        CheckHelper.checkNotBlank(projectPath, "projectPath 不能为空");
        CheckHelper.checkNotBlank(username, "username 不能为空");
        CheckHelper.checkNotBlank(password, "password 不能为空");
        CheckHelper.checkNotBlank(domain, "KeyDomain 不能为空");


        SystemConfig buildPathSystemConfig = systemConfigRepository.findByKey(SystemConfig.keyBuildPath);
        if (buildPathSystemConfig == null) {
            buildPathSystemConfig = new SystemConfig();
        }
        buildPathSystemConfig.setKey(SystemConfig.keyBuildPath);
        buildPathSystemConfig.setValue(buildPath);
        systemConfigRepository.save(buildPathSystemConfig);


        SystemConfig projectPathSystemConfig = systemConfigRepository.findByKey(SystemConfig.keyProjectPath);
        if (projectPathSystemConfig == null) {
            projectPathSystemConfig = new SystemConfig();
        }
        projectPathSystemConfig.setKey(SystemConfig.keyProjectPath);
        projectPathSystemConfig.setValue(projectPath);
        systemConfigRepository.save(projectPathSystemConfig);

        SystemConfig domainSystemConfig = systemConfigRepository.findByKey(SystemConfig.KeyDomain);
        if (domainSystemConfig == null) {
            domainSystemConfig = new SystemConfig();
        }
        domainSystemConfig.setKey(SystemConfig.KeyDomain);
        domainSystemConfig.setValue(domain);
        systemConfigRepository.save(domainSystemConfig);

        SystemConfig isInstalledSystemConfig = systemConfigRepository.findByKey(SystemConfig.keyIsInstalled);
        if (isInstalledSystemConfig == null) {
            isInstalledSystemConfig = new SystemConfig();
        }
        isInstalledSystemConfig.setKey(SystemConfig.keyIsInstalled);
        isInstalledSystemConfig.setValue(Boolean.toString(true));
        systemConfigRepository.save(isInstalledSystemConfig);

        // 添加超级管理员用户
        User user = userRepository.findByUsername(username);
        if (user == null) {
            String passwordSalt = System.currentTimeMillis() + "";
            String passwordMD5 = UserHelper.SINGLEONE.getMd5Password(passwordSalt, password);
            user = new User();
            user.setUsername(username);
            user.setPasswordSalt(passwordSalt);
            user.setRoleType(RoleType.ADMIN);
            user.setPassword(passwordMD5);
            userRepository.save(user);
        }


        return jsonResult;
    }

}
