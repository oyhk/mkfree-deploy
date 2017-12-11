package com.mkfree.deploy.repository;

import com.mkfree.deploy.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Created by oyhk on 2017/1/23.
 */
@Repository
public interface UserRepository extends BaseRepository<User, Long> {

    User findByUsername(String username);
    User findByAccessToken(String userToken);
}
