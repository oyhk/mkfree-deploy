package com.mkfree.deploy.repository;

import com.mkfree.deploy.domain.ProjectBuildLog;
import com.mkfree.deploy.domain.enumclass.ProjectBuildType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;

/**
 * Created by zhangjh on 2017/2/8.
 */
@Repository
public interface ProjectBuildLogRepository extends JpaRepository<ProjectBuildLog, Long> {
    /**
     * 根据项目查询所有的构建历史列表
     *
     * @param projectId 项目id
     * @return
     */
    List<ProjectBuildLog> findTop10ByProjectIdOrderBySeqNoDesc(Long projectId);

    /**
     * 查找项目最新的部署信息
     *
     * @param projectId 项目id
     * @return
     */
    ProjectBuildLog findTop1ByProjectIdAndBuildTypeAndEnvIdOrderByCreatedAtDesc(Long projectId, ProjectBuildType buildType, Long envId);

    ProjectBuildLog findByProjectIdAndSeqNo(Long projectId,Long seqNo);
}
