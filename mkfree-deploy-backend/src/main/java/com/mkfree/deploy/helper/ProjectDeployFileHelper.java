package com.mkfree.deploy.helper;

import com.mkfree.deploy.domain.ProjectDeployFile;

/**
 * Created by oyhk on 2017/1/23.
 */
public enum ProjectDeployFileHelper {

    SINGLEONE;

    public ProjectDeployFile create(Boolean isEnable,String localFilePath,String remoteFilePath, Long projectId,String projectName) {
        ProjectDeployFile projectDeployFile = new ProjectDeployFile();
        projectDeployFile.setEnable(isEnable);
        projectDeployFile.setLocalFilePath(localFilePath);
        projectDeployFile.setRemoteFilePath(remoteFilePath);
        projectDeployFile.setProjectId(projectId);
        projectDeployFile.setProjectName(projectName);
        return projectDeployFile;
    }
}
