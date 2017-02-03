#!/bin/bash

projectName=$1 #项目名称
localPath=$2 #项目路径
gitUrl=$3 #git仓库地址
publishBranch=$4 #发布分支
remoteProjectPath=$5 #远程机器项目路劲
moduleName=$6 #模块名称
deployTargetFile=$7 #部署的目的文件或者目录

#git@git.oschina.net:kcoupon/rockcent.git 例如：截取项目名称 rockcent
gitProjectName=${gitUrl##*/} #git项目名称

echo 'deploy start'
projectAllPath=${localPath}/${projectName}/${gitProjectName/.git/''}
projectPath=${localPath}/${projectName}
# 当项目不存在
if [ ! -d "$projectAllPath" ]; then
    mkdir -p ${projectAllPath}
    cd ${projectPath}
    echo "git clone $gitUrl"
    echo 'git clone start . . .'
    git clone ${gitUrl}
    echo "git clone $gitUrl"
    echo 'git clone success . . .'
fi

# 进入指定目录
echo "cd $projectAllPath"
cd ${projectAllPath}

git pull
if [ 'release' == ${publishBranch} ]; then
    # 获取git release 分支列表
    remoteBranch=$(git branch -a|grep remotes|grep release)
    # 获取release 分支 最后一个版本
    lastReleaseBranch=${remoteBranch##* }

    if [[ "$lastReleaseBranch" == *"release"* ]];then
        git checkout ${lastReleaseBranch}
        remoteBranchVersion=$(git rev-parse HEAD)
        echo "git checkout  $lastReleaseBranch , version is : $remoteBranchVersion"
        # 用maven 编译 java 项目
    else
        echo 'remote branch is not exist , default git checkout master'
        git checkout master
    fi

#    cp -r ${projectAllPath}/${moduleName} ${remoteProjectPath}

#    echo "cp -r $projectAllPath/$moduleName $remoteProjectPath"
    cd  ${projectAllPath}/${moduleName}
    mvn clean package

    ssh -P 22222 rock@112.74.78.236 "mkdir -p /rockcent/apps/$moduleName"
    scp -P 22222  -r ${projectAllPath}/${moduleName}/target/${deployTargetFile} rock@112.74.78.236:/rockcent/apps/${moduleName}/
    echo "scp -P 22222  -r $projectAllPath/$moduleName/target/$deployTargetFile rock@112.74.78.236:/rockcent/apps/$moduleName/"



fi


echo 'deploy finish !!!'