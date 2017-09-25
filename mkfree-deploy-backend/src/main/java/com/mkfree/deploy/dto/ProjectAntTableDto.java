package com.mkfree.deploy.dto;

import com.mkfree.deploy.domain.Project;
import com.mkfree.deploy.domain.enumclass.ProjectEnv;

import java.util.Date;

/**
 *
 * Created by oyhk on 2017/2/6.
 *
 */
public class ProjectAntTableDto extends Project {

    // 服务器ip
    private String ip;
    // 是否发布机器
    private Boolean isPublish;

    private ProjectEnv projectEnv;
    // 发布时间
    private Date publishTime;
    // 发布版本
    private String publishVersion;


    private Integer projectNameAntTableRowSpan;
    private Integer projectEnvAntTableRowSpan;

    public Date getPublishTime() {
        return publishTime;
    }

    public void setPublishTime(Date publishTime) {
        this.publishTime = publishTime;
    }

    public Integer getProjectEnvAntTableRowSpan() {
        return projectEnvAntTableRowSpan;
    }

    public void setProjectEnvAntTableRowSpan(Integer projectEnvAntTableRowSpan) {
        this.projectEnvAntTableRowSpan = projectEnvAntTableRowSpan;
    }

    public String getProjectEnvText() {
        if(projectEnv == null){
            return null;
        }
        return projectEnv.getText();
    }

    public String getIp() {
        return ip;
    }

    public void setIp(String ip) {
        this.ip = ip;
    }

    public ProjectEnv getProjectEnv() {
        return projectEnv;
    }

    public void setProjectEnv(ProjectEnv projectEnv) {
        this.projectEnv = projectEnv;
    }

    public Integer getProjectNameAntTableRowSpan() {
        return projectNameAntTableRowSpan;
    }

    public void setProjectNameAntTableRowSpan(Integer projectNameAntTableRowSpan) {
        this.projectNameAntTableRowSpan = projectNameAntTableRowSpan;
    }

    public String getPublishVersion() {
        return publishVersion;
    }

    public void setPublishVersion(String publishVersion) {
        this.publishVersion = publishVersion;
    }

    public Boolean getPublish() {
        return isPublish;
    }

    public void setPublish(Boolean publish) {
        isPublish = publish;
    }
}
