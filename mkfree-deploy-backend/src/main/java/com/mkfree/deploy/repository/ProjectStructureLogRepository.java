package com.mkfree.deploy.repository;

import com.mkfree.deploy.domain.ProjectStructureLog;
import com.mkfree.deploy.domain.ProjectStructureLogDetail;
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
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    ProjectStructureLog findOne(Long id);

    /**
     * 根据项目名查询所有的构建历史列表
     *
     * @param projectName 项目名
     * @return
     */
    List<ProjectStructureLogDetail> findByProjectName(String projectName);

    /**
     * 查找项目最新的部署信息
     *
     * @param projectName 项目名
     * @return
     */
    ProjectStructureLog findTop1ByProjectNameOrderByIdDesc(String projectName);

    /**
     * 查找指定构建版本的日志信息
     *
     * @param projectName 项目名
     * @param name        构建名
     * @return
     */
    ProjectStructureLogDetail findTop1ByProjectNameAndNameOrderByIdDesc(String projectName, String name);
}
