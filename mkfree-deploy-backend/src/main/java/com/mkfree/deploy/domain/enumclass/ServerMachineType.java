package com.mkfree.deploy.domain.enumclass;

/**
 * Created by oyhk on 2017/1/23.
 * 服务器类型
 */
public enum ServerMachineType {

    DEV("开发"), UAT("仿真测试"),PREPROD("预生产"), PROD("生产");

    private String text;

    ServerMachineType(String text) {
        this.text = text;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }
}
