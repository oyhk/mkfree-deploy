package com.mkfree.deploy.domain.enumclass;

/**
 * Created by oyhk on 2017/1/23.
 * 构建类型
 */
public enum ProjectBuildStepType {

    BEFORE("构建前"),
    AFTER("构建后"),
    SYNC("同步命令");

    private String text;

    ProjectBuildStepType(String text) {
        this.text = text;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }
}
