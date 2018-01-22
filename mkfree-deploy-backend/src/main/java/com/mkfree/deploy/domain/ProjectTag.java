package com.mkfree.deploy.domain;

import javax.persistence.Column;
import javax.persistence.Entity;

/**
 * Created by oyhk on 2017/9/23.
 *
 */
@Entity
public class ProjectTag extends IDEntity {

    //项目tag名称
    @Column(columnDefinition = "varchar (50) comment '名称'", unique = true)
    private String name;
    @Column(columnDefinition = "bit comment '状态 1：启用 0：禁用'")
    private Boolean status;


    public String getStatusText() {
        if (status != null && status) {
            return "启用";
        }
        return "禁用";
    }

    public Boolean getStatus() {
        return status;
    }

    public void setStatus(Boolean status) {
        this.status = status;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
