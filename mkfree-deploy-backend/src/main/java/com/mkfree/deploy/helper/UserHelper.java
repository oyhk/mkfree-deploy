package com.mkfree.deploy.helper;

import com.mkfree.deploy.domain.User;
import com.mkfree.deploy.domain.UserProjectPermission;
import com.mkfree.deploy.dto.UserDto;
import com.mkfree.deploy.dto.UserProjectPermissionDto;
import org.apache.commons.codec.digest.DigestUtils;

import javax.servlet.http.HttpServletRequest;
import java.util.Date;
import java.util.List;

/**
 * Created by oyhk on 2017/1/23.
 */
public enum UserHelper {

    SINGLEONE;


    /**
     * 获取登录session
     * @param request
     * @return
     */
    public UserDto getSession(HttpServletRequest request) {
        return (UserDto) request.getSession().getAttribute(User.LOGIN_USER);
    }

    /**
     * 设置session
     * @param request
     * @param user
     * @param userProjectPermissionDtoList
     * @return
     */
    public UserDto setSession(HttpServletRequest request, User user, List<UserProjectPermissionDto> userProjectPermissionDtoList) {
        UserDto userDto = new UserDto();
        userDto.setId(user.getId());
        userDto.setUsername(user.getUsername());
        userDto.setRoleType(user.getRoleType());

        // 项目权限
        userDto.setUserProjectPermissionList(userProjectPermissionDtoList);
        request.getSession().setAttribute(User.LOGIN_USER, userDto);
        return userDto;
    }

    /**
     * 通过明文的密码，获取md5后的密码
     * @param password 密码
     * @param passwordSalt 密码盐
     * @return
     */
    public String getMd5Password(String passwordSalt, String password) {
        return DigestUtils.md5Hex(User.SSO_PASSWORD_ENCODE_KEY + passwordSalt + password);
    }

    /**
     * 生成userToken
     * @param userId
     * @param username
     * @return
     */
    public String getAccessToken(Long userId, String username) {
        return DigestUtils.md5Hex(new Date().getTime() + userId + username);
    }
}
