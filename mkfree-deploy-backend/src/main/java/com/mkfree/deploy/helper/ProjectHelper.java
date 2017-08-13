package com.mkfree.deploy.helper;

import com.mkfree.deploy.domain.ProjectBuildStep;
import com.mkfree.deploy.domain.ProjectDeployFile;
import com.mkfree.deploy.domain.enumclass.ProjectBuildStepType;
import com.mkfree.deploy.domain.enumclass.ProjectEnv;
import com.mkfree.deploy.repository.ProjectDeployFileRepository;
import com.mkfree.deploy.repository.ProjectStructureStepRepository;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.text.StrSubstitutor;
import org.apache.commons.lang3.time.DateFormatUtils;

import java.util.Date;
import java.util.List;
import java.util.Map;

/**
 * Created by oyhk on 2017/8/13.
 *
 *
 */
public enum  ProjectHelper {
    SINGLEONE;

    public String createDeployShell(StrSubstitutor strSubstitutor, StringBuilder shellBuilder, Map<String, String> params, String projectPath, String publicBranch, Long projectId, ProjectEnv projectEnv, ProjectDeployFileRepository projectDeployFileRepository, ProjectStructureStepRepository projectStructureStepRepository, Boolean isDeploy) {

        // 5. 在远程服务器创建标准目录结构
        shellBuilder.append("echo ssh -p #{port} #{username}@#{ip} 'mkdir -p #{remoteProjectPath}'").append("\n");
        shellBuilder.append("ssh -p #{port} #{username}@#{ip} ").append("'").append("mkdir -p #{remoteProjectPath}").append("\n");

        shellBuilder.append("echo mkdir -p #{remoteProjectPath}/version").append("\n");
        shellBuilder.append("mkdir -p #{remoteProjectPath}/version").append("\n");

        // 6. 在远程服务器创建 git 分支 + git log version + 当前发布时间 目录，格式：release_2.1.0_f0a39fe52e3f1f4b3b42ee323623ae71ada21094_20170608
        String getLogVersionShell = "cd " + projectPath + " \n git pull \n git checkout origin " + publicBranch + " \n echo $(git log -1)";
        String gitLogVersion = ShellHelper.SINGLEONE.executeShellCommand(null, getLogVersionShell);
        if (StringUtils.isNotBlank(gitLogVersion)) {
            gitLogVersion = gitLogVersion.substring(gitLogVersion.indexOf("commit") + 6, gitLogVersion.indexOf("commit") + 19).trim();
        }
        String projectVersionDir = DateFormatUtils.format(new Date(), "yyyyMMdd") + "_" + publicBranch.replace("/", "_") + "_" + gitLogVersion;
        shellBuilder.append("echo mkdir -p #{remoteProjectPath}/version/#{projectVersionDir}").append("\n");
        shellBuilder.append("mkdir -p #{remoteProjectPath}/version/#{projectVersionDir}").append("\n");
        params.put("projectVersionDir", projectVersionDir);

        // 7. 删除软连接
        shellBuilder.append("echo ln -sf #{remoteProjectPath}/current").append("\n");
        shellBuilder.append("ln -sf #{remoteProjectPath}/current").append("\n");
        shellBuilder.append("echo rm -rf  #{remoteProjectPath}/current").append("\n");
        shellBuilder.append("rm -rf  #{remoteProjectPath}/current").append("\n");


        // 8. 建立软连接
        shellBuilder.append("echo ln -s #{remoteProjectPath}/version/#{projectVersionDir} #{remoteProjectPath}/current").append("\n");
        shellBuilder.append("ln -s #{remoteProjectPath}/version/#{projectVersionDir} #{remoteProjectPath}/current").append("\n");
        shellBuilder.append("ln -sf ~/current").append("\n").append("rm -rf ~/current").append("'").append("\n");


        // 9. 上传发布文件
        List<ProjectDeployFile> projectDeployFileList = projectDeployFileRepository.findByProjectId(projectId);

        for (int i = 0; i < projectDeployFileList.size(); i++) {
            ProjectDeployFile projectDeployFile = projectDeployFileList.get(i);
            shellBuilder.append("echo scp -P #{port} -r #{projectPath}/#{projectDeployFileLocalFilePath").append(i).append("} #{username}@#{ip}:#{remoteProjectPath}/version/#{projectVersionDir}").append("\n");
            shellBuilder.append("scp -P #{port} -r #{projectPath}/#{projectDeployFileLocalFilePath").append(i).append("} #{username}@#{ip}:#{remoteProjectPath}/version/#{projectVersionDir}/#{projectDeployFileRemoteFilePath").append(i).append("}").append("\n");
            params.put("projectDeployFileLocalFilePath" + i, projectDeployFile.getLocalFilePath());
            params.put("projectDeployFileRemoteFilePath" + i, projectDeployFile.getRemoteFilePath());
        }

        // 10. 查看此版本上传后文件列表
        shellBuilder.append("ssh -p #{port} #{username}@#{ip} ").append("'");
        shellBuilder.append("echo tree #{remoteProjectPath}/current").append("\n");
        shellBuilder.append("tree #{remoteProjectPath}/current").append("\n");

        if (isDeploy) {
            // 11. 执行构建后命令
            List<ProjectBuildStep> afterProjectBuildStepList = projectStructureStepRepository.findByProjectIdAndTypeAndEnv(projectId, ProjectBuildStepType.AFTER, projectEnv);
            afterProjectBuildStepList.forEach(projectStructureStep -> {
                shellBuilder.append("echo ").append(projectStructureStep.getStep()).append("\n");
                shellBuilder.append(projectStructureStep.getStep()).append("\n");
            });
        } else {
            // 11. 执行同步后命令
            List<ProjectBuildStep> afterProjectBuildStepList = projectStructureStepRepository.findByProjectIdAndTypeAndEnv(projectId, ProjectBuildStepType.SYNC, projectEnv);
            afterProjectBuildStepList.forEach(projectStructureStep -> {
                shellBuilder.append("echo ").append(projectStructureStep.getStep()).append("\n");
                shellBuilder.append(projectStructureStep.getStep()).append("\n");
            });
        }

        shellBuilder.append("'");


        return strSubstitutor.replace(shellBuilder.toString());
    }

}
