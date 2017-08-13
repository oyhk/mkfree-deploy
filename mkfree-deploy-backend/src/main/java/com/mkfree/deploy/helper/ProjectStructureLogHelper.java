package com.mkfree.deploy.helper;

import com.mkfree.deploy.domain.ProjectBuildLog;

/**
 * Created by zhangjh on 2017/2/9.
 */
public enum ProjectStructureLogHelper {

    SINGLETONE;


    public Long getNextSeqNo(ProjectBuildLog projectBuildLog) {
        Long nextSeqNo = 1l;
        if (null != projectBuildLog) {
            Long seqNo = projectBuildLog.getSeqNo();
            nextSeqNo = seqNo + 1;
        }
        return nextSeqNo;
    }

    public String getLogKey(ProjectBuildLog projectBuildLog) {
        return String.format("%s#%d", projectBuildLog.getProjectName(), projectBuildLog.getSeqNo());

    }
}
