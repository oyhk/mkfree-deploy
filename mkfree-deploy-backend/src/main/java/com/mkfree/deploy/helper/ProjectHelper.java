package com.mkfree.deploy.helper;

import com.mkfree.deploy.domain.Project;
import com.mkfree.deploy.domain.ProjectBuildStep;
import com.mkfree.deploy.domain.ProjectTag;
import com.mkfree.deploy.domain.enumclass.ProjectBuildStepType;
import com.mkfree.deploy.repository.ProjectBuildStepRepository;
import com.mkfree.deploy.repository.ProjectTagRepository;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.text.StrSubstitutor;

import java.util.List;
import java.util.Map;

/**
 * Created by oyhk on 2017/8/13.
 *
 *
 */
public class ProjectHelper {

    public static void setProjectTag(Long projectTagId, Project project, ProjectTagRepository projectTagRepository) {
        if (projectTagId != null) {
            ProjectTag projectTag = projectTagRepository.findOne(projectTagId);
            if (projectTag != null) {
                project.setProjectTagId(projectTagId);
                project.setProjectTagName(projectTag.getName());
            }
        }
    }
}
