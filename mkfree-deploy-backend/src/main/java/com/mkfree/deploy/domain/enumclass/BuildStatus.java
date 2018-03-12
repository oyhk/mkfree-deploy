package com.mkfree.deploy.domain.enumclass;

/**
 * Created by oyhk on 2017/1/23.
 * 项目构建状态类型
 */
public enum BuildStatus {

    IDLE("空闲"), PROCESSING("构建中"), SYNCING("同步中");

    private String text;

    BuildStatus(String text) {
        this.text = text;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }
}
