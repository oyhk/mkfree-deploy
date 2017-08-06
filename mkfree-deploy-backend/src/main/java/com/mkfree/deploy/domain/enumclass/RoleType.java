package com.mkfree.deploy.domain.enumclass;

/**
 * Created by oyhk on 2017/1/23.
 * 用户权限类型
 */
public enum RoleType {

    ADMIN("管理员"), COMMON("普通成员");

    private String text;

    RoleType(String text) {
        this.text = text;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }
}
