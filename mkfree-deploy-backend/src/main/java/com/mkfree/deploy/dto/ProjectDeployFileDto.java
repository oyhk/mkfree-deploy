package com.mkfree.deploy.dto;

import com.mkfree.deploy.domain.enumclass.ProjectEnv;
import com.mkfree.deploy.domain.enumclass.Whether;

import javax.persistence.Column;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import java.util.List;

/**
 * Created by oyhk on 2017/2/6.
 *
 */
public class ProjectDeployFileDto extends DtoEntity {

    //本地文件路劲
    private String localFilePath;
    //远程服务文件路劲
    private String remoteFilePath;
    //项目id
    private Long projectId;
    //是否启用
    private Whether isEnable;

    public String getLocalFilePath() {
        return localFilePath;
    }

    public void setLocalFilePath(String localFilePath) {
        this.localFilePath = localFilePath;
    }

    public String getRemoteFilePath() {
        return remoteFilePath;
    }

    public void setRemoteFilePath(String remoteFilePath) {
        this.remoteFilePath = remoteFilePath;
    }

    public Long getProjectId() {
        return projectId;
    }

    public void setProjectId(Long projectId) {
        this.projectId = projectId;
    }

    public Whether getIsEnable() {
        return isEnable;
    }

    public void setIsEnable(Whether isEnable) {
        this.isEnable = isEnable;
    }
}
