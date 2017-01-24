#!/bin/bash

projectName=$1 #项目名称
localPath=$2 #项目路径
gitUrl=$3 #git仓库地址
publishBranch=$4 #发布分支


echo 'deploy start'
projectPath="$localPath/$projectName"
echo ${projectPath}
# 当项目不存在
if [ ! -d "$projectPath" ]; then
    mkdir -p ${projectPath}
    cd ${projectPath}
    echo "git clone $gitUrl"
    echo 'git clone start . . .'
    git clone ${gitUrl}
    echo "git clone $gitUrl"
    echo 'git clone success . . .'
fi

# 进入指定目录
echo "cd $projectPath"
cd ${projectPath}



remoteBranch=echo git branch -a | grep remotes | grep ${publishBranch}


echo 'deploy finish !!!'