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

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
