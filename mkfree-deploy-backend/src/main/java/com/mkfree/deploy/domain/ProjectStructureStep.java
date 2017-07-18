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


    //项目id
    @Column(columnDefinition = "bigint")
    private Long projectId;
    @Column
    private String projectName;
    //构建步骤内容
    @Column(columnDefinition = "varchar(2000)")
    private String step;
    //类型
    @Column(columnDefinition = "varchar(30)")
    @Enumerated(EnumType.STRING)
    private ProjectStructureStepType type;
    //项目环境配置id
    @Column(columnDefinition = "bigint")
    private Long projectEnvConfigId;
    //环境
    @Column(columnDefinition = "varchar(30)")
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

    public String getProjectName() {
        return projectName;
    }

    public void setProjectName(String projectName) {
        this.projectName = projectName;
    }
}
