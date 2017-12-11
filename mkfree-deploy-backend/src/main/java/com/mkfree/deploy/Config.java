package com.mkfree.deploy;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mkfree.deploy.interceptor.RoleInterceptor;
import com.mkfree.deploy.interceptor.UserInterceptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.autoconfigure.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;

import javax.sql.DataSource;
import java.util.HashMap;
import java.util.Map;
import java.util.Queue;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

@Configuration
public class Config {

    public static final String ENV_PROD = "prod";
    public static final String ENV_LOCAL = "local";

    public static final Map<String,StringBuilder> STRING_BUILDER_MAP = new ConcurrentHashMap<>();

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
    RequestLoggingFilter requestLoggingFilter(){
        return new RequestLoggingFilter();
    }

    @Bean
    RoleInterceptor roleInterceptor() {
        return new RoleInterceptor();
    }

    @Bean
    UserInterceptor userInterceptor() {
        return new UserInterceptor();
    }

    @Bean
    Prop prop() {
        return new Prop();
    }

}