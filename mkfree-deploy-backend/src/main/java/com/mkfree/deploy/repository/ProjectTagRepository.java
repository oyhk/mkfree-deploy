package com.mkfree.deploy.repository;

import com.mkfree.deploy.domain.ProjectEnv;
import com.mkfree.deploy.domain.ProjectTag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Created by oyhk on 2017/1/23.
 */
@Repository
public interface ProjectTagRepository extends JpaRepository<ProjectTag, Long> {

    List<ProjectTag> findByStatus(Boolean status);
}
