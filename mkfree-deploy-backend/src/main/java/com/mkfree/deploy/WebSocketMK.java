package com.mkfree.deploy;

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.exception.ExceptionUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import javax.websocket.*;
import javax.websocket.server.ServerEndpoint;
import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Created by oyhk on 2018/3/5.
 */
@ServerEndpoint(value = "/api/websocket")
@Component
public class WebSocketMK {

    private Logger log = LoggerFactory.getLogger(this.getClass());

    public static final ConcurrentHashMap<String, WebSocketMK> WEB_SOCKET_SESSION_MAP = new ConcurrentHashMap<>();

    // 构建日志websocket session key
    public static final String WEB_SOCKET_LOG_PREFIX = "type=buildLog&projectId=";

    private Session session;

    /**
     * 客户端建立连接成功调用
     */
    @OnOpen
    public void onOpen(Session session) {
        this.session = session;
        String sessionKey = session.getQueryString();
        WEB_SOCKET_SESSION_MAP.put(sessionKey, this);
        // sessionKey 规则 username=oyhk&type=buildLog&projectId
        log.info("client connection, sessionKey : {}", sessionKey);
    }

    /**
     * 连接关闭调用的方法
     */
    @OnClose
    public void onClose() {
        String sessionKey = this.session.getQueryString();
        WEB_SOCKET_SESSION_MAP.remove(sessionKey);  //从set中删除
        log.info("client disconnect, sessionKey : {}", sessionKey);
    }

    /**
     * 收到客户端消息后调用的方法
     * 客户端发送过来的消息
     * @param message
     * */
    @OnMessage
    public void onMessage(String message, Session session) {
        log.info("receive client message : {}", message);
    }

    /**
     * 发生异常时调用
     * @param session
     * @param error
     */
    @OnError
    public void onError(Session session, Throwable error) {
    }

    /**
     * 用于主动推送信息
     * @param message
     * @throws IOException
     */
    public void sendMessage(String message) {
        try {
            this.session.getBasicRemote().sendText(message);
        } catch (IOException e) {
            log.error(ExceptionUtils.getStackTrace(e));
        }
    }

    /**
     * 群发
     * @param message
     */
    public static void sendMessageAll(String pattern, String message) {
        WebSocketMK.WEB_SOCKET_SESSION_MAP.forEach((s, webSocketMK) -> {
            if (StringUtils.isNotBlank(pattern) && s.contains(pattern)) {
                webSocketMK.sendMessage(message);
            }
        });
    }

    /**
     * 群发
     * @param message
     */
    public static void sendMessageAll(String message) {
        WebSocketMK.WEB_SOCKET_SESSION_MAP.forEach((s, webSocketMK) -> {
            webSocketMK.sendMessage(message);
        });
    }
}
