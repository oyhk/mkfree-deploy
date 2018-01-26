package com.mkfree.deploy.common;

import com.jcraft.jsch.ChannelExec;
import com.jcraft.jsch.JSch;
import com.jcraft.jsch.JSchException;
import com.jcraft.jsch.Session;
import org.apache.commons.lang3.exception.ExceptionUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.nio.charset.Charset;

/**
 * Created by oyhk on 2018/1/25.
 */
public class JschUtils {

    private static Logger log = LoggerFactory.getLogger(JschUtils.class);


    public static Session createSession(String username, String password, String ip, int port) {
        Session session = null;
        try {
            JSch jSch = new JSch();
            session = jSch.getSession(username, ip, port);
            session.setConfig("StrictHostKeyChecking", "no");
            session.setPassword(password);
            session.connect();
        } catch (Exception e) {
            log.error(ExceptionUtils.getStackTrace(e));
        }
        return session;
    }

    public static void exec(Session session, String command,StringBuilder stringBuilder) {
        try {
            ChannelExec channelExec = (com.jcraft.jsch.ChannelExec) session.openChannel("exec");
            channelExec.setCommand(command);
            channelExec.setErrStream(System.err);
            channelExec.setInputStream(null);
            channelExec.connect();
            InputStream inputStream = channelExec.getInputStream();
            BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream, Charset.forName("UTF-8")));
            String buf;
            while ((buf = reader.readLine()) != null) {
                log.info(buf);
                stringBuilder.append(buf).append("</br>");
            }
            while (!channelExec.isClosed())
                Thread.sleep(500);
            channelExec.disconnect();
            session.disconnect();
        } catch (Exception e) {
            log.error(ExceptionUtils.getStackTrace(e));
        }
    }

}
