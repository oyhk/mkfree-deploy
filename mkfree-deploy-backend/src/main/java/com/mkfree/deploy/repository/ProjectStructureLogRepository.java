package com.mkfree.deploy.repository;

import com.mkfree.deploy.domain.ProjectStructureLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.stereotype.Repository;

import javax.persistence.LockModeType;
import java.util.List;

/**
 * Created by zhangjh on 2017/2/8.
 */
@Repository
public interface ProjectStructureLogRepository extends JpaRepository<ProjectStructureLog, Long> {
    /**
     * 同步锁
     *
     * @param id
     * @return
     */
    ProjectStructureLog findOne(Long id);

    /**
     * 根据项目查询所有的构建历史列表
     *
     * @param projectId 项目id
     * @return
     */
    List<ProjectStructureLog> findTop10ByProjectIdOrderByCreatedAtDesc(Long projectId);
    ProjectStructureLog findByIdAndProjectId(Long id,Long projectId);

    /**
     * 查找项目最新的部署信息
     *
     * @param projectId 项目id
     * @return
     */
    ProjectStructureLog findTop1ByProjectIdOrderByIdDesc(Long projectId);

    /**
     * 查找指定构建版本的日志信息
     *
     * @param projectId 项目id
     * @param name      构建名
     * @return
     */
    ProjectStructureLog findTop1ByProjectIdAndNameOrderByIdDesc(Long projectId, String name);

}
