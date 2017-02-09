package com.mkfree.deploy.domain;

import javax.persistence.Column;
import javax.persistence.Entity;

/**
 * 项目构建历史详细
 * Created by zhangjh on 2017/2/8.
 */
@Entity
public class ProjectStructureLogDetail extends IDEntity {

    @Column(columnDefinition = "bigint comment '构建id'")
    private Long projectStructureLogId;

    @Column(columnDefinition = "longtext comment '用户id'")
    private String description;

    public Long getProjectStructureLogId() {
        return projectStructureLogId;
    }

    public void setProjectStructureLogId(Long projectStructureLogId) {
        this.projectStructureLogId = projectStructureLogId;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
