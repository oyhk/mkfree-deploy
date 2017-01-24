package com.mkfree.deploy;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

/**
 * Created by oyhk on 16/5/3.
 * 自定义属性类
 */
@Component
public class Prop {

    @Value("${mysql.druidDataSource.url}")
    public String jdbcUrl;
    @Value("${mysql.druidDataSource.username}")
    public String jdbcUsername;
    @Value("${mysql.druidDataSource.password}")
    public String jdbcPassword;

}
