package com.mkfree.deploy.dto;

/**
 * Created by oyhk on 2017/7/21.
 */
public class StructureCommandDto {

    private String command;
    private boolean isRestart;

    public String getCommand() {
        return command;
    }

    public void setCommand(String command) {
        this.command = command;
    }

    public boolean isRestart() {
        return isRestart;
    }

    public void setRestart(boolean restart) {
        isRestart = restart;
    }
}
