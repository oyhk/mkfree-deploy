package com.mkfree.deploy;

/**
 * Created by oyhk on 2017/1/23.
 */
public class Routes {

    public static final String API_PREFIX = "/api";

    // 安装
    public static final String INSTALL = API_PREFIX + "/install";
    // 是否已安装
    public static final String INSTALLED = API_PREFIX + "/installed";

    public static final String USER_PAGE = API_PREFIX + "/user/page";
    public static final String USER_LOGIN = API_PREFIX + "/user/login";
    public static final String USER_LOGIN_USER_TOKEN = API_PREFIX + "/user/login_user_token";
    public static final String USER_SAVE = API_PREFIX + "/user/save";
    public static final String USER_UPDATE = API_PREFIX + "/user/update";
    public static final String USER_DELETE = API_PREFIX + "/user/delete";
    public static final String USER_INFO = API_PREFIX + "/user/info";

    public static final String USER_PROJECT_PERMISSION_SAVE = API_PREFIX + "/user/project/permission/save";
    public static final String USER_PROJECT_PERMISSION_PROJECT_PAGE = API_PREFIX + "/user_project_permission/project_page";
    public static final String USER_PROJECT_PERMISSION_PROJECT_ASSIGN = API_PREFIX + "/user_project_permission/project_assign";
    public static final String USER_PROJECT_PERMISSION_DELETE = API_PREFIX + "/user/project/permission/delete";
    public static final String USER_PROJECT_PERMISSION_UPDATE = API_PREFIX + "/user/project/permission/update";
    public static final String USER_PROJECT_PERMISSION_LIST = API_PREFIX + "/user/project/permission/list";

    public static final String PROJECT_PAGE = API_PREFIX + "/project/page";
    public static final String PROJECT_INIT_GIT = API_PREFIX + "/project/init_git";
    public static final String PROJECT_ENV_CONFIG_LIST = API_PREFIX + "/project/env_config_list";
    public static final String PROJECT_SAVE = API_PREFIX + "/project/save";
    public static final String PROJECT_UPDATE = API_PREFIX + "/project/update";
    public static final String PROJECT_INFO = API_PREFIX + "/project/info";
    public static final String PROJECT_BRANCH_REFRESH = API_PREFIX + "/project/branch_refresh";
    public static final String PROJECT_DELETE = API_PREFIX + "/project/delete";
    public static final String PROJECT_STRUCTURE = API_PREFIX + "/project/structure";
    public static final String PROJECT_BUILD_LOG = API_PREFIX + "/project/build_log";
    public static final String PROJECT_SYNC = API_PREFIX + "/project/sync"; //同步版本
    public static final String PROJECT_SERVER_SYNC = API_PREFIX + "/project/server_sync"; //发布服务器同步版本

    public static final String SERVER_MACHINE_INFO = API_PREFIX + "/server_machine/info";
    public static final String SERVER_MACHINE_LIST = API_PREFIX + "/server_machine/list";
    public static final String SERVER_MACHINE_PAGE = API_PREFIX + "/server_machine/page";
    public static final String SERVER_MACHINE_SAVE = API_PREFIX + "/server_machine/save";
    public static final String SERVER_MACHINE_UPDATE = API_PREFIX + "/server_machine/update";
    public static final String SERVER_MACHINE_DELETE = API_PREFIX + "/server_machine/delete";

    public static final String PROJECT_BUILD_LOG_LIST = API_PREFIX + "/project_build_log/list";


    public static final String PROJECT_BUILD_LOG_INFO = API_PREFIX + "/project_build_log/info";


    public static final String TAG_PAGE = API_PREFIX + "/tag/page";
    public static final String TAG_ENABLE = API_PREFIX + "/tag/enable";
    public static final String TAG_LIST = API_PREFIX + "/tag/list";
    public static final String TAG_INFO = API_PREFIX + "/tag/info";
    public static final String TAG_SAVE = API_PREFIX + "/tag/save";
    public static final String TAG_UPDATE = API_PREFIX + "/tag/update";
    public static final String TAG_DELETE = API_PREFIX + "/tag/delete";


    public static final String ENV_PAGE = API_PREFIX + "/env/page";
    public static final String ENV_LIST = API_PREFIX + "/env/list";
    public static final String ENV_INFO = API_PREFIX + "/env/info";
    public static final String ENV_SAVE = API_PREFIX + "/env/save";
    public static final String ENV_UPDATE = API_PREFIX + "/env/update";
    public static final String ENV_DELETE = API_PREFIX + "/env/delete";
}
