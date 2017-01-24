package com.mkfree.deploy.domain.enumclass;

/**
 * Created by oyhk on 15-4-17.
 * 是否的枚举
 */
public enum Whether {
    YES("是"), NO("否");

    Whether(String text) {
        this.text = text;
    }

    private String text;

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

}
