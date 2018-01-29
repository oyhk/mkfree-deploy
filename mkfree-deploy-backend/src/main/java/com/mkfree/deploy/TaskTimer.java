package com.mkfree.deploy;

import com.mkfree.deploy.domain.Project;
import com.mkfree.deploy.domain.ProjectEnvIp;
import com.mkfree.deploy.domain.enumclass.BuildStatus;
import com.mkfree.deploy.repository.ProjectEnvIpRepository;
import com.mkfree.deploy.repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Created by oyhk on 2018/1/29.
 */
@Component
public class TaskTimer {

    @Autowired
    private ProjectEnvIpRepository projectEnvIpRepository;

    /**
     * 检查项目是否构建超时、失败，重置项目构建状态
     */
    @Scheduled(cron = "0 0/1 * * * ?")
    @Transactional
    public void checkProjectBuildTimeout() {
        List<ProjectEnvIp> projectList = projectEnvIpRepository.findByBuildStatus(BuildStatus.PROCESSING);
        projectList.forEach(project -> {
            long now = System.currentTimeMillis();
            //构建超过10分钟的项目重置构建状态
            if (now - project.getPublishTime().getTime() >= 10 * 60 * 1000) {
                project.setBuildStatus(BuildStatus.IDLE);
            }
        });
        projectEnvIpRepository.save(projectList);
    }
}
