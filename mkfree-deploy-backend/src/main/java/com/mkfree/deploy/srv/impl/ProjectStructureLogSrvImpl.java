package com.mkfree.deploy.srv.impl;

import com.mkfree.deploy.domain.ProjectStructureLog;
import com.mkfree.deploy.domain.ProjectStructureLogDetail;
import com.mkfree.deploy.helper.ProjectStructureLogHelper;
import com.mkfree.deploy.repository.ProjectStructureLogRepository;
import com.mkfree.deploy.srv.ProjectStructureLogSrv;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Created by zhangjh on 2017/2/8.
 */
@Service
public class ProjectStructureLogSrvImpl implements ProjectStructureLogSrv {
    @Autowired
    private ProjectStructureLogRepository projectStructureLogRepository;

    @Override
    public List findAll(String projectName) {
        return projectStructureLogRepository.findByProjectName(projectName);
    }

    @Override
    public void add(String projectName, String desc) {

        ProjectStructureLog projectStructureLog = projectStructureLogRepository.findTop1ByProjectNameOrderByIdDesc(projectName);
        if (null != projectStructureLog) {
            projectStructureLog = projectStructureLogRepository.findOne(projectStructureLog.getId());
        }
        Long nextSeqNo = ProjectStructureLogHelper.SINGLETONE.getNextSeqNo(projectStructureLog);
        ProjectStructureLog newLog = new ProjectStructureLog();
        newLog.setName("#" + nextSeqNo);
        newLog.setProjectName(projectName);
        newLog.setSeqNo(nextSeqNo);

        projectStructureLogRepository.save(newLog);

        //删除8个版本之前的数据
    }

    @Override
    public ProjectStructureLogDetail info(String projectName, String name) {
        ProjectStructureLogDetail projectStructureLog = projectStructureLogRepository.findTop1ByProjectNameAndName(projectName, name);
        return projectStructureLog;
    }


}
