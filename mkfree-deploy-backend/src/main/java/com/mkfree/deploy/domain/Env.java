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

    @Column(columnDefinition = "varchar(100) comment '环境名称'", unique = true)
    private String name;
    @Column(columnDefinition = "int(2) comment '环境排序'")
    private Integer sort;

    public Integer getSort() {
        return sort;
    }

    public void setSort(Integer sort) {
        this.sort = sort;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
