package com.mkfree.deploy.repository;

import com.mkfree.deploy.domain.Env;
import com.mkfree.deploy.domain.User;
import org.springframework.stereotype.Repository;

/**
 * Created by oyhk on 2017/1/23.
 */
@Repository
public interface EnvRepository extends BaseRepository<Env, Long> {

    Env findByName(String name);

}
