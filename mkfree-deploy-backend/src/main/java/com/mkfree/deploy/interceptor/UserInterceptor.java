package com.mkfree.deploy.interceptor;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mkfree.deploy.common.JsonResult;
import com.mkfree.deploy.domain.User;
import com.mkfree.deploy.domain.UserProjectPermission;
import com.mkfree.deploy.dto.UserDto;
import com.mkfree.deploy.helper.UserHelper;
import com.mkfree.deploy.helper.UserProjectPermissionHelper;
import com.mkfree.deploy.repository.UserProjectPermissionRepository;
import com.mkfree.deploy.repository.UserRepository;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.List;

/**
 * Created by oyhk on 15/11/29.
 * 自动登录过滤器
 */
@Component
public class UserInterceptor extends HandlerInterceptorAdapter {

    private final Logger log = LoggerFactory.getLogger(UserInterceptor.class);
    @Autowired
    private UserRepository userInfoIdRepository;
    @Autowired
    private UserProjectPermissionRepository userProjectPermissionRepository;
    @Autowired
    private ObjectMapper objectMapper;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {

        UserDto userDto = (UserDto) request.getSession().getAttribute(User.LOGIN_USER);
        if (userDto != null) {
            return true;
        }
        String userToken = request.getHeader(User.LOGIN_USER_TOKEN);
        if (StringUtils.isBlank(userToken)) {
            response.getWriter().print(objectMapper.writeValueAsString(new JsonResult<>("10001", "user_token 不能为空")));
            response.getWriter().close();
            return false;
        }

        User user = userInfoIdRepository.findByUserToken(userToken);
        if (user == null) {
            response.getWriter().print(objectMapper.writeValueAsString(new JsonResult<>("10002", "user_token 无效")));
            response.getWriter().close();
            return false;
        }

        List<UserProjectPermission> userProjectPermissionList = userProjectPermissionRepository.findByUserId(user.getId());
        UserHelper.SINGLEONE.setSession(request, user, UserProjectPermissionHelper.SINGLEONE.toDtoList(userProjectPermissionList, objectMapper, log));

        return super.preHandle(request, response, handler);
    }
}