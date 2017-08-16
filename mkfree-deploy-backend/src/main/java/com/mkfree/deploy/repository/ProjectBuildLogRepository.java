package com.mkfree.deploy.repository;

import com.mkfree.deploy.domain.ProjectBuildLog;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Created by zhangjh on 2017/2/8.
 */
@Repository
public interface ProjectBuildLogRepository extends BaseRepository<ProjectBuildLog, Long> {
    /**
     * 同步锁
     *
     * @param id
     * @return
     */
    ProjectBuildLog findOne(Long id);

    /**
     * 根据项目查询所有的构建历史列表
     *
     * @param projectId 项目id
     * @return
     */
    List<ProjectBuildLog> findTop10ByProjectIdOrderByCreatedAtDesc(Long projectId);

    /**
     * 查找项目最新的部署信息
     *
     * @param projectId 项目id
     * @return
     */
    ProjectBuildLog findTop1ByProjectIdOrderByIdDesc(Long projectId);

    /**
     * 查找指定构建版本的日志信息
     *
     * @param projectId 项目id
     * @param name      构建名
     * @return
     */
    ProjectBuildLog findTop1ByProjectIdAndNameOrderByIdDesc(Long projectId, String name);

}
