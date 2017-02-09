package com.mkfree.deploy.srv;

import com.mkfree.deploy.domain.ProjectStructureLogDetail;

import java.util.List;

/**
 * Created by zhangjh on 2017/2/8.
 */
public interface ProjectStructureLogSrv {
    /**
     * 查询日志列表
     *
     * @param projectName
     * @return
     */
    List findAll(String projectName);

    /**
     * 保存发布日志
     *
     * @param projectName
     * @param desc
     */
    void add(String projectName, String desc);

    /**
     * 查询构建日志详细信息
     *
     * @param projectName 项目名
     * @param name        日志名
     * @return
     */
    ProjectStructureLogDetail info(String projectName, String name);
}
