package com.mkfree.deploy.helper;

import com.mkfree.deploy.Bootstrap;
import org.apache.commons.lang3.ArrayUtils;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.*;
import java.util.stream.Stream;

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
    public void buildProjectExecuteShellFile(Logger log, String logMapKey, String... command) {

        try {
            Process process = Runtime.getRuntime().exec(command);
            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));

            String s;
            while ((s = reader.readLine()) != null) {
                StringBuffer stringBuffer = Bootstrap.logStringBufferMap.get(logMapKey);
                if (stringBuffer == null) {
                    stringBuffer = new StringBuffer();
                }
                stringBuffer.append(s).append("\n");

                Queue<String> strings = Bootstrap.logQueueMap.get(logMapKey);
                if (strings == null) {
                    strings = new LinkedList<>();
                }
                strings.add(s);
            }
        } catch (IOException e) {
            e.printStackTrace();
            log.error(e.getMessage());
        }

    }

    public String executeShellFile(Logger log, String path, String... params) {
        StringBuilder stringBuffer = new StringBuilder();
        try {
            List<String> commands = new ArrayList<>();
            commands.add(path);
            Stream<String> command = Stream.of(params);
            command.forEach(commands::add);

            Process process = Runtime.getRuntime().exec(commands.toArray(new String[]{}));
            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
            String s;
            while ((s = reader.readLine()) != null) {
                stringBuffer.append(s);
            }
        } catch (IOException e) {
            e.printStackTrace();
            log.error(e.getMessage());
        }
        return stringBuffer.toString();
    }


    /**
     * 执行命令
     * @param log
     * @param command
     * @return
     */
    public String executeShellCommand(Logger log, String command) {
        StringBuilder builder = new StringBuilder();
        Process p;
        try {
            p = Runtime.getRuntime().exec(new String[]{"/bin/bash", "-c", command});
            p.waitFor();

            BufferedReader reader = new BufferedReader(new InputStreamReader(p.getInputStream()));
            while (reader.ready()) {
                String line = reader.readLine();
                builder.append(line);
                if (log != null) {
                    log.info(line);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
            if (log != null) {
                log.error(e.getMessage());
            }
        }
        return builder.toString();

    }
}
