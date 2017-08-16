package com.mkfree.deploy.domain.enumclass;

/**
 * Created by oyhk on 2017/1/23.
 * 构建日志状态
 */
public enum ProjectBuildLogStatus {

    SUCCESS("成功"), FAIL("失败");

    private String text;

    ProjectBuildLogStatus(String text) {
        this.text = text;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }
}
