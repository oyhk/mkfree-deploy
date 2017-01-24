package com.mkfree.deploy.domain;

import javax.persistence.Column;
import javax.persistence.Entity;

/**
 * Created by oyhk on 2017/1/23.
 *
 */
@Entity
public class Role extends IDEntity {

    @Column(columnDefinition = "varchar(100) comment '角色名称'")
    private String name;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
