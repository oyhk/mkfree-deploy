package com.mkfree.deploy.repository;

import com.mkfree.deploy.domain.ProjectBuildStep;
import com.mkfree.deploy.domain.enumclass.ProjectBuildStepType;
import com.mkfree.deploy.domain.enumclass.ProjectEnv;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Created by oyhk on 2017/1/23.
 */
@Repository
public interface ProjectBuildStepRepository extends BaseRepository<ProjectBuildStep, Long> {

    List<ProjectBuildStep> findByProjectIdAndTypeAndEnv(Long projectId, ProjectBuildStepType type, ProjectEnv env);

    List<ProjectBuildStep> findByProjectId(Long projectId);

    List<ProjectBuildStep> findByProjectIdAndTypeAndProjectEnvConfigId(Long projectId, ProjectBuildStepType type, Long projectEnvConfigId);
}
