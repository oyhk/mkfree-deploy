package com.mkfree.deploy.domain;

import javax.persistence.Column;
import javax.persistence.Entity;

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
    @Column(columnDefinition = "bigint comment '环境id'", nullable = false)
    private Long envId;
    @Column(columnDefinition = "varchar(50) comment '环境名称'", nullable = false)
    private String envName;
    @Column(columnDefinition = "int(11) comment '环境排序'", nullable = false)
    private Integer envSort;
    //发布分支名称
    @Column(columnDefinition = "varchar(255) comment '发布分支名称'")
    private String publicBranch;
    @Column(columnDefinition = "bit default 0 comment '选择分支发布'")
    private Boolean selectBranch;
    @Column(columnDefinition = "bigint comment '同步环境id'")
    private Long syncEnvId;
    @Column(columnDefinition = "varchar(50) comment '环境名称'")
    private String syncEnvName;
    @Column(columnDefinition = "bigint comment '同步服务器id'")
    private Long syncServerMachineId;
    private String syncServerMachineIp;
    @Column(columnDefinition = "varchar(100) comment '同步服务器名称'")
    private String syncServerMachineName;
    @Column(columnDefinition = "varchar(255) comment 'eurekaUrl'")
    private String eurekaUrl;
    @Column(columnDefinition = "bit default 0 comment '是否启用Eureka，默认 false'")
    private Boolean eurekaEnable = false;

    public String getSyncEnvName() {
        return syncEnvName;
    }

    public void setSyncEnvName(String syncEnvName) {
        this.syncEnvName = syncEnvName;
    }

    public Long getSyncEnvId() {
        return syncEnvId;
    }

    public void setSyncEnvId(Long syncEnvId) {
        this.syncEnvId = syncEnvId;
    }

    public String getSyncServerMachineIp() {
        return syncServerMachineIp;
    }

    public void setSyncServerMachineIp(String syncServerMachineIp) {
        this.syncServerMachineIp = syncServerMachineIp;
    }

    public String getSyncServerMachineName() {
        return syncServerMachineName;
    }

    public void setSyncServerMachineName(String syncServerMachineName) {
        this.syncServerMachineName = syncServerMachineName;
    }

    public Long getSyncServerMachineId() {
        return syncServerMachineId;
    }

    public void setSyncServerMachineId(Long syncServerMachineId) {
        this.syncServerMachineId = syncServerMachineId;
    }

    public Boolean getSelectBranch() {
        return selectBranch;
    }

    public void setSelectBranch(Boolean selectBranch) {
        this.selectBranch = selectBranch;
    }


    public Integer getEnvSort() {
        return envSort;
    }

    public void setEnvSort(Integer envSort) {
        this.envSort = envSort;
    }

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

    public String getEurekaUrl() {
        return eurekaUrl;
    }

    public void setEurekaUrl(String eurekaUrl) {
        this.eurekaUrl = eurekaUrl;
    }

    public Boolean getEurekaEnable() {
        return eurekaEnable;
    }

    public void setEurekaEnable(Boolean eurekaEnable) {
        this.eurekaEnable = eurekaEnable;
    }
}
