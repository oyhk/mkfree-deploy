package com.mkfree.deploy.repository;

import com.mkfree.deploy.domain.Project;
import com.mkfree.deploy.domain.ProjectServerMachine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Created by oyhk on 2017/1/23.
 */
@Repository
public interface ProjectServerMachineRepository extends JpaRepository<ProjectServerMachine, Long> {


    List<ProjectServerMachine> findByProjectId(Long projectId);
}
