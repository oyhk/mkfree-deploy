package com.mkfree.deploy.repository;

import com.mkfree.deploy.domain.Project;
import com.mkfree.deploy.domain.ProjectStructureStep;
import com.mkfree.deploy.domain.enumclass.ProjectEnv;
import com.mkfree.deploy.domain.enumclass.ProjectStructureStepType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Created by oyhk on 2017/1/23.
 */
@Repository
public interface ProjectStructureStepRepository extends BaseRepository<ProjectStructureStep, Long> {

    List<ProjectStructureStep> findByProjectIdAndTypeAndEnv(Long projectId, ProjectStructureStepType type, ProjectEnv env);

    List<ProjectStructureStep> findByProjectId(Long projectId);

    List<ProjectStructureStep> findByProjectIdAndTypeAndProjectEnvConfigId(Long projectId, ProjectStructureStepType type, Long projectEnvConfigId);
}
