package com.mkfree.deploy.repository;

import com.mkfree.deploy.domain.UserProjectPermission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Created by DK on 17/2/6.
 */
@Repository
public interface UserProjectPermissionRepository extends BaseRepository<UserProjectPermission, Long> {
    List<UserProjectPermission> findByUserId(Long userId);

    List<UserProjectPermission> findByProjectId(Long projectId);
}
