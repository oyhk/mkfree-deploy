package com.mkfree.deploy;

/**
 * Created by oyhk on 2017/1/23.
 */
public class Routes {

    public static final String API_PREFIX = "/api";

    public static final String USER_PAGE = API_PREFIX +"/user/page";
    public static final String USER_LOGIN = API_PREFIX +"/user/login";
    public static final String USER_SAVE = API_PREFIX +"/user/save";
    public static final String USER_UPDATE = API_PREFIX +"/user/update";

    public static final String PROJECT_PAGE = API_PREFIX + "/project/page";
    public static final String PROJECT_SAVE = API_PREFIX + "/project/save";
    public static final String PROJECT_UPDATE = API_PREFIX + "/project/update";
    public static final String PROJECT_DELETE = API_PREFIX + "/project/delete";
    public static final String PROJECT_STRUCTURE = API_PREFIX + "/project/structure";

    public static final String SERVER_MACHINE_PAGE = API_PREFIX + "/server_machine/page";
    public static final String SERVER_MACHINE_SAVE = API_PREFIX + "/server_machine/save";
    public static final String SERVER_MACHINE_UPDATE = API_PREFIX + "/server_machine/update";
    public static final String SERVER_MACHINE_DELETE = API_PREFIX + "/server_machine/delete";

    public static final String USER_PROJECT_PERMISSION_SAVE = API_PREFIX + "/user/project/permission/save";
    public static final String USER_PROJECT_PERMISSION_DELETE = API_PREFIX + "/user/project/permission/delete";
    public static final String USER_PROJECT_PERMISSION_UPDATE = API_PREFIX + "/user/project/permission/update";
    public static final String USER_PROJECT_PERMISSION_LIST = API_PREFIX + "/user/project/permission/list";

}
