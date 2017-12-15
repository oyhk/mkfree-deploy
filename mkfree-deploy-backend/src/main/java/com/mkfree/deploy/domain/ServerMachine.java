package com.mkfree.deploy.domain;

import com.mkfree.deploy.domain.enumclass.ServerMachineType;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;

/**
 * Created by oyhk on 2017/2/4.
 *
 */
@Entity
public class ServerMachine extends IDEntity {

    //IP地址
    @Column(columnDefinition = "varchar(50) comment 'IP地址'")
    private String ip;
    //名称
    @Column(columnDefinition = "varchar(50) comment '名称'")
    private String name;
    //ssh端口
    @Column(columnDefinition = "varchar(50) comment 'ssh端口'")
    private String port;
    //ssh用户名
    @Column(columnDefinition = "varchar(50) comment 'ssh用户名'")
    private String username;
    //密码
    @Column(columnDefinition = "varchar(50) comment '密码'")
    private String password;
    @Column(columnDefinition = "bigint comment '环境id'")
    private Long envId;
    @Column(columnDefinition = "varchar(50) comment '环境名称'")
    private String envName;

    @Column(columnDefinition = "bit default 0 comment '是否发布机器'")
    private Boolean isPublish;

    public Long getEnvId() {
        return envId;
    }

    public void setEnvId(Long envId) {
        this.envId = envId;
    }

    public String getEnvName() {
        return envName;
    }

    public void setEnvName(String envName) {
        this.envName = envName;
    }

    public String getIp() {
        return ip;
    }

    public void setIp(String ip) {
        this.ip = ip;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPort() {
        return port;
    }

    public void setPort(String port) {
        this.port = port;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public Boolean getPublish() {
        return isPublish;
    }

    public void setPublish(Boolean publish) {
        isPublish = publish;
    }
}
