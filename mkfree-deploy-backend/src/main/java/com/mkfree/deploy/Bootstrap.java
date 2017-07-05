package com.mkfree.deploy;

import com.mkfree.deploy.helper.UserHelper;
import org.springframework.boot.Banner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.freemarker.FreeMarkerAutoConfiguration;
import org.springframework.boot.autoconfigure.gson.GsonAutoConfiguration;
import org.springframework.boot.autoconfigure.jmx.JmxAutoConfiguration;
import org.springframework.boot.autoconfigure.websocket.WebSocketAutoConfiguration;
import org.springframework.context.ApplicationContext;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.web.socket.config.annotation.EnableWebSocket;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.HashMap;
import java.util.Map;
import java.util.Queue;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Created by oyhk on 17/1/22.
 *
 */
@SpringBootApplication
@EnableAutoConfiguration
@EnableScheduling
public class Bootstrap {

    // 已经构建生成的日志
    public static Map<String, Queue<String>> logQueueMap = new ConcurrentHashMap<>();
    // 构建日志队列
    public static Map<String, StringBuffer> logStringBufferMap = new ConcurrentHashMap<>();

    public static void main(String[] args) throws Exception {
        SpringApplication app = new SpringApplication(Bootstrap.class);
        app.setBannerMode(Banner.Mode.LOG);
        ApplicationContext applicationContext = app.run(args);
    }

}
