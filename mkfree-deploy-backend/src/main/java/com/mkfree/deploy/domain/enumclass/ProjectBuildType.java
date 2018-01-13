package com.mkfree.deploy.domain.enumclass;

/**
 * Created by oyhk on 2017/1/23.
 * 构建类型
 */
public enum ProjectBuildType {

    BUILD("构建"), SYNC("同步命令");

    private String text;

    ProjectBuildType(String text) {
        this.text = text;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }
}
