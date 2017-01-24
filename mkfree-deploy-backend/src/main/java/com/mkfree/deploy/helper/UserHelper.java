package com.mkfree.deploy.helper;

import com.mkfree.deploy.domain.User;
import org.apache.commons.codec.digest.DigestUtils;

import javax.servlet.http.HttpServletRequest;
import java.util.Date;

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
    public User getSession(HttpServletRequest request) {
        return (User) request.getSession().getAttribute(User.LOGIN_USER);
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
    public String getUserToken(Long userId, String username) {
        return DigestUtils.md5Hex(new Date().getTime() + userId + username);
    }
}
