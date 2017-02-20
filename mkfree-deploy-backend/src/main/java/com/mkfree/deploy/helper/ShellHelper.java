package com.mkfree.deploy.helper;

import com.mkfree.deploy.Bootstrap;
import org.slf4j.Logger;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

/**
 * Created by oyhk on 2017/2/3.
 */
public enum ShellHelper {

    SINGLEONE;

    /**
     * 运行shell文件脚本
     * @param log
     * @param command
     */
    public void executeShellFile(Logger log, String logMapKey, String... command) {

        try {
            Process process = Runtime.getRuntime().exec(command);
            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));

            String s;
            while ((s = reader.readLine()) != null) {
                log.info(s);
                Bootstrap.logStringBufferMap.get(logMapKey).append(s).append("\n");
                Bootstrap.logQueueMap.get(logMapKey).add(s);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }

    }


    /**
     * 执行命令
     * @param log
     * @param command
     * @return
     */
    public String executeShellCommand(Logger log, String command) {

        StringBuilder output = new StringBuilder();

        Process p;
        try {
            p = Runtime.getRuntime().exec(command);
            p.waitFor();
            BufferedReader reader = new BufferedReader(new InputStreamReader(p.getInputStream()));

            String line;
            while ((line = reader.readLine()) != null) {
                output.append(line).append("\n");
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        return output.toString();
    }
}
