#  mkfree-deploy 自动化部署系统

### 简述
- mkfree-deploy 自动化部署系统，为什么重复造轮子，不是有jenkins吗？jenkins功能更加强大了，为什么不使用？开发这玩意纯粹是玩玩，顺便学习一下前端。
- mkfree-deploy 一个web部署系统工具，配置简单、功能完善、界面流畅、开箱即用！支持git版本管理，支持各种web代码发布，PHP，Python，JAVA等代码的发布、回滚，可以通过web来一键完成。
- 其实还有很多功能没有完善。

### 技术栈（Typescript贯穿前后端）
- 语言：Typescript、Less、Html、Shell、Sql
- 前端： React、Dva、Umi、Ant-Design、Webpack
- 后端：Nodejs
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

### 环境要求
- centos （版本越新越好）
- ubuntu（版本越新越好）


### 安装
- java8 以上版本
- mysql5.5 以上版本
- git
- maven3 以上版本

````bash
git clone https://gitee.com/381895649/mkfree-deploy.git
cd mkfree-deploy-backend
````
打开配置文件 application-prod.properties 修改数据库连接配置

````java
# EMBEDDED SERVER CONFIGURATION (ServerProperties)
server.port=8091
server.tomcat.uri-encoding=UTF-8

# http setting
spring.http.encoding.charset=UTF-8
spring.http.encoding.enabled=true
spring.http.encoding.force=true

#db
spring.datasource.url=jdbc:mysql://127.0.0.1:3306/mkfree_deploy_prod?useUnicode=true&characterEncoding=UTF-8&useSSL=false
spring.datasource.username=root
spring.datasource.password=
#jpa
spring.jpa.hibernate.ddl-auto=update


#thymeleaf
spring.thymeleaf.cache=false
spring.thymeleaf.prefix=classpath:/templates/
spring.thymeleaf.encoding=UTF-8
````
构建项目
```` bash
mvn clean package
````
启动命令
````
java -jar target/mkfree-deploy-backend-1.0.0.jar --spring.profiles.active=prod
````

------

### 如何使用


- 安装界面
	- 基本信息
		- 项目路径：用于存放 git clone项目文件
		- 构建路劲：用于存放项目构建后文件
	-  超级管理员信息
		- 用户名：超级管理员用户名
		- 密码：超级管理密码
	- ![image](https://gitee.com/381895649/mkfree-deploy/raw/master/doc/images/mkfree-install.jpeg)
