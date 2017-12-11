package com.mkfree.deploy.common;

public class RemindException extends RuntimeException {
    private static final long serialVersionUID = 1L;
	public String desc = JsonResult.CD3[1];
	public String code = JsonResult.CD3[0];
	public Object data;

	public RemindException(String desc) {
		super(desc);
		this.desc = desc;
	}

	public RemindException(String code, String desc) {
		super(desc);
		this.code = code;
		this.desc = desc;
	}

	public RemindException(String desc, Object data) {
		super(desc);
		this.desc = desc;
		this.data = data;
	}

	public RemindException(String code, String desc, Object data) {
		super(desc);
		this.code = code;
		this.desc = desc;
		this.data = data;
	}

	public RemindException(JsonResult jsonResult) {
		super(jsonResult.desc);
		this.code = jsonResult.code;
		this.desc = jsonResult.desc;
	}

}
