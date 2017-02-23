package com.mkfree.deploy.domain;

import com.mkfree.deploy.domain.enumclass.ProjectStructureLogStatus;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;

/**
 * 项目构建历史
 * Created by zhangjh on 2017/2/8.
 */
@Entity
public class ProjectStructureLog extends IDEntity {

    @Column(columnDefinition = "varchar (100) comment '构建名'")
    private String name;

    @Column(columnDefinition = "bigint comment '用户id'")
    private Long userId;

    @Column(columnDefinition = "varchar (100) comment '用户名'")
    private String username;

    @Column(columnDefinition = "bigint comment '项目id'")
    private Long projectId;
    @Column(columnDefinition = "varchar (100) comment '构建日志状态'")
    @Enumerated(EnumType.STRING)
    private ProjectStructureLogStatus status = ProjectStructureLogStatus.PROCESSING;

    @Column(columnDefinition = "varchar (100) comment '项目名'")
    private String projectName;

    @Column(columnDefinition = "bigint comment '构建序列号，递增'")
    private Long seqNo;

    @Column(columnDefinition = "longtext comment '详细日志'")
    private String description;

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
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

    public Long getSeqNo() {
        return seqNo;
    }

    public void setSeqNo(Long seqNo) {
        this.seqNo = seqNo;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public ProjectStructureLogStatus getStatus() {
        return status;
    }

    public void setStatus(ProjectStructureLogStatus status) {
        this.status = status;
    }
}
