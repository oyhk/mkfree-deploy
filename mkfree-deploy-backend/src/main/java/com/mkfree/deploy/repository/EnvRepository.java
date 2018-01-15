package com.mkfree.deploy.repository;

import com.mkfree.deploy.domain.ProjectEnv;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Created by oyhk on 2017/1/23.
 */
@Repository
public interface EnvRepository extends JpaRepository<ProjectEnv, Long> {

    ProjectEnv findByName(String name);

}
