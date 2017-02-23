#!/bin/bash

projectName=$1 #项目名称
localPath=$2 #项目路径
gitUrl=$3 #git仓库地址
publishBranch=$4 #发布分支
remoteProjectPath=$5 #远程机器项目路劲
moduleName=$6 #模块名称
deployTargetFileList=$7 #部署的目的文件或者目录

serverIP=$8 #远程机器的ip地址
serverSshUsername=$9 #远程机器的ssh用户名
serverSshPort=${10} #远程机器的ssh端口

structureStepBeforeList=${11} #构建前步骤
structureStepAfterList=${12} #构建后步骤

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

#当如果是release分支，git存在多个的时候，会自动选择最新版本的release分支发布
if [ 'release/*' == ${publishBranch} ]; then
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
        git pull origin master
    fi
elif [ 'master' == ${publishBranch} ]; then
    git checkout master
    git pull origin master
else
    git checkout ${publishBranch}
    git pull origin ${publishBranch}
fi

# cd 对应项目模块
cd  ${projectAllPath}
echo "cd $projectAllPath"

################ 构建步骤 start  ############
IFS=';' read -ra ADDR <<< "$structureStepBeforeList"
for i in "${ADDR[@]}"; do
    echo "$i"
    ${i}
done
################ 构建步骤 end  ############

######### 同步文件到指定服务器 start ############
ssh -p ${serverSshPort} ${serverSshUsername}@${serverIP} "mkdir -p $remoteProjectPath"
echo "ssh -p $serverSshPort $serverSshUsername@$serverIP mkdir -p $remoteProjectPath"
# 上传指定文件或目录，如有多个文件或目录用 ; 隔开
IFS=';' read -ra ADDR <<< "$deployTargetFileList"
for i in "${ADDR[@]}"; do
    IFS=',' read -ra ADDR1 <<< "$i"
    echo "scp -P $serverSshPort  -r $projectAllPath/${ADDR1[0]} $serverSshUsername@$serverIP:$remoteProjectPath/${ADDR1[1]}"
    echo $(scp -P ${serverSshPort}  -r ${projectAllPath}/${ADDR1[0]} ${serverSshUsername}@${serverIP}:${remoteProjectPath}/${ADDR1[1]})
done
######### 同步文件到指定服务器 end #############

################ 构建后执行命令 start  ############
IFS=';' read -ra ADDR <<< "$structureStepAfterList"
for i in "${ADDR[@]}"; do
    echo "ssh -p ${serverSshPort} ${serverSshUsername}@${serverIP} $i"
    echo $(ssh -p ${serverSshPort} ${serverSshUsername}@${serverIP} "$i")
done
################ 构建后执行命令 end  ############


echo 'deploy success !!!'