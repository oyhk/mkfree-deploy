#  mk-deploy 自动化部署系统

### 简述
- mk-deploy 自动化部署系统，为什么重复造轮子，不是有jenkins吗？jenkins功能更加强大了，为什么不使用？开发这玩意纯粹是玩玩。

### 技术栈
- 后端 spring-boot、spring、spring-mvc、spring-data-jpa
- 前端框架 react、dva
- 前端UI ant-design
- 数据库 mysql

### 用它可以做些神马？
- 核心思想

![banner](data:image/jpeg;base64,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%E2%80%A6%E2%80%A6)


