package com.mkfree.deploy.repository;

import com.mkfree.deploy.domain.ProjectEnvConfig;
import com.mkfree.deploy.domain.enumclass.ProjectEnv;
import com.mkfree.deploy.dto.ProjectEnvConfigDto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Created by oyhk on 2017/1/23.
 */
@Repository
public interface ProjectEnvConfigRepository extends JpaRepository<ProjectEnvConfig, Long> {

    ProjectEnvConfig findByProjectIdAndEnvId(Long projectId, Long envId);
    List<ProjectEnvConfig> findByProjectId(Long projectId);
    List<ProjectEnvConfig> findByProjectIdIn(List<Long> projectIdList);
}
