package com.mkfree.deploy.common;

import org.apache.commons.lang3.text.StrSubstitutor;

import java.util.HashMap;
import java.util.Map;

/**
 * Created by oyhk on 2017/9/17.
 *
 * 组装shell脚本
 * <p>
 *     Shell shell = new Shell();
 *     shell.appendN("cd #{path}").appendN("ls");
 *     shell.addParams("path","/opt");
 *     String lastShell = shell.getShell();
 *     System.out.println(lastShell);
 * </p>
 */
public class Shell {

    private Map<String, String> params = new HashMap<>();
    private StringBuilder shellBuilder = new StringBuilder();
    private StrSubstitutor strSubstitutor = new StrSubstitutor(params, "#{", "}");

    /**
     * 添加脚本
     * @param str 例如：cd /mnt/usr/product
     * @return
     */
    public Shell appendN(String str) {
        this.shellBuilder.append(str).append("\n");
        return this;
    }
    public Shell append(String str) {
        this.shellBuilder.append(str);
        return this;
    }


    /**
     * 添加参数
     *
     * @param key
     * @param value
     * @return
     */
    public Shell addParams(String key, String value) {
        this.params.put(key, value);
        return this;
    }

    public String getShell() {
        return strSubstitutor.replace(shellBuilder.toString());
    }


}
