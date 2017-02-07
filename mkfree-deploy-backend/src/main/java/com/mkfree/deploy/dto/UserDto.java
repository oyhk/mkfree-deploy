package com.mkfree.deploy.dto;

import com.mkfree.deploy.domain.enumclass.ProjectEnv;

import javax.persistence.Column;
import java.util.List;

/**
 *
 * Created by oyhk on 2017/2/6.
 *
 */
public class UserDto extends DtoEntity {


    //用户名
    private String username;
    //密码
    private String password;
    //密码盐
    private String passwordSalt;
    //登录后的userToken
    private String userToken;

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getPasswordSalt() {
        return passwordSalt;
    }

    public void setPasswordSalt(String passwordSalt) {
        this.passwordSalt = passwordSalt;
    }

    public String getUserToken() {
        return userToken;
    }

    public void setUserToken(String userToken) {
        this.userToken = userToken;
    }
}
