package com.mkfree.deploy.domain;

import com.mkfree.deploy.domain.enumclass.ProjectEnv;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;

/**
 * Created by oyhk on 2017/2/7.
 *
 */
@Entity
public class ProjectEnvConfig extends IDEntity {

    //项目id
    @Column(columnDefinition = "bigint comment '项目id'")
    private Long projectId;
    @Column(columnDefinition = "varchar(50) comment '项目名称'")
    private String projectName;
    //环境类型
    @Column(columnDefinition = "varchar(50) comment '环境类型'")
    @Enumerated(EnumType.STRING)
    private ProjectEnv env;
    //需要发布的服务机器ip列表 ["192.168.1.241","192.168.1.211"]
    @Column(columnDefinition = "varchar(255) comment '需要发布的服务机器ip列表 [\"192.168.1.241\",\"192.168.1.211\"]'", name = "serverMachineList")
    private String serverMachineIp;
    //发布分支名称
    @Column(columnDefinition = "varchar(255) comment '发布分支名称'")
    private String publicBranch;


    public String getEnvText() {
        if (this.env != null) {
            return this.env.getText();
        }
        return null;
    }

    public ProjectEnv getEnv() {
        return env;
    }

    public void setEnv(ProjectEnv env) {
        this.env = env;
    }

    public String getServerMachineIp() {
        return serverMachineIp;
    }

    public void setServerMachineIp(String serverMachineIp) {
        this.serverMachineIp = serverMachineIp;
    }

    public String getPublicBranch() {
        return publicBranch;
    }

    public void setPublicBranch(String publicBranch) {
        this.publicBranch = publicBranch;
    }

    public Long getProjectId() {
        return projectId;
    }

    public void setProjectId(Long projectId) {
        this.projectId = projectId;
    }

    public String getProjectName() {
        return projectName;
    }

    public void setProjectName(String projectName) {
        this.projectName = projectName;
    }
}
