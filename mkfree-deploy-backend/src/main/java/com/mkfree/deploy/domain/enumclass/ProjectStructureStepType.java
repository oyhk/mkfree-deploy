package com.mkfree.deploy.domain.enumclass;

/**
 * Created by oyhk on 2017/1/23.
 * 构建类型
 */
public enum ProjectStructureStepType {

    BEFORE("构建前"),
    AFTER("构建后");

    private String text;

    ProjectStructureStepType(String text) {
        this.text = text;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }
}
