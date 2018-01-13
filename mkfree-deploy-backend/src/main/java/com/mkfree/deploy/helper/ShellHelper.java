package com.mkfree.deploy.helper;

import com.mkfree.deploy.Bootstrap;
import com.mkfree.deploy.Config;
import org.apache.commons.lang3.ArrayUtils;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;

import java.io.*;
import java.util.*;
import java.util.concurrent.Executors;
import java.util.function.Consumer;
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
     * @param command
     * @return
     */
    public String executeShellCommand(String command, String key, Logger log) {

        String start = "################ exec shell start ##################";
        String end = "################ exec shell end ##################";

        if (log != null) {
            log.info(start);
        }
        StringBuilder builder = new StringBuilder("</br>");
        builder.append(start).append("</br>");
        if (StringUtils.isNotBlank(key)) {
            Config.STRING_BUILDER_MAP.put(key, builder);
        }
        try {
            Process process = Runtime.getRuntime().exec(new String[]{"/bin/bash", "-c", command});
            BufferedReader stdoutReader = new BufferedReader(new InputStreamReader(process.getInputStream()));
            String line;
            while ((line = stdoutReader.readLine()) != null) {
                // process procs standard output here
                builder.append(line).append("</br>");
                if (log != null) {
                    log.info(line);
                }
            }

            BufferedReader stderrReader = new BufferedReader(new InputStreamReader(process.getErrorStream()));
            while ((line = stderrReader.readLine()) != null) {
                // process procs standard error here
//                builder.appendN(line).appendN("</br>");
//                if (log != null) {
//                    log.info(line);
//                }
            }
            if (log != null) {
                log.info(end);
            }
            builder.append("</br>").append(end);
            process.waitFor();
            process.exitValue();
        } catch (IOException | InterruptedException e) {
            e.printStackTrace();
        }
        return builder.toString();

    }

    /**
     * 执行命令
     * @param command
     * @return
     */
    public String executeShellCommand(String command, Logger log) {
        return this.executeShellCommand(command, null, log).replaceAll("</br>","").replaceAll("################ exec shell start ##################","").replaceAll("################ exec shell end ##################","");
    }

    /**
     * 执行命令
     * @param command
     * @return
     */
    public String executeShellCommand(String command) {
        return this.executeShellCommand(command, null, null);
    }

    public String executeShellCommandOutConsoleLog(String command) {
        return executeShellCommand(command).replaceAll("</br>", System.lineSeparator());
    }

}
