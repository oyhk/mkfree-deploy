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
    @Column(columnDefinition = "varchar(50)")
    private String ip;
    //名称
    @Column(columnDefinition = "varchar(50)")
    private String name;
    //ssh端口
    @Column(columnDefinition = "varchar(50)")
    private String port;
    //ssh用户名
    @Column(columnDefinition = "varchar(50)")
    private String username;
    //密码
    @Column(columnDefinition = "varchar(50)")
    private String password;
    //机器类型
    @Column(columnDefinition = "varchar(50)")
    @Enumerated(EnumType.STRING)
    private ServerMachineType type;

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

    public ServerMachineType getType() {
        return type;
    }

    public void setType(ServerMachineType type) {
        this.type = type;
    }
}
