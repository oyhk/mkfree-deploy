package com.mkfree.deploy.helper;

import com.mkfree.deploy.domain.ProjectStructureLog;

/**
 * Created by zhangjh on 2017/2/9.
 */
public enum ProjectStructureLogHelper {

    SINGLETONE;


    public Long getNextSeqNo(ProjectStructureLog projectStructureLog) {
        Long nextSeqNo = 1l;
        if (null != projectStructureLog) {
            Long seqNo = projectStructureLog.getSeqNo();
            nextSeqNo = seqNo + 1;
        }
        return nextSeqNo;
    }

    public String getLogKey(ProjectStructureLog projectStructureLog) {
        return String.format("%s#%d", projectStructureLog.getName(), projectStructureLog.getSeqNo());

    }
}
