package com.mkfree.deploy.common;

/**
 * Created by oyhk on 2017/4/1.
 *
 * http 参数验证异常
 */
public class CheckException extends RuntimeException {
	private static final long serialVersionUID = 1L;
	public String desc = JsonResult.CD2[1];
    public String code = JsonResult.CD2[0];
    public Object data;

    public CheckException(String desc) {
        super(desc);
        this.desc = desc;
    }

    public CheckException(String desc, Object data) {
        super(desc);
        this.desc = desc;
        this.data = data;
    }
}
