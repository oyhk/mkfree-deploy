#!/bin/bash

projectSystemPath=$1 #项目系统路径
projectBranchListSplit=$2 #分支列表分隔符

cd ${projectSystemPath}
echo "cd $projectSystemPath"
echo "git pull"
git pull
echo "$projectBranchListSplit"
echo "$(git branch -a)"
echo "$projectBranchListSplit"