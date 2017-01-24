package com.mkfree.deploy.domain.enumclass;

/**
 * Created by oyhk on 2017/1/23.
 * 用户权限类型
 */
public enum ProjectEnv {

    DEV("开发"), UAT("仿真测试"), PROD("生产");

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
