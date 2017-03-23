#!/bin/bash

projectSystemPath=$1 #项目系统路径

cd ${projectSystemPath}
echo "cd $projectSystemPath"
echo "git pull"
git pull
echo "##########git_branch_list##########"
echo $(git branch -a)
echo "##########git_branch_list##########"