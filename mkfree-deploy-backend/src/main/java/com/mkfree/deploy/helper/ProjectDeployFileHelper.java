package com.mkfree.deploy.helper;

import com.mkfree.deploy.domain.ProjectDeployFile;
import com.mkfree.deploy.domain.ProjectStructureStep;
import com.mkfree.deploy.domain.enumclass.ProjectEnv;
import com.mkfree.deploy.domain.enumclass.ProjectStructureStepType;
import com.mkfree.deploy.domain.enumclass.Whether;
import com.mkfree.deploy.dto.ProjectDeployFileDto;

/**
 * Created by oyhk on 2017/1/23.
 */
public enum ProjectDeployFileHelper {

    SINGLEONE;

    public ProjectDeployFile create(Whether isEnable,String localFilePath,String remoteFilePath, Long projectId) {
        ProjectDeployFile projectDeployFile = new ProjectDeployFile();
        projectDeployFile.setIsEnable(isEnable);
        projectDeployFile.setLocalFilePath(localFilePath);
        projectDeployFile.setRemoteFilePath(remoteFilePath);
        projectDeployFile.setProjectId(projectId);
        return projectDeployFile;
    }
}
