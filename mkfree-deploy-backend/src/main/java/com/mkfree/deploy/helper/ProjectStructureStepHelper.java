package com.mkfree.deploy.helper;

import com.mkfree.deploy.domain.ProjectBuildStep;
import com.mkfree.deploy.domain.enumclass.ProjectEnv;
import com.mkfree.deploy.domain.enumclass.ProjectBuildStepType;

/**
 * Created by oyhk on 2017/1/23.
 */
public enum ProjectStructureStepHelper {

    SINGLEONE;

    /**
     * 创建一个构建执行步骤
     * @param command
     * @param type
     * @param projectId
     * @return
     */
    public ProjectBuildStep create(String command, ProjectBuildStepType type, ProjectEnv env, Long projectId, String projectName, Long projectEnvConfigId) {
        ProjectBuildStep projectBuildStep = new ProjectBuildStep();
        projectBuildStep.setProjectId(projectId);
        projectBuildStep.setProjectName(projectName);
        projectBuildStep.setStep(command);
        projectBuildStep.setType(type);
        projectBuildStep.setEnv(env);
        projectBuildStep.setProjectEnvConfigId(projectEnvConfigId);
        return projectBuildStep;
    }
}
