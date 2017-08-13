package com.mkfree.deploy.domain;

import javax.persistence.Column;
import javax.persistence.Entity;

/**
 * Created by oyhk on 2017/2/6.
 * 系统配置使用 纵表设计
 */
@Entity
public class SystemConfig extends IDEntity {

    //项目根路劲
    public static final String keyProjectPath = "projectPath";
    // 项目构建后目录
    public static final String keyBuildPath = "buildPath";
    //安装路劲
    public static final String keyInstallPath = "installPath";

    @Column(columnDefinition = "varchar(255)  comment '属性键'", unique = true, name = "p_key")
    private String key;
    @Column(columnDefinition = "varchar(255)  comment '属性值'", name = "p_value")
    private String value;

    public String getKey() {
        return key;
    }

    public void setKey(String key) {
        this.key = key;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }
}
