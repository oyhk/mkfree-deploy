package com.mkfree.deploy.common;

/**
 * Created by oyhk on 2017/4/4.
 * 业务异常
 */
public class BusinessException extends RuntimeException {
	private static final long serialVersionUID = 1L;
	public String desc;
    public String code;
    public BusinessException(String desc) {
        super(desc);
        this.desc = desc;
    }
    public String getDesc() {
        return desc;
    }

    public void setDesc(String desc) {
        this.desc = desc;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }
}
