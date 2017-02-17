package com.mkfree.deploy.dto;

import com.mkfree.deploy.domain.enumclass.RoleType;
import com.mkfree.deploy.domain.enumclass.ServerMachineType;

import javax.persistence.Column;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import java.util.List;

/**
 *
 * Created by oyhk on 2017/2/6.
 *
 */
public class ServerMachineDto extends DtoEntity {


    //IP地址
    private String ip;
    //名称
    private String name;
    //ssh端口
    private String port;
    //ssh用户名
    private String username;
    //密码
    private String password;
    //机器类型
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

    public ServerMachineType getType() {
        return type;
    }

    public void setType(ServerMachineType type) {
        this.type = type;
    }
}
