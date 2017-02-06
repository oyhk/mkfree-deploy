package com.mkfree.deploy.controller;

import com.mkfree.deploy.Routes;
import com.mkfree.deploy.common.BaseController;
import com.mkfree.deploy.common.JsonResult;
import com.mkfree.deploy.common.PageResult;
import com.mkfree.deploy.common.RestDoing;
import com.mkfree.deploy.domain.Project;
import com.mkfree.deploy.domain.ServerMachine;
import com.mkfree.deploy.repository.ServerMachineRepository;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;

/**
 * Created by oyhk on 2017/2/4.
 *
 */
@RestController
public class ServerMachineController extends BaseController {

    private final Logger log = LoggerFactory.getLogger(ServerMachineController.class);
    @Autowired
    private ServerMachineRepository serverMachineRepository;

    @RequestMapping(value = Routes.SERVER_MACHINE_PAGE, method = RequestMethod.GET)
    public JsonResult page(Integer pageNo, Integer pageSize, HttpServletRequest request) {
        RestDoing doing = jsonResult -> {
            Page page = serverMachineRepository.findAll(this.getPageRequest(pageNo, pageSize));
            jsonResult.data = new PageResult(page, Routes.PROJECT_PAGE);
        };
        return doing.go(request, log);
    }

    @RequestMapping(value = Routes.SERVER_MACHINE_SAVE, method = RequestMethod.POST)
    public JsonResult save(@RequestBody ServerMachine dto, HttpServletRequest request) {
        RestDoing doing = jsonResult -> {


            if (StringUtils.isBlank(dto.getName())) {
                jsonResult.errorParam("名称不能为空");
                return;
            }
            if (StringUtils.isBlank(dto.getUsername())) {
                jsonResult.errorParam("用户名不能为空");
                return;
            }
            if (StringUtils.isBlank(dto.getIp())) {
                jsonResult.errorParam("ip不能为空");
                return;
            }
            if (StringUtils.isBlank(dto.getPort())) {
                jsonResult.errorParam("port不能为空");
                return;
            }
            if (dto.getType() == null) {
                jsonResult.errorParam("服务器类型不能为空");
                return;
            }

            ServerMachine serverMachine = new ServerMachine();
            BeanUtils.copyProperties(dto, serverMachine);
            serverMachineRepository.save(serverMachine);
        };
        return doing.go(request, log);
    }

    @RequestMapping(value = Routes.SERVER_MACHINE_UPDATE, method = RequestMethod.PATCH)
    public JsonResult update(@RequestBody ServerMachine dto, HttpServletRequest request) {
        RestDoing doing = jsonResult -> {
            if (dto.getId() == null) {
                jsonResult.errorParam("id不能为空");
                return;
            }
            ServerMachine serverMachine = serverMachineRepository.findOne(dto.getId());

            if (StringUtils.isNotBlank(dto.getName())) {
                serverMachine.setName(dto.getName());
            }
            if (StringUtils.isNotBlank(dto.getIp())) {
                serverMachine.setIp(dto.getIp());
            }
            if (StringUtils.isNotBlank(dto.getUsername())) {
                serverMachine.setUsername(dto.getUsername());
            }
            if (StringUtils.isNotBlank(dto.getPassword())) {
                serverMachine.setPassword(dto.getPassword());
            }
            if (StringUtils.isNotBlank(dto.getPort())) {
                serverMachine.setPort(dto.getPort());
            }
            if (dto.getType() != null) {
                serverMachine.setType(dto.getType());
            }
            serverMachineRepository.save(serverMachine);
        };
        return doing.go(request, log);
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
