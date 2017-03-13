package com.mkfree.deploy;

import com.alibaba.druid.pool.DruidDataSource;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;

import javax.sql.DataSource;
import java.util.HashMap;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

@Configuration
public class Config {

    /**
     * 公共线程池
     *
     * @return
     */
    @Bean
    ExecutorService commonExecutorService() {
        return Executors.newCachedThreadPool();
    }

    @Bean
    ObjectMapper objectMapper() {
        return new ObjectMapper();
    }

    @Bean
    NamedParameterJdbcTemplate namedParameterJdbcTemplate(DataSource dataSource) {
        return new NamedParameterJdbcTemplate(dataSource);
    }

    /**
     * 数据库连接池
     * @return
     */
    @Bean
    DataSource druidDataSource() {

        DruidDataSource dataSource = new DruidDataSource();
        dataSource.setMaxActive(100);
        dataSource.setUrl(prop.jdbcUrl);
        dataSource.setUsername(prop.jdbcUsername);
        dataSource.setPassword(prop.jdbcPassword);
        return dataSource;
    }

    /**
     * 配置文件
     */
    @Autowired
    private Prop prop;

}