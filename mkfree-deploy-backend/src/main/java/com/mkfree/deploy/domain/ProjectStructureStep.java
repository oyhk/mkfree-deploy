package com.mkfree.deploy.domain;

import com.mkfree.deploy.domain.enumclass.ProjectEnv;
import com.mkfree.deploy.domain.enumclass.ProjectStructureStepType;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;

/**
 * Created by oyhk on 2017/2/6.
 * 项目构建步骤
 */
@Entity
public class ProjectStructureStep extends IDEntity {


    @Column(columnDefinition = "bigint comment '项目id'")
    private Long projectId;
    @Column(columnDefinition = "text comment '构建步骤内容'")
    private String step;
    @Column(columnDefinition = "varchar(30) comment '类型'")
    @Enumerated(EnumType.STRING)
    private ProjectStructureStepType type;
    @Column(columnDefinition = "bigint comment '项目环境配置id'")
    private Long projectEnvConfigId;
    @Column(columnDefinition = "varchar(30) comment '环境'")
    @Enumerated(EnumType.STRING)
    private ProjectEnv env;

    public ProjectEnv getEnv() {
        return env;
    }

    public void setEnv(ProjectEnv env) {
        this.env = env;
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

    public ProjectStructureStepType getType() {
        return type;
    }

    public void setType(ProjectStructureStepType type) {
        this.type = type;
    }

    public Long getProjectEnvConfigId() {
        return projectEnvConfigId;
    }

    public void setProjectEnvConfigId(Long projectEnvConfigId) {
        this.projectEnvConfigId = projectEnvConfigId;
    }
}
