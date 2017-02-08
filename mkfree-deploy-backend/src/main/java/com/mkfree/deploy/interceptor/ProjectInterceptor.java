package com.mkfree.deploy.interceptor;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mkfree.deploy.common.JsonResult;
import com.mkfree.deploy.domain.User;
import com.mkfree.deploy.domain.UserProjectPermission;
import com.mkfree.deploy.domain.enumclass.RoleType;
import com.mkfree.deploy.dto.ProjectDto;
import com.mkfree.deploy.dto.UserDto;
import com.mkfree.deploy.dto.UserProjectPermissionDto;
import com.mkfree.deploy.helper.UserHelper;
import com.mkfree.deploy.helper.UserProjectPermissionHelper;
import com.mkfree.deploy.repository.UserProjectPermissionRepository;
import com.mkfree.deploy.repository.UserRepository;
import org.apache.commons.io.IOUtils;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Objects;

/**
 * Created by oyhk on 15/11/29.
 * 自动登录过滤器
 */
@Component
public class ProjectInterceptor extends HandlerInterceptorAdapter {

    private final Logger log = LoggerFactory.getLogger(ProjectInterceptor.class);
    @Autowired
    private ObjectMapper objectMapper;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        UserDto userDto = (UserDto) request.getSession().getAttribute(User.LOGIN_USER);
        String requestBody = IOUtils.toString(request.getInputStream(), StandardCharsets.UTF_8);

        ProjectDto projectDto = objectMapper.readValue(requestBody, new TypeReference<ProjectDto>() {
        });

        // 查找是否有权限发布
        long count = userDto.getUserProjectPermissionList().stream().filter(userProjectPermissionDto -> Objects.equals(userProjectPermissionDto.getProjectId(), projectDto.getId())).filter(userProjectPermissionDto -> userProjectPermissionDto.getProjectEnv().contains(projectDto.getEnv().toString())).count();
        if (count == 0) {
            if (userDto.getRoleType() != RoleType.SUPER_ADMIN) {
                response.getWriter().print(objectMapper.writeValueAsString(new JsonResult<>("10021", "没有此项目发布权限")));
                response.getWriter().close();
                return false;
            }
        }

        return super.preHandle(request, response, handler);
    }
}
