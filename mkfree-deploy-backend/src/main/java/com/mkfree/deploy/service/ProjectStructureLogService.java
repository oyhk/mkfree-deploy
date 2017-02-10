package com.mkfree.deploy.service;

import com.mkfree.deploy.domain.ProjectStructureLog;
import com.mkfree.deploy.helper.ProjectStructureLogHelper;
import com.mkfree.deploy.repository.ProjectStructureLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Created by zhangjh on 2017/2/8.
 */
@Service
public class ProjectStructureLogService {

    @Autowired
    private ProjectStructureLogRepository projectStructureLogRepository;

    /**
     *
     * @param projectId
     * @return
     */
    public List findAll(Long projectId) {
        return projectStructureLogRepository.findByProjectId(projectId);
    }

    /**
     *
     * @param projectId
     * @param desc
     */
    public void add(Long projectId, String desc) {

        ProjectStructureLog projectStructureLog = projectStructureLogRepository.findTop1ByProjectIdOrderByIdDesc(projectId);
//        if (null != projectStructureLog) {
//            projectStructureLog = projectStructureLogRepository.findOne(projectStructureLog.getId());
//        }
        Long nextSeqNo = ProjectStructureLogHelper.SINGLETONE.getNextSeqNo(projectStructureLog);
        ProjectStructureLog newLog = new ProjectStructureLog();
        newLog.setName("#" + nextSeqNo);
        newLog.setProjectId(projectId);
        newLog.setSeqNo(nextSeqNo);
        newLog.setDescription(desc);
        projectStructureLogRepository.save(newLog);


        //删除8个版本之前的数据


    }

    /**
     *
     * @param projectId
     * @param name
     * @return
     */
    public ProjectStructureLog info(Long projectId, String name) {
        ProjectStructureLog projectStructureLog = projectStructureLogRepository.findTop1ByProjectIdAndNameOrderByIdDesc(projectId, name);
        return projectStructureLog;
    }
}
