package com.mkfree.deploy.repository;

import com.mkfree.deploy.domain.ProjectBuildStep;
import com.mkfree.deploy.domain.enumclass.ProjectBuildStepType;
import com.mkfree.deploy.domain.enumclass.ProjectEnv;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Created by oyhk on 2017/1/23.
 */
@Repository
public interface ProjectBuildStepRepository extends JpaRepository<ProjectBuildStep, Long> {

    List<ProjectBuildStep> findByProjectIdAndTypeAndEnvId(Long projectId, ProjectBuildStepType type, Long envId);

    List<ProjectBuildStep> findByProjectId(Long projectId);

    List<ProjectBuildStep> findByProjectIdAndTypeAndProjectEnvConfigId(Long projectId, ProjectBuildStepType type, Long projectEnvConfigId);
}
