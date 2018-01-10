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
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

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
        if (systemConfig == null) {
            jsonResult.data = false;
            return jsonResult;
        }
        jsonResult.data = !systemConfig.getValue().equals("false");
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
        String installPath = installDto.getInstallPath();
        String projectPath = installDto.getProjectPath();

        CheckHelper.checkNotBlank(buildPath, "buildPath 不能为空");
        CheckHelper.checkNotBlank(installPath, "installPath 不能为空");
        CheckHelper.checkNotBlank(projectPath, "projectPath 不能为空");

        SystemConfig buildPathSystemConfig = new SystemConfig();
        buildPathSystemConfig.setKey(SystemConfig.keyBuildPath);
        buildPathSystemConfig.setValue(buildPath);
        systemConfigRepository.save(buildPathSystemConfig);

        SystemConfig installPathSystemConfig = new SystemConfig();
        buildPathSystemConfig.setKey(SystemConfig.keyInstallPath);
        buildPathSystemConfig.setValue(buildPath);
        systemConfigRepository.save(installPathSystemConfig);

        SystemConfig projectPathSystemConfig = new SystemConfig();
        buildPathSystemConfig.setKey(SystemConfig.keyProjectPath);
        buildPathSystemConfig.setValue(buildPath);
        systemConfigRepository.save(projectPathSystemConfig);

        SystemConfig isInstalledSystemConfig = new SystemConfig();
        buildPathSystemConfig.setKey(SystemConfig.keyIsInstalled);
        buildPathSystemConfig.setValue(Boolean.toString(true));
        systemConfigRepository.save(isInstalledSystemConfig);

        // 添加超级管理员用户
        User user = userRepository.findByUsername("admin");
        if (user == null) {
            String passwordSalt = System.currentTimeMillis() + "";
            String password = UserHelper.SINGLEONE.getMd5Password(passwordSalt, "admin");
            user = new User();
            user.setUsername("admin");
            user.setPasswordSalt(passwordSalt);
            user.setRoleType(RoleType.ADMIN);
            user.setPassword(password);
            userRepository.save(user);
        }


        return jsonResult;
    }

}
