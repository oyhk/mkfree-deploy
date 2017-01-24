#!/bin/bash
mkdir $2
cd $2
echo 'deploy start'

echo "git clone $1"
echo 'git clone start . . .'
git clone $1
echo "git clone $1"
echo 'git clone success . . .'


echo 'deploy finish !!!'