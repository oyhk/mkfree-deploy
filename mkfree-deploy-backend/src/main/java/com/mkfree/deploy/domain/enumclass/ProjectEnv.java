package com.mkfree.deploy.domain.enumclass;

/**
 * Created by oyhk on 2017/1/23.
 * 环境类型
 */
public enum ProjectEnv {

    DEV("开发环境"), TEST("测试环境"), UAT("仿真测试"),PREPROD("预生产"), PROD("生产");

    private String text;

    ProjectEnv(String text) {
        this.text = text;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }
}
