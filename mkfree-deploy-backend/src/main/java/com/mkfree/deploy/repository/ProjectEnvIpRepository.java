package com.mkfree.deploy.repository;

import com.mkfree.deploy.domain.ProjectEnvIp;
import com.mkfree.deploy.domain.enumclass.BuildStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Created by oyhk on 2017/1/23.
 */
@Repository
public interface ProjectEnvIpRepository extends JpaRepository<ProjectEnvIp, Long> {


    List<ProjectEnvIp> findByBuildStatus(BuildStatus buildStatus);

    List<ProjectEnvIp> findByProjectIdIn(List<Long> projectIdList);
    List<ProjectEnvIp> findByProjectId(Long projectId);

    ProjectEnvIp findByProjectIdAndEnvIdAndServerIp(Long projectId, Long envId, String serverIp);

    ProjectEnvIp findByProjectIdAndEnvIdAndPublish(Long projectId,Long envId,Boolean publish);

    List<ProjectEnvIp> findByProjectIdAndEnvId(Long projectId, Long envId);

    void deleteByProjectIdAndServerIpIn(Long projectId, List<String> serverIpList);
}
