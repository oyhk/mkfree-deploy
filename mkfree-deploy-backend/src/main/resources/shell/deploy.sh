#!/bin/bash

projectName=$1 #项目名称
localPath=$2 #项目路径
gitUrl=$3 #git仓库地址
publishBranch=$4 #发布分支

#git@git.oschina.net:kcoupon/rockcent.git 截取项目名称 rockcent
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
    git checkout ${lastReleaseBranch}
    remoteBranchVersion=$(git rev-parse HEAD)
    echo "git checkout  $lastReleaseBranch , version is : $remoteBranchVersion"
    # 用maven 编译 java 项目
    mvn clean package -pl rockcent-common-lib,rockcent-mall-lib,rockcent-site-api -am
fi


echo 'deploy finish !!!'