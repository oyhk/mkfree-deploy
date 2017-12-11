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
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.List;

/**
 * Created by oyhk on 15/11/29.
 * 自动登录过滤器
 */
public class UserInterceptor extends HandlerInterceptorAdapter {

    private final Logger log = LoggerFactory.getLogger(UserInterceptor.class);
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private UserProjectPermissionRepository userProjectPermissionRepository;
    @Autowired
    private ObjectMapper objectMapper;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        if(!request.getMethod().equals(RequestMethod.OPTIONS.toString())){
            UserDto userDto = (UserDto) request.getSession().getAttribute(User.LOGIN_USER);
            if (userDto != null) {
                return true;
            }
            String userToken = request.getHeader(User.LOGIN_ACCESS_TOKEN);
            if (StringUtils.isBlank(userToken)) {
                response.addHeader("Access-Control-Allow-Origin","*");
                response.getWriter().print(objectMapper.writeValueAsString(new JsonResult<>(JsonResult.CD104[0],JsonResult.CD104[1])));
                response.getWriter().close();
                return false;
            }

            User user = userRepository.findByAccessToken(userToken);
            if (user == null) {
                response.addHeader("Access-Control-Allow-Origin","*");
                response.getWriter().print(objectMapper.writeValueAsString(new JsonResult<>(JsonResult.CD105[0],JsonResult.CD105[1])));
                response.getWriter().close();
                return false;
            }

            List<UserProjectPermission> userProjectPermissionList = userProjectPermissionRepository.findByUserId(user.getId());
            UserHelper.SINGLEONE.setSession(request, user, UserProjectPermissionHelper.SINGLEONE.toDtoList(userProjectPermissionList, objectMapper, log));
        }

        return super.preHandle(request, response, handler);
    }
}
