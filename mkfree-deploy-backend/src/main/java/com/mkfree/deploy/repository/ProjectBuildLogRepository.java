package com.mkfree.deploy.repository;

import com.mkfree.deploy.domain.ProjectBuildLog;
import com.mkfree.deploy.domain.enumclass.ProjectBuildType;
import com.mkfree.deploy.domain.enumclass.ProjectEnv;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;
import java.util.Set;

/**
 * Created by zhangjh on 2017/2/8.
 */
@Repository
public interface ProjectBuildLogRepository extends BaseRepository<ProjectBuildLog, Long> {
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
    ProjectBuildLog findTop1ByProjectIdAndBuildTypeAndProjectEnvOrderByCreatedAtDesc(Long projectId, ProjectBuildType buildType, ProjectEnv projectEnv);


    List<ProjectBuildLog> findByIpInAndProjectIdOrderByCreatedAtDesc(Collection<String> ip, Long projectId);

    /**
     * 查找指定构建版本的日志信息
     *
     * @param projectId 项目id
     * @param name      构建名
     * @return
     */
    ProjectBuildLog findTop1ByProjectIdAndNameOrderByIdDesc(Long projectId, String name);

}
