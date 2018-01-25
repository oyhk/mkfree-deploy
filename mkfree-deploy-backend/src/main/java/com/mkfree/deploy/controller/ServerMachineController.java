package com.mkfree.deploy.controller;

import com.mkfree.deploy.Routes;
import com.mkfree.deploy.common.*;
import com.mkfree.deploy.domain.ProjectEnv;
import com.mkfree.deploy.domain.ServerMachine;
import com.mkfree.deploy.repository.EnvRepository;
import com.mkfree.deploy.repository.ServerMachineRepository;
import org.apache.commons.codec.digest.DigestUtils;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;
import sun.misc.BASE64Decoder;
import sun.misc.BASE64Encoder;

import javax.crypto.*;
import javax.crypto.spec.DESKeySpec;
import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.security.spec.InvalidKeySpecException;
import java.util.List;

/**
 * Created by oyhk on 2017/2/4.
 *
 */
@RestController
public class ServerMachineController extends BaseController {

    private final Logger log = LoggerFactory.getLogger(ServerMachineController.class);

    @Autowired
    private ServerMachineRepository serverMachineRepository;
    @Autowired
    private EnvRepository envRepository;


    @GetMapping(value = Routes.SERVER_MACHINE_INFO)
    public JsonResult info(Long id) {
        CheckHelper.checkNotNull(id, ServerMachine.CHECK_ID_IS_NOT_NULL);
        JsonResult jsonResult = new JsonResult();
        jsonResult.data = serverMachineRepository.findOne(id);
        return jsonResult;
    }

    @RequestMapping(value = Routes.SERVER_MACHINE_LIST, method = RequestMethod.GET)
    public JsonResult list() {
        JsonResult jsonResult = new JsonResult();
        List<ServerMachine> serverMachineList = serverMachineRepository.findAll();

        List<ProjectEnv> projectEnvList = envRepository.findAll();
        jsonResult.data = serverMachineList;
        return jsonResult;
    }

    @RequestMapping(value = Routes.SERVER_MACHINE_PAGE, method = RequestMethod.GET)
    public JsonResult page(Integer pageNo, Integer pageSize) {
        JsonResult jsonResult = new JsonResult();
        Page page = serverMachineRepository.findAll(this.getPageRequest(pageNo, pageSize));
        jsonResult.data = new PageResult(page, Routes.PROJECT_PAGE);
        return jsonResult;
    }

    @RequestMapping(value = Routes.SERVER_MACHINE_SAVE, method = RequestMethod.POST)
    public JsonResult save(@RequestBody ServerMachine dto) {
        JsonResult jsonResult = new JsonResult();
        String envName = dto.getEnvName();
        String name = dto.getName();
        String username = dto.getUsername();
        String password = dto.getPassword();
        String ip = dto.getIp();
        String port = dto.getPort();

        CheckHelper.checkNotBlank(envName, "envName 不能为空");
        CheckHelper.checkNotBlank(name, "name 不能为空");
        CheckHelper.checkNotNull(username, "username 不能为空");
        CheckHelper.checkNotNull(password, "password 不能为空");
        CheckHelper.checkNotNull(ip, "ip 不能为空");
        CheckHelper.checkNotNull(port, "port 不能为空");

        ProjectEnv projectEnv = envRepository.findByName(envName);
        CheckHelper.remindIsNotExist(projectEnv, ProjectEnv.CLASS_NAME + ProjectEnv.REMIND_RECORD_IS_NOT_EXIST);

        ServerMachine serverMachine = new ServerMachine();
        BeanUtils.copyProperties(dto, serverMachine);

        String encryptionPassword = DESUtils.encryption(password);
        serverMachine.setPassword(encryptionPassword);

        serverMachine.setEnvId(projectEnv.getId());
        serverMachine.setEnvName(projectEnv.getName());

        jsonResult.data = serverMachineRepository.save(serverMachine);

        return jsonResult;
    }

    @RequestMapping(value = Routes.SERVER_MACHINE_UPDATE, method = RequestMethod.PUT)
    public JsonResult update(@RequestBody ServerMachine dto) {
        JsonResult jsonResult = new JsonResult();

        Long id = dto.getId();
        String envName = dto.getEnvName();
        String name = dto.getName();
        String username = dto.getUsername();
        String password = dto.getPassword();
        String ip = dto.getIp();
        String port = dto.getPort();

        CheckHelper.checkNotNull(id, ServerMachine.CHECK_ID_IS_NOT_NULL);

        ServerMachine serverMachine = serverMachineRepository.findOne(id);
        CheckHelper.remindIsNotExist(serverMachine, ServerMachine.REMIND_RECORD_IS_NOT_EXIST);

        if (StringUtils.isNotBlank(envName)) {
            ProjectEnv projectEnv = envRepository.findByName(envName);
            CheckHelper.remindIsNotExist(projectEnv, ProjectEnv.CLASS_NAME + ProjectEnv.REMIND_RECORD_IS_NOT_EXIST);
            serverMachine.setEnvId(projectEnv.getId());
            serverMachine.setEnvName(envName);
        }

        if (StringUtils.isNotBlank(name)) {
            serverMachine.setName(name);
        }
        if (StringUtils.isNotBlank(username)) {
            serverMachine.setUsername(username);
        }
        if (StringUtils.isNotBlank(password)) {
            String encryptionPassword = DESUtils.encryption(password);
            serverMachine.setPassword(encryptionPassword);
        }
        if (StringUtils.isNotBlank(ip)) {
            serverMachine.setIp(ip);
        }
        if (StringUtils.isNotBlank(port)) {
            serverMachine.setPort(port);
        }
        jsonResult.data = serverMachineRepository.save(serverMachine);

        return jsonResult;
    }

    @RequestMapping(value = Routes.SERVER_MACHINE_DELETE, method = RequestMethod.DELETE)
    public JsonResult delete(@RequestBody ServerMachine dto, HttpServletRequest request) {
        RestDoing doing = jsonResult -> {
            if (dto.getId() == null) {
                jsonResult.errorParam("id不能为空");
                return;
            }
            serverMachineRepository.delete(dto.getId());
        };
        return doing.go(request, log);
    }

}
