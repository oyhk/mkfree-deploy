package com.mkfree.deploy.domain;

import javax.persistence.Column;
import javax.persistence.Entity;

/**
 * Created by oyhk on 2017/2/6.
 */
@Entity
public class SystemConfig extends IDEntity {
    @Column(columnDefinition = "varchar(255) comment '项目根路劲'")
    private String projectPath;
    @Column(columnDefinition = "varchar(255) comment '安装路劲'")
    private String installPath;

    public String getProjectPath() {
        return projectPath;
    }

    public void setProjectPath(String projectPath) {
        this.projectPath = projectPath;
    }

    public String getInstallPath() {
        return installPath;
    }

    public void setInstallPath(String installPath) {
        this.installPath = installPath;
    }
}
