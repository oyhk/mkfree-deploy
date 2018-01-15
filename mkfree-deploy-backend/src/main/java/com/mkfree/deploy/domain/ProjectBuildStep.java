package com.mkfree.deploy.domain;

import com.mkfree.deploy.domain.enumclass.ProjectBuildStepType;
import com.mkfree.deploy.domain.enumclass.ProjectEnv;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;

/**
 * Created by oyhk on 2017/2/6.
 * 项目构建步骤
 */
@Entity
public class ProjectBuildStep extends IDEntity {


    //项目id
    @Column(columnDefinition = "bigint comment '项目id'")
    private Long projectId;
    @Column(columnDefinition = "varchar(200) comment '项目名称'")
    private String projectName;
    //构建步骤内容
    @Column(columnDefinition = "varchar(2000) comment '执行命令'")
    private String step;
    //类型
    @Column(columnDefinition = "varchar(30) comment '命令类型'")
    @Enumerated(EnumType.STRING)
    private ProjectBuildStepType type;
    //项目环境配置id
    @Column(columnDefinition = "bigint comment '项目环境配置id'")
    private Long projectEnvConfigId;
    @Column(columnDefinition = "bigint comment '环境id'")
    private Long envId;
    @Column(columnDefinition = "varchar(30) comment '环境名称'")
    private String envName;

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

    public Long getProjectId() {
        return projectId;
    }

    public void setProjectId(Long projectId) {
        this.projectId = projectId;
    }

    public String getStep() {
        return step;
    }

    public void setStep(String step) {
        this.step = step;
    }

    public ProjectBuildStepType getType() {
        return type;
    }

    public void setType(ProjectBuildStepType type) {
        this.type = type;
    }

    public Long getProjectEnvConfigId() {
        return projectEnvConfigId;
    }

    public void setProjectEnvConfigId(Long projectEnvConfigId) {
        this.projectEnvConfigId = projectEnvConfigId;
    }

    public String getProjectName() {
        return projectName;
    }

    public void setProjectName(String projectName) {
        this.projectName = projectName;
    }

}
