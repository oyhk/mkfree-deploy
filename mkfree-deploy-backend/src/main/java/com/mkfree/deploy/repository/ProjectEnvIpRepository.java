package com.mkfree.deploy.repository;

import com.mkfree.deploy.domain.Env;
import com.mkfree.deploy.domain.ProjectEnvIp;
import com.mkfree.deploy.domain.enumclass.ProjectEnv;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Created by oyhk on 2017/1/23.
 */
@Repository
public interface ProjectEnvIpRepository extends BaseRepository<ProjectEnvIp, Long> {

    List<ProjectEnvIp> findByProjectIdIn(List<Long> projectId);

    ProjectEnvIp findByProjectIdAndProjectEnvAndServerIp(Long projectId, ProjectEnv projectEnv, String serverIp);
}
