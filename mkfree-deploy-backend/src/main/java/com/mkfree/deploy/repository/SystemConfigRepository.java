package com.mkfree.deploy.repository;

import com.mkfree.deploy.domain.Project;
import com.mkfree.deploy.domain.SystemConfig;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Created by oyhk on 2017/1/23.
 */
@Repository
public interface SystemConfigRepository extends BaseRepository<SystemConfig, Long> {


    SystemConfig findByKey(String key);


}
