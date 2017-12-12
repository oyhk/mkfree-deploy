package com.mkfree.deploy.common;

import org.slf4j.Logger;

/**
 * Created by oyhk on 14-6-28.
 *
 */
public class JsonResult<T> {


    public static final String CD3[] = {"3", "温馨提示:"};
    public static final String CD2[] = {"2", "参数错误:"};
    public static final String CD1[] = {"1", "成功"};
    public static final String CD0[] = {"0", "失败"};

    public static final String CD101[] = {"101", "用户名不存在"};
    public static final String CD102[] = {"102", "用户名状态异常"};
    public static final String CD103[] = {"103", "密码错误"};
    public static final String CD104[] = {"104", "access_token 不能为空"};
    public static final String CD105[] = {"105", "access_token 无效"};
    public static final String CD106[] = {"106", "用户名不能为空"};
    public static final String CD107[] = {"107", "密码不能为空"};


    public JsonResult() {
        this.code = JsonResult.CD1[0];
        this.desc = JsonResult.CD1[1];
    }

    public JsonResult(String code, String desc) {
        this.code = code;
        this.desc = desc;
    }

    public JsonResult(String code, String desc, T data) {
        this.code = code;
        this.desc = desc;
        this.data = data;
    }

    public void remind(String desc) {
        this.remind(desc, null);
    }

    public void remind(String desc, Logger log) {
        this.code = JsonResult.CD3[0];
        this.desc = JsonResult.CD3[1] + desc;
        if (log != null) {
            log.warn("remind , desc : {}", desc);
        }
    }

    public void errorParam(String desc) {
        this.errorParam(desc, null);
    }

    public void errorParam(String desc, Logger log) {
        this.code = JsonResult.CD2[0];
        this.desc = JsonResult.CD2[1] + desc;
        if (log != null) {
            log.warn("errorParam , desc : {}", desc);
        }
    }

    public void custom(String code, String desc, Logger log) {
        this.code = code;
        this.desc = desc;
        if (log != null) {
            log.warn("custom , code : {} , desc : {}", code, desc);
        }
    }


    public String code = JsonResult.CD1[0];
    public String desc = JsonResult.CD1[1];
    public T data;

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getDesc() {
        return desc;
    }

    public void setDesc(String desc) {
        this.desc = desc;
    }

    public T getData() {
        return data;
    }

    public void setData(T data) {
        this.data = data;
    }

    @Override
    public String toString() {
        return "JsonResult{" +
                "code='" + code + '\'' +
                ", desc='" + desc + '\'' +
                ", list=" + data +
                '}';
    }
}
