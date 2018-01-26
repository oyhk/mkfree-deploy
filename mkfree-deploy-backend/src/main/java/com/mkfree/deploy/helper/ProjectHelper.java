package com.mkfree.deploy.helper;

import com.jcraft.jsch.JSch;
import com.jcraft.jsch.Session;
import com.mkfree.deploy.common.Shell;
import com.mkfree.deploy.domain.Project;
import com.mkfree.deploy.domain.ProjectBuildStep;
import com.mkfree.deploy.domain.ProjectTag;
import com.mkfree.deploy.domain.enumclass.ProjectBuildStepType;
import com.mkfree.deploy.repository.ProjectBuildStepRepository;
import com.mkfree.deploy.repository.ProjectTagRepository;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.exception.ExceptionUtils;
import org.apache.commons.lang3.text.StrSubstitutor;
import org.slf4j.Logger;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.nio.charset.Charset;
import java.util.List;
import java.util.Map;

/**
 * Created by oyhk on 2017/8/13.
 *
 *
 */
public class ProjectHelper {

    public static void setProjectTag(Long projectTagId, Project project, ProjectTagRepository projectTagRepository) {
        if (projectTagId != null) {
            ProjectTag projectTag = projectTagRepository.findOne(projectTagId);
            if (projectTag != null) {
                project.setProjectTagId(projectTagId);
                project.setProjectTagName(projectTag.getName());
            }
        }
    }

    /**
     * 执行从发布服务器同步
     *
     * @param publishServerUsername 发布服务器ssh用户名
     * @param publishServerIp
     * @param publishServerPort
     * @param publishServerPassword
     * @param serverUsername
     * @param serverIp
     * @param serverPort
     * @param serverPassword
     * @param publishVersion
     * @param projectRemotePath
     * @param log
     */
    public static void serverSync(String publishServerUsername, String publishServerIp, int publishServerPort, String publishServerPassword, String serverUsername, String serverIp, String serverPort, String serverPassword, String publishVersion, String projectRemotePath, Logger log,StringBuilder stringBuilder) {
        try {
            Shell shell = new Shell();
            shell.append("scp -o StrictHostKeyChecking=no -P #{port} -r #{remoteProjectPath}/version/#{projectVersionDir}  #{username}@#{ip}:#{remoteProjectPath}/version");
            shell.addParams("port", serverPort);
            shell.addParams("projectVersionDir", publishVersion);
            shell.addParams("username", serverUsername);
            shell.addParams("ip", serverIp);
            shell.addParams("remoteProjectPath", projectRemotePath);
            String scpCommand = shell.getShell();
            log.info("Starting from the publish server synchronization...");
            log.info("exec command");
            log.info(scpCommand);

            JSch jsch = new JSch();
            Session session = jsch.getSession(publishServerUsername, publishServerIp, publishServerPort);
            session.setConfig("StrictHostKeyChecking", "no");
            session.setPassword(publishServerPassword);
            session.connect();
            com.jcraft.jsch.ChannelExec channelExec = (com.jcraft.jsch.ChannelExec) session.openChannel("exec");
            channelExec.setCommand(scpCommand);
            channelExec.setPty(true);
            channelExec.setErrStream(System.err);
            channelExec.setInputStream(null);
            channelExec.connect();
            InputStream inputStream = channelExec.getInputStream();
            // 这里为什么需要睡眠2秒，由于session连接后发送命令需要时间
            Thread.sleep(2000);
            OutputStream out = channelExec.getOutputStream();
            out.write((serverPassword + "\n").getBytes());
            out.flush();
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
