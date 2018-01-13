package com.mkfree.deploy.domain.enumclass;

/**
 * Created by oyhk on 2017/1/23.
 * 用户权限类型
 */
public enum UserPermissionType {

    PROJECT("项目权限"), SYSTEM("系统权限");

    private String text;

    UserPermissionType(String text) {
        this.text = text;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }
}
