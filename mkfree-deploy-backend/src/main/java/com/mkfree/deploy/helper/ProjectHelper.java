package com.mkfree.deploy.helper;

import com.mkfree.deploy.domain.ProjectBuildStep;
import com.mkfree.deploy.domain.enumclass.ProjectBuildStepType;
import com.mkfree.deploy.repository.ProjectBuildStepRepository;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.text.StrSubstitutor;

import java.util.List;
import java.util.Map;

/**
 * Created by oyhk on 2017/8/13.
 *
 *
 */
public enum ProjectHelper {
    SINGLEONE;

    public String scpBuildFileToServerShell(StrSubstitutor strSubstitutor, StringBuilder shellBuilder, Map<String, String> params, ProjectBuildStepRepository projectBuildStepRepository ) {

        return null;

    }

}
