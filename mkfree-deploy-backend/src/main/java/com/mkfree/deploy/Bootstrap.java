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
import org.springframework.web.socket.config.annotation.EnableWebSocket;

import java.io.BufferedReader;
import java.io.InputStreamReader;

/**
 * Created by oyhk on 17/1/22.
 *
 */
@SpringBootApplication
@EnableAutoConfiguration(exclude = {FreeMarkerAutoConfiguration.class, WebSocketAutoConfiguration.class, GsonAutoConfiguration.class, JmxAutoConfiguration.class})
@EnableWebSocket
public class Bootstrap {

    public static void main(String[] args) throws Exception {
        SpringApplication app = new SpringApplication(Bootstrap.class);
        app.setBannerMode(Banner.Mode.LOG);
        ApplicationContext applicationContext = app.run(args);



    }

}
