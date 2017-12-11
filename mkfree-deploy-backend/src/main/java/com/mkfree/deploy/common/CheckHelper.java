package com.mkfree.deploy.common;

import org.apache.commons.lang3.StringUtils;

import java.util.List;

/**
 * Created by oyhk on 2017/4/21.
 */
public class CheckHelper {

    public static void check(boolean cond, String desc) {
        if (!cond) {
            throw new CheckException(desc);
        }
    }
    public static void checkNotNull(Object fieldValue, String desc) {
        if (null == fieldValue) {
            throw new CheckException(desc);
        }
    }
    public static void remindNotEmptyList(Object fieldValue, String desc) {
        if (null == fieldValue) {
            throw new CheckException(desc);
        }
        if (List.class.isAssignableFrom(fieldValue.getClass()) && ((List<?>) fieldValue).size() == 0) {
            throw new CheckException(desc);
        }
    }

    public static void checkNotBlank(String field, String desc) {
        if (StringUtils.isBlank(field)) {
            throw new CheckException(desc);
        }
    }
    public static void remind(boolean cond, String desc) {
        if (!cond) {
            throw new RemindException(desc);
        }
    }
    public static void remindNotNul(Object fieldValue, String desc) {
        if (null == fieldValue) {
            throw new RemindException(desc);
        }
    }

    public static void remindIsNotExist(Object fieldValue, String desc) {
        if (null == fieldValue) {
            throw new RemindException(desc);
        }
    }

    public static void remindShouldBeNul(Object fieldValue, String desc) {
        if (fieldValue != null) {
            throw new RemindException(desc);
        }
    }

    public static void remindNotBlank(String field, String desc) {
        if (StringUtils.isBlank(field)) {
            throw new RemindException(desc);
        }
    }

    public static void remindNotNul(Object fieldValue, String code, String desc) {
        if (null == fieldValue) {
            throw new RemindException(code, desc);
        }
    }

    public static void remindNotNul(Object fieldValue, JsonResult<?> jsonResult) {
        if (null == fieldValue) {
            throw new RemindException(jsonResult.code, jsonResult.desc);
        }
    }
}
