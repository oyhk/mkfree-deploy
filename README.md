#  Mkfree Deploy 自动化运维系统

### 简述
- Mkfree Deploy 自动化部署系统，为什么重复造轮子，不是有Jenkins吗？Jenkins功能更加强大了，为什么不使用？开发这玩意纯粹是玩玩，顺便学习一下前端。
- Mkfree Deploy 一个web部署系统工具，配置简单、功能完善、界面流畅、开箱即用！支持Git版本管理，支持各种web代码发布，PHP，Python，Java等代码的发布、回滚，可以通过web来一键完成。
- 其实还有很多功能没有完善。
- 之前的版本是使用Java开发，现在用Typescript重写整个项目。

### 技术栈（Typescript贯穿前后端）
- 语言：Typescript、Less、Html、Shell、Sql、Nodejs
- 前端： React、Dva、Umi、Ant-Design、Webpack
- 后端：Nodejs、Nestjs、Typeorm
- 数据库：Sqlite3

### 原理分析
![image](https://gitee.com/oyhk/mkfree-deploy/raw/master/doc/images/mk-deploy.jpeg)

### 用它可以做些神马？
- 用户管理
- 项目的用户权限管理
- 项目管理
- 版本回滚
- 支持多项目部署


## 快速开始

### 环境
- 操作系统 Centos 或者 Ubuntu（版本越新越好）

### 安装（Centos为例演示一下安装过程）

#### 1、安装Git
````bash
yum install git
````
确认Git已经安装成功
````bash
git version
````
输出：git version 1.8.3.1

#### 2、安装 Nodejs LTS版本
````bash
# 版本LTS越新越好哦
wget https://nodejs.org/dist/v12.18.1/node-v12.18.1-linux-x64.tar.xz
xz -d node-v12.18.1-linux-x64.tar.xz
tar -xvf node-v12.18.1-linux-x64.tar.xz
````
确认 Nodejs 已经安装成功，环境变量配置一下。
````bash
node -v
````
输出：v12.18.1
#### 3、安装cnpm
参考资料：https://developer.aliyun.com/mirror/npm/package/cnpm
````bash
npm install cnpm -g
````

#### 4、安装Nestjs
参考资料：https://docs.nestjs.com
````bash
cnpm install -g @nestjs/cli
````
Nestjs安装后，把nest添加到环境变量中。

#### 4、启动项目
4.1、git clone 项目
````bash
git clone https://gitee.com/oyhk/mkfree-deploy.git
cd mkfree-deploy/backend
````
4.2、切换到最新release/1.1.0版本分支
````bash
git checkout release/1.1.0
````
4.3、安装依赖
````bash
cnpm install
````
4.4、构建项目
````bash
npm run build
````
4.5、运行
````bash
node dist/main.js
````
启动后，系统会自动生成数据文件。

------
### 如何使用

#### 访问链接： http://localhost:5000 ，自动跳转到系统安装页面
![image](https://gitee.com/oyhk/mkfree-deploy/raw/master/doc/images/mk-install.png)
