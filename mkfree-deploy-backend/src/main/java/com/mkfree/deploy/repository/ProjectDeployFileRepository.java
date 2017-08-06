package com.mkfree.deploy.repository;

import com.mkfree.deploy.domain.ProjectDeployFile;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Created by oyhk on 2017/1/23.
 */
@Repository
public interface ProjectDeployFileRepository extends BaseRepository<ProjectDeployFile, Long> {


    List<ProjectDeployFile> findByProjectId(Long projectId);
    List<ProjectDeployFile> findByProjectIdAndIsEnable(Long projectId, Boolean enable);
}
