package com.mkfree.deploy.helper;

import com.mkfree.deploy.domain.ProjectStructureStep;
import com.mkfree.deploy.domain.User;
import com.mkfree.deploy.domain.enumclass.ProjectEnv;
import com.mkfree.deploy.domain.enumclass.ProjectStructureStepType;
import org.apache.commons.codec.digest.DigestUtils;

import javax.servlet.http.HttpServletRequest;
import java.util.Date;

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
    public ProjectStructureStep create(String command, ProjectStructureStepType type, ProjectEnv env, Long projectId, Long projectEnvConfigId) {
        ProjectStructureStep projectStructureStep = new ProjectStructureStep();
        projectStructureStep.setProjectId(projectId);
        projectStructureStep.setStep(command);
        projectStructureStep.setType(type);
        projectStructureStep.setEnv(env);
        projectStructureStep.setProjectEnvConfigId(projectEnvConfigId);
        return projectStructureStep;
    }
}
