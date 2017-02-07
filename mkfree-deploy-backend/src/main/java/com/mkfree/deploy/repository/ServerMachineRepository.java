package com.mkfree.deploy.repository;

import com.mkfree.deploy.domain.ServerMachine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Created by oyhk on 2017/1/23.
 *
 */
@Repository
public interface ServerMachineRepository extends JpaRepository<ServerMachine, Long> {

    List<ServerMachine> findByIdIn(List<Long> ids);
}
