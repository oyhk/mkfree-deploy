package com.mkfree.deploy.repository;

import com.mkfree.deploy.domain.ProjectStructureLogDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Created by zhangjh on 2017/2/8.
 */
@Repository
public interface ProjectStructureLogDetailRepository extends JpaRepository<ProjectStructureLogDetail, Long> {

    /**
     * 根据项目id查询所有的构建历史列表
     * @param ProjectStructureLogId 项目id
     * @return
     */
    List<ProjectStructureLogDetail>  findByProjectStructureLogId(Long ProjectStructureLogId);



}
