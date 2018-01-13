package com.mkfree.deploy.interceptor;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mkfree.deploy.common.JsonResult;
import com.mkfree.deploy.domain.User;
import com.mkfree.deploy.domain.enumclass.RoleType;
import com.mkfree.deploy.dto.UserDto;
import com.mkfree.deploy.repository.UserProjectPermissionRepository;
import com.mkfree.deploy.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Created by oyhk on 15/11/29.
 * 自动登录过滤器
 */
public class RoleInterceptor extends HandlerInterceptorAdapter {

    private final Logger log = LoggerFactory.getLogger(RoleInterceptor.class);
    @Autowired
    private UserRepository userInfoIdRepository;
    @Autowired
    private UserProjectPermissionRepository userProjectPermissionRepository;
    @Autowired
    private ObjectMapper objectMapper;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        if(!request.getMethod().equals(RequestMethod.OPTIONS.toString())) {
            UserDto userDto = (UserDto) request.getSession().getAttribute(User.LOGIN_USER);

            if (userDto.getRoleType() != RoleType.ADMIN) {
                response.getWriter().print(objectMapper.writeValueAsString(new JsonResult<>("10011", "没有权限访问，此模块")));
                response.getWriter().close();
                return false;
            }
        }

        return super.preHandle(request, response, handler);
    }
}
