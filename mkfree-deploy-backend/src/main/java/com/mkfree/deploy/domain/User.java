package com.mkfree.deploy.domain;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Transient;

/**
 * Created by oyhk on 2017/1/23.
 * 用户
 */
@Entity
public class User extends IDEntity {

    public static final String SSO_PASSWORD_ENCODE_KEY = "13fkljsldf324safd123slkdfj";

    public static final String LOGIN_USER = "login_user";

    @Column(columnDefinition = "varchar (100) comment '用户名'",unique = true)
    private String username;
    @Column(columnDefinition = "varchar (100) comment '密码'")
    private String password;
    @Column(columnDefinition = "varchar (100) comment '密码盐'")
    private String passwordSalt;
    @Column(columnDefinition = "varchar (100) comment '登录后的userToken'")
    private String userToken;

    /*******下面是 Transient 字段 start ********/

    /*******下面是 Transient 字段 end ********/

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

    public String getUserToken() {
        return userToken;
    }

    public void setUserToken(String userToken) {
        this.userToken = userToken;
    }

    public String getPasswordSalt() {
        return passwordSalt;
    }

    public void setPasswordSalt(String passwordSalt) {
        this.passwordSalt = passwordSalt;
    }
}
