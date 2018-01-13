package com.mkfree.deploy.domain.enumclass;

/**
 * Created by oyhk on 2017/1/23.
 * 操作类型
 */
public enum OptionType {

    DELETE("删除"), EDIT("编辑"), INFO("信息"), CREATE("创建");

    private String text;

    OptionType(String text) {
        this.text = text;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }
}
