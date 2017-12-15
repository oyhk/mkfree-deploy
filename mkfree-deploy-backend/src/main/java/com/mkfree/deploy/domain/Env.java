package com.mkfree.deploy.domain;

import javax.persistence.Column;
import javax.persistence.Entity;

/**
 * Created by oyhk on 2017/12/14.
 *
 */
@Entity
public class Env extends IDEntity {

    public static final String CLASS_NAME = "env";

    @Column(columnDefinition = "varchar(100) comment '环境名称'",unique = true)
    private String name;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
