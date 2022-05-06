## 1.1.3 (2022-04-19)

### ✨ Features | 新功能

- add `defineOptions` for `script setup` ([1c935d8](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/1c935d8)) by: handsomeFu on 2022-04-06
- API 账单添加托运账号列 ([9f85454](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/9f85454)) by: handsomeFu on 2022-04-08
- **api 管理:** 新增托运账号新增编辑 ([cef48c5](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/cef48c5)) by: handsomeFu on 2022-04-12
- 新增 closeIcon ([427b68c](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/427b68c)) by: handsomeFu on 2022-04-11

### 🐛 Bug Fixes | Bug 修复

- **dayJs:** 添加 dayjs 相关语言包 ([75559e2](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/75559e2)) by: handsomeFu on 2022-04-18
- submit bugs ([e205a81](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/e205a81)) by: 陈思琪 on 2022-04-12
- 修复 xlsx 包升级后打包异常 ([275f1c1](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/275f1c1)) by: handsomeFu on 2022-04-08

### 📝 Documentation | 文档

- update readme ([dd11a1a](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/dd11a1a)) by: handsomeFu on 2022-04-02

### 🔨 Code Refactoring | 代码重构

- 重构订单详情页面 ([487c8cd](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/487c8cd)) by: handsomeFu on 2022-04-19

### 🚴 杂

- add changelog about pkg ([ab87563](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/ab87563)) by: handsomeFu on 2022-04-02
- add czrc ([8513302](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/8513302)) by: handsomeFu on 2022-04-02
- bump node version to v17 ([77ecea8](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/77ecea8)) by: handsomeFu on 2022-04-02
- migrate vitest ([16d82c6](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/16d82c6)) by: handsomeFu on 2022-04-02
- update deps ([5ea2082](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/5ea2082)) by: handsomeFu on 2022-04-06
- update prettierignore ([5282ede](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/5282ede)) by: handsomeFu on 2022-04-02
- 修复 elp dialog 样式 ([be1578a](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/be1578a)) by: handsomeFu on 2022-04-11
- 初始非强制公共不弹窗 ([7c9b6af](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/7c9b6af)) by: handsomeFu on 2022-04-11
- 升级 element-plus 至 2.1.10 ([2ed5861](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/2ed5861)) by: handsomeFu on 2022-04-19
- 升级 element-plus 至 2.1.9 并修复分页组件 ([5dcbc6d](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/5dcbc6d)) by: handsomeFu on 2022-04-18

## [1.1.2](https://gitee.com/ningbo-discovery-international/web-tms-system/compare/v1.1.1...v1.1.2) (2022-03-25)

### ✨ Features | 新功能

- **login:** 添加了模拟自动登录功能&新增返回中台按钮 ([e5b1c66](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/e5b1c66)) by: handsomeFu on 2022-02-15
- **unplugin-vue-components:** add components.d.ts about ([87fd7a7](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/87fd7a7)) by: handsomeFu on 2022-01-26
- 计费重添加创建时间 ([e040660](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/e040660)) by: handsomeFu on 2022-03-18

### 🎨 Styles | 风格

- format code ([5e0fcf4](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/5e0fcf4)) by: handsomeFu on 2022-01-29

### 🐛 Bug Fixes | Bug 修复

- **billAdjust:** 修复查询字段错位 ([f087054](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/f087054)) by: handsomeFu on 2022-01-28
- fix typo ([89ca516](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/89ca516)) by: handsomeFu on 2022-02-25
- **incidentals-detail:** fix rule tip typo ([3af0735](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/3af0735)) by: handsomeFu on 2022-01-26
- **login:** 修复外部跳转自动登录时无及时更新 token ([aafd0be](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/aafd0be)) by: handsomeFu on 2022-02-15
- **rule:** 修复分区方案/服务商管理关闭弹窗未及时清除校验结果 ([3396096](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/3396096)) by: handsomeFu on 2022-01-26
- **user:** 修复新增用户缺少角色数据 ([69b3d8f](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/69b3d8f)) by: handsomeFu on 2022-01-27
- 修复如果是登录状态下从中台重定向不显示中台按钮 ([c947e20](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/c947e20)) by: handsomeFu on 2022-02-24
- 修复脚本路径异常以及抽取通用代码封装变量 ([863d7ff](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/863d7ff)) by: handsomeFu on 2022-03-23
- 修复首页短屏下样式错乱 ([2a26ba3](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/2a26ba3)) by: handsomeFu on 2022-03-14
- **计费重:** 修复计费重弹窗查看情况下保存按钮以及未清除校验结果 ([d08d897](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/d08d897)) by: handsomeFu on 2022-01-25

### 🔨 Code Refactoring | 代码重构

- **api:** 重构财务相关 api 目录 ([db69814](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/db69814)) by: handsomeFu on 2022-01-28

### 🚴 杂

- **routeHelper:** 更换导入顺序 ([4122426](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/4122426)) by: handsomeFu on 2022-03-18
- upgrade dependencies ([a395eab](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/a395eab)) by: handsomeFu on 2022-01-30
- 优化脚本取消的逻辑 ([520ba15](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/520ba15)) by: handsomeFu on 2022-03-21
- 优化部署脚本，支持选择环境部署 ([ab53235](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/ab53235)) by: handsomeFu on 2022-03-18
- 修改 logo 以及按钮文字 ([a52fb28](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/a52fb28)) by: handsomeFu on 2022-02-28
- 固定账单表格操作列 ([2c07aa8](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/2c07aa8)) by: handsomeFu on 2022-02-14
- 移除返回操作中心按钮相关 ([de83ce1](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/de83ce1)) by: handsomeFu on 2022-03-11

## [1.1.1](https://gitee.com/ningbo-discovery-international/web-tms-system/compare/v1.1.0...v1.1.1) (2022-01-25)

### ✨ Features | 新功能

- support dev https ([7011479](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/7011479)) by: handsomeFu on 2022-01-25

### 🎨 Styles | 风格

- **ui:** 调整 elp 的 dialog 头部 padding ([b19ef86](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/b19ef86)) by: handsomeFu on 2022-01-18

### 🐛 Bug Fixes | Bug 修复

- **bankPage:** 修复查询不到数据依旧显示分页条数 ([d3e7fec](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/d3e7fec)) by: handsomeFu on 2022-01-24
- **channel:** 修复渠道管理新增时弹窗样式 ([0745d98](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/0745d98)) by: handsomeFu on 2022-01-24
- **saleFlow:** 修复销售流水缺失的客户详情 ([d9c9446](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/d9c9446)) by: handsomeFu on 2022-01-18
- **submit:** 修复弹窗未填入数据造成的 loading ([bee8f86](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/bee8f86)) by: handsomeFu on 2022-01-24
- **UploadApi:** 修复上传的 API 接口 ([39dd332](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/39dd332)) by: handsomeFu on 2022-01-25
- **客户列表:** 修复分配代表编辑丢失数据以及分离弹窗事件并移除中文排序 ([6e9205d](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/6e9205d)) by: handsomeFu on 2022-01-24
- **计费重:** 修复计费重体积系数校验失败导致不能新增 ([050d2af](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/050d2af)) by: handsomeFu on 2022-01-25
- **订单列表:** 订单列表取消按钮显示条件添加了订单状态为 8 不显示 ([a5cbf23](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/a5cbf23)) by: handsomeFu on 2022-01-18

### 👷 Continuous Integration | CI 配置

- 添加 npm 以及 nvm 相关配置文件 ([c8f87a7](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/c8f87a7)) by: handsomeFu on 2022-01-24

### 🔨 Code Refactoring | 代码重构

- **api:** 客户入账和补收账单中上传组件 action 地址改为动态地址 ([9f9491a](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/9f9491a)) by: handsomeFu on 2022-01-19

### 🚀 Performance Improvements | 性能优化

- **axios:** 优化 axios 全局错误提示 ([3632966](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/3632966)) by: handsomeFu on 2022-01-19
- **pwdDialog:** 优化改密弹窗，修改初始密码无需输入旧的密码 ([b9c75db](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/b9c75db)) by: handsomeFu on 2022-01-19

### 🚴 杂

- fix type error ([8af483d](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/8af483d)) by: handsomeFu on 2022-01-24
- upgrade dependencies ([80a6919](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/80a6919)) by: handsomeFu on 2022-01-20
- 修改 lint-staged 配置 ([4f39ba2](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/4f39ba2)) by: handsomeFu on 2022-01-24

# [1.1.0](https://gitee.com/ningbo-discovery-international/web-tms-system/compare/v1.0.0...v1.1.0) (2022-01-18)

### ✨ Features | 新功能

- **utils:** 新增 submitForm 和 resetForm 方法 ([11b185d](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/11b185d)) by: handsomeFu on 2022-01-18
- 新增强制修改初始密码功能 ([ba045d5](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/ba045d5)) by: handsomeFu on 2022-01-05
- **账单调整:** 添加金额输入验证，优化用户体验 ([2974f19](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/2974f19)) by: handsomeFu on 2022-01-14
- **销售折扣管理:** 新增折扣价添加分区功能 ([f665011](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/f665011)) by: handsomeFu on 2022-01-05

### 🎨 Styles | 风格

- 优化登录页样式 ([8338bca](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/8338bca)) by: handsomeFu on 2022-01-06

### 🐛 Bug Fixes | Bug 修复

- **trial:** 修复试算邮编前置不能输入 0 ([abcbe6a](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/abcbe6a)) by: handsomeFu on 2022-01-10
- **upload:** 修复由于后台 API 更改造成的上传问题 ([0c0f0d1](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/0c0f0d1)) by: handsomeFu on 2022-01-18
- 修复了一些输入框只能输入数字 ([7207472](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/7207472)) by: handsomeFu on 2022-01-14
- **银行管理:** 修复由于银行账户过长造成的数字越界 ([fb3338d](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/fb3338d)) by: handsomeFu on 2022-01-14
- **销售折扣管理:** 修复时间选择以及数据控制 ([b62784b](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/b62784b)) by: handsomeFu on 2022-01-10
- **销售折扣管理:** 修复编辑/另存为不能选择分区 ([466a1fa](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/466a1fa)) by: handsomeFu on 2022-01-05
- **销售折扣管理:** 修复编辑时删除导致的数据错乱以及优化用户体检 ([75fd900](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/75fd900)) by: handsomeFu on 2022-01-07

### 📦‍ Build System | 打包构建

- **shell:** 优化 SIT/DEMO 部署脚本 ([514f94d](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/514f94d)) by: handsomeFu on 2022-01-18
- 优化 SIT/DEMO/UAT 部署脚本 ([9a195bf](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/9a195bf)) by: handsomeFu on 2022-01-14
- 优化 UAT 部署脚本，支持免密传输 ([bf4c625](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/bf4c625)) by: handsomeFu on 2022-01-14
- 修改后台 base 地址，统一调整为 tms_api ([44ef87b](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/44ef87b)) by: handsomeFu on 2022-01-14

### 🔨 Code Refactoring | 代码重构

- **shell:** 重构 demo 环境部署脚本 ([8c9ca16](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/8c9ca16)) by: handsomeFu on 2022-01-14
- **shell:** 重构 sit 部署脚本 ([47df4b4](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/47df4b4)) by: handsomeFu on 2022-01-06

### 🚴 杂

- **axios:** 更改请求超时时间为 10 分钟 ([86b7fdb](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/86b7fdb)) by: handsomeFu on 2022-01-05
- **deps:** remove standard-version about pkg ([b043660](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/b043660)) by: handsomeFu on 2022-01-05
- **deps:** update dependency element-plus to v1.3.0-beta.1 ([2cf01bc](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/2cf01bc)) by: handsomeFu on 2022-01-05
- **deps:** update deps ([ed56d04](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/ed56d04)) by: handsomeFu on 2022-01-07
- **pkg:** add prettier about pkg ([e184996](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/e184996)) by: handsomeFu on 2022-01-07
- **prettier:** format code ([39f1898](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/39f1898)) by: handsomeFu on 2022-01-07
- remove compare-func pkg ([71baedc](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/71baedc)) by: handsomeFu on 2022-01-14
- 修改分页组件 pageSizes ([aaa6cdc](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/aaa6cdc)) by: handsomeFu on 2022-01-05
- 更换端口以及开发环境自动打开浏览器 ([867a8c6](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/867a8c6)) by: handsomeFu on 2022-01-10
- 调整 uat 环境的 ip 地址 ([db7e514](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/db7e514)) by: handsomeFu on 2022-01-06

# 1.0.0 (2021-12-31)

### 🎉 Init | 初始化

- :tada: project init ([d24e18d](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/d24e18d)) by: handsomeFu on 2021-11-09

### ✨ Features | 新功能

- add fuel page ([69d8795](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/69d8795)) by: 陈思琪 on 2021-11-25
- add headerTop version ([2836835](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/2836835)) by: handsomeFu on 2021-12-30
- add sale product page and detail page ([ba21a0a](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/ba21a0a)) by: 陈思琪 on 2021-11-24
- **axios:** add axios ([3733e5c](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/3733e5c)) by: handsomeFu on 2021-11-10
- BasicDialog 添加 showSubmitBtn 属性 ([85e8941](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/85e8941)) by: handsomeFu on 2021-11-24
- BasicDialog 添加了 closeDialog 内部关闭方法 ([9fea2ca](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/9fea2ca)) by: handsomeFu on 2021-11-23
- **component:** add headerTop component ([b23ae5a](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/b23ae5a)) by: handsomeFu on 2021-11-15
- **component:** 服务商收支组件 Y 轴刻度修改 ([6628de6](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/6628de6)) by: handsomeFu on 2021-12-20
- **css-plugin:** add windicss ([08d7fc3](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/08d7fc3)) by: handsomeFu on 2021-11-15
- **directive:** 添加了权限指令 ([e42b9ef](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/e42b9ef)) by: handsomeFu on 2021-11-16
- **layout-menu:** 完成头部菜单模块 ([fd56e8b](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/fd56e8b)) by: handsomeFu on 2021-11-16
- **layout:** 基本搭建完成，支持多层级目录 keep-alive ([87dd960](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/87dd960)) by: handsomeFu on 2021-11-12
- **layout:** 添加 `MultipleTab` 组件 ([b159db3](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/b159db3)) by: handsomeFu on 2021-11-16
- **page:** add about page ([1697a37](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/1697a37)) by: handsomeFu on 2021-12-29
- **page:** 完成登录页 ([4f19f05](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/4f19f05)) by: handsomeFu on 2021-11-17
- **page:** 添加了用户管理基本布局以及修复了测试部署参数 ([4c09508](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/4c09508)) by: handsomeFu on 2021-11-18
- **pwd:** add pwd about ([de54cb0](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/de54cb0)) by: handsomeFu on 2021-12-20
- **svg:** add svg about ([367c3d3](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/367c3d3)) by: handsomeFu on 2021-11-16
- **user:** add role column for userList ([3148735](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/3148735)) by: handsomeFu on 2021-12-20
- 仓库地址管理完成 ([6278eb9](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/6278eb9)) by: handsomeFu on 2021-11-26
- 任务调度(任务列表/任务日志) 完成 ([a6061da](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/a6061da)) by: handsomeFu on 2021-11-26
- 优化了新建菜单逻辑 ([a4fe272](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/a4fe272)) by: handsomeFu on 2021-12-17
- 分区方案管理完成 ([5a0f1a8](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/5a0f1a8)) by: 陈思琪 on 2021-11-29
- 初步完成 404 页面 ([08e0e55](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/08e0e55)) by: handsomeFu on 2021-12-06
- 完成 oda 管理以及 oda 配置规则页面，同时添加了导入、导出公共组件 ([313071e](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/313071e)) by: handsomeFu on 2021-11-25
- 完成公告管理页面，添加了 wangEditor 同时移除了 imagemin ([ccc2aff](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/ccc2aff)) by: handsomeFu on 2021-11-24
- 完成字典管理 ([1208d5e](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/1208d5e)) by: handsomeFu on 2021-11-25
- 完成客户管理模块 ([04d05cb](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/04d05cb)) by: handsomeFu on 2021-12-01
- 完成客户首页 ([2204cbd](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/2204cbd)) by: handsomeFu on 2021-12-02
- 完成成本/销售的试算价 ([178f0c0](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/178f0c0)) by: handsomeFu on 2021-11-29
- 完成管理员首页 ([42ad2a7](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/42ad2a7)) by: handsomeFu on 2021-12-02
- 完成角色管理以及用户管理的编辑操作 ([4392e14](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/4392e14)) by: handsomeFu on 2021-11-22
- 完成银行管理页面 ([9b29d1a](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/9b29d1a)) by: handsomeFu on 2021-11-23
- **客户管理:** 输入客户代码时新增去除空格 ([502e9d8](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/502e9d8)) by: handsomeFu on 2021-12-29
- 导出按钮添加文本类型文件 ([ae063e8](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/ae063e8)) by: handsomeFu on 2021-12-01
- 币种管理完成 ([1fb0d04](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/1fb0d04)) by: handsomeFu on 2021-11-26
- 成本杂费以及成本杂费详情完成 ([0f35d19](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/0f35d19)) by: handsomeFu on 2021-11-30
- 成本运费及成本运费详情完成 ([a4a2d71](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/a4a2d71)) by: handsomeFu on 2021-11-30
- 新增首页服务商数据权限 ([cae7f7e](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/cae7f7e)) by: handsomeFu on 2021-12-15
- 服务产品设置 ([772bd2b](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/772bd2b)) by: 陈思琪 on 2021-11-26
- **服务产品详情:** 移除重量段编辑功能 ([712759f](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/712759f)) by: handsomeFu on 2021-12-27
- 服务商收支柱状图更改过滤条件为时间过滤 ([af26396](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/af26396)) by: handsomeFu on 2021-12-15
- 服务商管理完成 ([0d7f32b](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/0d7f32b)) by: 陈思琪 on 2021-11-30
- 流水管理 ([003e628](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/003e628)) by: 陈思琪 on 2021-12-02
- 添加了 EChart 图表以及添加了 paramsStore 用于对 query 的处理 ([f676496](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/f676496)) by: handsomeFu on 2021-12-02
- 添加了 EffectiveStatusText, StatusText 两个全局组件 ([af20b71](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/af20b71)) by: handsomeFu on 2021-11-23
- 添加了 useSelect 的相关 hook ([4f051df](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/4f051df)) by: handsomeFu on 2021-11-23
- 添加了一些下拉框接口 ([436b13e](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/436b13e)) by: handsomeFu on 2021-11-23
- 添加了一些公共下拉方法 ([c94aa58](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/c94aa58)) by: handsomeFu on 2021-11-24
- 添加了一些公共样式 ([ad158fc](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/ad158fc)) by: handsomeFu on 2021-11-23
- 添加了修改密码以及初始密码修改提示模块 ([418ba0a](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/418ba0a)) by: handsomeFu on 2021-12-02
- 添加了动画效果 ([6ad9aff](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/6ad9aff)) by: handsomeFu on 2021-12-07
- 添加了发布弹窗 ([b2aaf82](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/b2aaf82)) by: handsomeFu on 2021-11-24
- 添加了登录验证码 ([9d587a6](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/9d587a6)) by: handsomeFu on 2021-12-03
- 添加路由菜单 ([79532be](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/79532be)) by: handsomeFu on 2021-11-23
- 菜单管理基本完成 ([afd4e76](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/afd4e76)) by: handsomeFu on 2021-11-22
- 订单列表实现 ([9da02e0](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/9da02e0)) by: 陈思琪 on 2021-12-01
- 财务管理 基础管理实现 ([14a2268](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/14a2268)) by: 陈思琪 on 2021-12-03
- 费用管理-费用基础管理(费用类型管理、额外服务管理) 页面完成 ([3f47664](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/3f47664)) by: handsomeFu on 2021-11-26
- 费用重计添加账单类型过滤 ([b757664](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/b757664)) by: handsomeFu on 2021-12-08
- 销售杂费以及销售杂费详情完成 ([42ae6b0](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/42ae6b0)) by: handsomeFu on 2021-11-29
- 销售杂费折扣完成 ([347e07b](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/347e07b)) by: handsomeFu on 2021-11-29
- 销售运费及销售运费详情完成 ([5b5686b](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/5b5686b)) by: handsomeFu on 2021-11-30
- 问题件页面实现 ([b04a6e2](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/b04a6e2)) by: 陈思琪 on 2021-12-01
- 首页服务商收支柱状图添加 loading ([27ea595](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/27ea595)) by: handsomeFu on 2021-12-16
- 首页添加服务商收支柱状图组件 ([c67c438](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/c67c438)) by: handsomeFu on 2021-12-14

### 🎨 Styles | 风格

- code lint ([4969e4a](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/4969e4a)) by: handsomeFu on 2021-12-27
- 优化首页样式 ([9adc7df](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/9adc7df)) by: handsomeFu on 2021-12-22
- 移除了 fillRangeTime，改用 getPickerDate 代替, 同时处理日期函数统一至 dateUtil 文件中 ([5e6be83](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/5e6be83)) by: handsomeFu on 2021-12-15

### 🐛 Bug Fixes | Bug 修复

- **component:** fix ServiceFinanceBar yAxis typo ([e6a2e0a](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/e6a2e0a)) by: handsomeFu on 2021-12-20
- finance sale page bugs fixed ([e35acfe](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/e35acfe)) by: 陈思琪 on 2021-12-20
- **finance/flow/sale:** fix export params ([5f5d6d5](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/5f5d6d5)) by: handsomeFu on 2021-12-20
- fix el-pagination icon style ([9a44cef](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/9a44cef)) by: handsomeFu on 2021-12-20
- fix elp form style ([251c080](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/251c080)) by: handsomeFu on 2021-12-17
- fix ExportButton loading ([c9fcb17](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/c9fcb17)) by: handsomeFu on 2021-12-20
- fix import el style ([e72eb1f](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/e72eb1f)) by: handsomeFu on 2021-11-15
- fix Loading type ([aabcf18](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/aabcf18)) by: handsomeFu on 2021-12-13
- fix some bugs ([f0c196a](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/f0c196a)) by: 陈思琪 on 2021-12-16
- fix some bugs ([f37f17a](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/f37f17a)) by: 陈思琪 on 2021-12-09
- fix some bugs ([c0dab49](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/c0dab49)) by: 陈思琪 on 2021-12-09
- fix some bugs ([3ec2c87](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/3ec2c87)) by: 陈思琪 on 2021-12-07
- fix some bugs ([98f6cd7](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/98f6cd7)) by: 陈思琪 on 2021-12-06
- fix typo, close #I4M0S5 ([46f340f](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/46f340f)) by: handsomeFu on 2021-12-10, closes [#I4M0S5](https://gitee.com/ningbo-discovery-international/web-tms-system/issues/I4M0S5)
- hotfix chart data load ([d105eab](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/d105eab)) by: handsomeFu on 2021-12-14
- order list ([4b7415a](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/4b7415a)) by: 陈思琪 on 2021-12-10
- **orderList:** fix 订单列表缺失审核功能 ([2698b4a](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/2698b4a)) by: handsomeFu on 2021-12-28
- **page:** 修复及优化公告弹窗 ([5e39658](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/5e39658)) by: handsomeFu on 2021-12-08
- **pagination:** 修复了分页组件参数错误 ([27806b3](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/27806b3)) by: handsomeFu on 2021-11-18
- remove dir empty ([5b7e07e](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/5b7e07e)) by: handsomeFu on 2021-12-09
- **table:** 修复 el-table loading 不生效 ([40174ae](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/40174ae)) by: handsomeFu on 2021-12-28
- 修复 #I4KUSU ([54e0606](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/54e0606)) by: handsomeFu on 2021-12-02, closes [#I4](https://gitee.com/ningbo-discovery-international/web-tms-system/issues/I4)
- 修复 #I4LATK 2、3、4 条 ([e59fe35](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/e59fe35)) by: handsomeFu on 2021-12-06, closes [#I4](https://gitee.com/ningbo-discovery-international/web-tms-system/issues/I4)
- 修复 #I4M6BP, close #I4M6BP ([92e19c5](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/92e19c5)) by: handsomeFu on 2021-12-13, closes [#I4M6](https://gitee.com/ningbo-discovery-international/web-tms-system/issues/I4M6)
- 修复 #I4MVAL 相关 ([1e19ddd](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/1e19ddd)) by: handsomeFu on 2021-12-16, closes [#I4](https://gitee.com/ningbo-discovery-international/web-tms-system/issues/I4)
- 修复 elp style ([efc5843](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/efc5843)) by: handsomeFu on 2021-12-14
- 修复 form-item 空校验 ([4641d8b](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/4641d8b)) by: handsomeFu on 2021-12-02
- 修复 useTabs 当前路由 fullPath ([efac522](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/efac522)) by: handsomeFu on 2021-12-10
- 修复上传组件上车成功可能无返回 data ([35085ba](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/35085ba)) by: handsomeFu on 2021-12-03
- 修复了账单权限 ([11cbb0f](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/11cbb0f)) by: handsomeFu on 2021-12-14
- 修复公告过滤条件 ([0759860](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/0759860)) by: handsomeFu on 2021-11-24
- 修复分区方案详情邮编长度 ([98b735d](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/98b735d)) by: handsomeFu on 2021-12-15
- 修复加载列表产生的冗余请求 ([9ffb041](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/9ffb041)) by: handsomeFu on 2021-12-09
- 修复导出按钮的原生 type ([7a885d9](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/7a885d9)) by: handsomeFu on 2021-12-01
- 修复导出组件的空数据处理已经客户列表过滤条件 #I4L1F0 ([b98cd2e](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/b98cd2e)) by: handsomeFu on 2021-12-06, closes [#I4L1F0](https://gitee.com/ningbo-discovery-international/web-tms-system/issues/I4L1F0)
- 修复成本和客户账单的权限标识 ([a60a19c](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/a60a19c)) by: handsomeFu on 2021-12-06
- 修复提示以及部分页面的重置问题 close #I4LUFP ([6099bfa](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/6099bfa)) by: handsomeFu on 2021-12-09, closes [#I4](https://gitee.com/ningbo-discovery-international/web-tms-system/issues/I4)
- 修复文件导入失败逻辑 ([20c68f0](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/20c68f0)) by: handsomeFu on 2021-12-16
- 修复渠道编辑下拉数据的更新 ([a8569ed](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/a8569ed)) by: handsomeFu on 2021-12-14
- 修复编辑新建菜单问题 ([8c7562f](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/8c7562f)) by: handsomeFu on 2021-11-24
- 修复编辑菜单后新增会替换的原因 ([d6afcf9](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/d6afcf9)) by: handsomeFu on 2021-11-25
- 修复菜单逻辑 ([79b7249](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/79b7249)) by: handsomeFu on 2021-11-23
- 修复规则交验提示文字 ([962bb8a](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/962bb8a)) by: handsomeFu on 2021-12-16
- 修复订单列表按钮操作逻辑判断 ([4bff17a](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/4bff17a)) by: handsomeFu on 2021-12-07
- 修复订单里列表导出参数异常 ([9f2aff3](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/9f2aff3)) by: handsomeFu on 2021-12-16
- 修复财务收支柱状图 `resize` 以及 `legend` 位置 ([26bb527](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/26bb527)) by: handsomeFu on 2021-12-21
- 修复重新计费按钮样式 ([79d562c](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/79d562c)) by: handsomeFu on 2021-12-06
- 修复销售杂费折扣弹窗关闭后数据遗留问题 ([f1e38b3](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/f1e38b3)) by: handsomeFu on 2021-12-21
- 修复销售流水页面时间为空过滤异常 ([c0d8fff](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/c0d8fff)) by: handsomeFu on 2021-12-16
- 修复销售运费重置按钮 ([48ff9e7](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/48ff9e7)) by: handsomeFu on 2021-12-09
- 修复首页样式 ([c1c8281](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/c1c8281)) by: handsomeFu on 2021-12-17
- 全局修复遗留样式问题以及移除旧的 dateFormat,采用 dayjs ([2647215](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/2647215)) by: handsomeFu on 2021-12-14
- 移动端不用自动计算首页高度 ([8625b64](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/8625b64)) by: handsomeFu on 2021-12-03

### 👷 Continuous Integration | CI 配置

- add custom changelog setting ([0eeb5bb](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/0eeb5bb)) by: handsomeFu on 2021-12-16
- 添加了 standard-version 规范日志 ([6336bcb](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/6336bcb)) by: handsomeFu on 2021-12-01
- 添加部署脚本 ([917b663](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/917b663)) by: handsomeFu on 2021-12-08

### 📦‍ Build System | 打包构建

- add demo/unit environment ([f390612](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/f390612)) by: handsomeFu on 2021-12-22
- add IMAGEMIN ([72aabc5](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/72aabc5)) by: handsomeFu on 2021-12-09
- change environment unit to sit ([19c1083](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/19c1083)) by: handsomeFu on 2021-12-22
- fix typo ([1bdfea8](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/1bdfea8)) by: handsomeFu on 2021-12-28
- 优化 unit/demo environment ([f1aff60](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/f1aff60)) by: handsomeFu on 2021-12-22
- 优化部署脚本 ([7da69a7](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/7da69a7)) by: handsomeFu on 2021-12-23
- 优化部署脚本 ([13f0292](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/13f0292)) by: handsomeFu on 2021-12-21
- 优化部署脚本，可直接用于测试/生产发布 ([b180d09](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/b180d09)) by: handsomeFu on 2021-12-10
- 修复打包时 warning: "[@charset](https://gitee.com/charset)" ([44767cd](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/44767cd)) by: handsomeFu on 2021-12-07
- 切换包安装方式 yarn --> pnpm ([8e408ed](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/8e408ed)) by: handsomeFu on 2021-12-23
- 新增 `prod` 部署脚本, 同时优化 `uat` 部署脚本 ([8a0baf6](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/8a0baf6)) by: handsomeFu on 2021-12-29
- 更新部署脚本 ([1b402c4](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/1b402c4)) by: handsomeFu on 2021-12-10
- 更新部署脚本 ([787aa04](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/787aa04)) by: handsomeFu on 2021-12-09
- 添加 demo 环境脚本 ([8648334](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/8648334)) by: handsomeFu on 2021-12-23
- 添加了 sit 部署脚本 ([1f6bf6b](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/1f6bf6b)) by: handsomeFu on 2021-12-22

### 🔨 Code Refactoring | 代码重构

- 重构关于页面 ([49ec746](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/49ec746)) by: handsomeFu on 2021-12-30

### 🚀 Performance Improvements | 性能优化

- Stronger mitt typing ([a4aa9aa](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/a4aa9aa)) by: handsomeFu on 2021-12-22
- 优化分页组件 prop ([5f6ff4c](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/5f6ff4c)) by: handsomeFu on 2021-12-07
- 优化图形验证码 ([5622cff](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/5622cff)) by: handsomeFu on 2021-12-10
- 优化图形验证码 ([c261030](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/c261030)) by: handsomeFu on 2021-12-10
- 优化定时任务批量执行 ([349d5d6](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/349d5d6)) by: handsomeFu on 2021-11-26
- 优化异常捕获 ([59b580e](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/59b580e)) by: handsomeFu on 2021-12-09
- 优化服务商下的渠道和 api 页面的标题 ([2e8a56f](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/2e8a56f)) by: handsomeFu on 2021-12-07
- 订单详情页添加了标题，同时优化了 cssName ([9251b22](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/9251b22)) by: handsomeFu on 2021-12-06

### 🚧 待完成

- element style error ([822233e](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/822233e)) by: handsomeFu on 2021-11-10
- 初步完成模板 ([b65843a](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/b65843a)) by: handsomeFu on 2021-11-11
- 待完成菜单部分 ([e0584b4](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/e0584b4)) by: handsomeFu on 2021-11-12
- 添加多个详情页 🌰 ([4964767](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/4964767)) by: handsomeFu on 2021-11-22
- 用户管理页面开发中(剩编辑操作) ([0eacf4a](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/0eacf4a)) by: handsomeFu on 2021-11-19
- 财务管理-账单管理部分完成 账单调整完成，客户/成本账单暂时缺数据进行下一步，补收账单调试中 ([bc3cc54](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/bc3cc54)) by: handsomeFu on 2021-12-03

### 🚴 杂

- add file header comment ([3631fc2](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/3631fc2)) by: handsomeFu on 2021-12-24
- changelog and cz change global ([678691c](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/678691c)) by: handsomeFu on 2021-12-31
- **currency:** fix table-column typo ([4850034](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/4850034)) by: handsomeFu on 2021-12-08
- fix ExportButton type error ([f8d614d](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/f8d614d)) by: handsomeFu on 2021-11-25
- fix recalculate type error ([d3c4d5b](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/d3c4d5b)) by: handsomeFu on 2021-12-08
- optimize the ts support ([7cf7c78](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/7cf7c78)) by: handsomeFu on 2021-12-29
- remove empty style tag ([291fc13](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/291fc13)) by: handsomeFu on 2021-12-07
- remove some console ([78b94b0](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/78b94b0)) by: handsomeFu on 2021-12-14
- remove some console log ([ba15121](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/ba15121)) by: handsomeFu on 2021-11-29
- rename Pagination to BasicPagination ([a8049d3](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/a8049d3)) by: handsomeFu on 2021-12-08
- update CHANGELOG ([e4b28be](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/e4b28be)) by: handsomeFu on 2021-12-20
- update deps ([e8acadf](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/e8acadf)) by: handsomeFu on 2021-12-13
- update deps ([e6faf6c](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/e6faf6c)) by: handsomeFu on 2021-12-08
- update deps ([3d1b074](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/3d1b074)) by: handsomeFu on 2021-12-01
- update develop env ([89d269f](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/89d269f)) by: handsomeFu on 2021-12-27
- update element-plus version ([e5458d3](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/e5458d3)) by: handsomeFu on 2021-12-01
- update types ([94a502d](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/94a502d)) by: handsomeFu on 2021-12-27
- 优化了登录逻辑，无菜单不能进入系统 ([c4aa10c](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/c4aa10c)) by: handsomeFu on 2021-12-02
- 优化按钮样式 ([060541c](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/060541c)) by: handsomeFu on 2021-12-14
- 优化菜单新增编辑逻辑 ([bdd0558](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/bdd0558)) by: handsomeFu on 2021-11-24
- 优化角色管理菜单树处理 ([44ba522](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/44ba522)) by: handsomeFu on 2021-12-09
- 优化订单列表权限相关 ([c8161c5](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/c8161c5)) by: handsomeFu on 2021-12-13
- 优化试算输入条件 ([e1c07bd](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/e1c07bd)) by: handsomeFu on 2021-12-15
- 优化首页图表数据 ([922b6a4](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/922b6a4)) by: handsomeFu on 2021-12-15
- 后台返回 401 状态或请求超时退出登录 ([fc92bd7](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/fc92bd7)) by: handsomeFu on 2021-12-08
- 将 `BasicFilterSearch` 改为全局引入 ([6f47b00](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/6f47b00)) by: handsomeFu on 2021-12-21
- 显示安装一些库，同时更新 icons 库以及迁移至 pnpm ([b5ba8bc](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/b5ba8bc)) by: handsomeFu on 2021-12-08
- 更改首页服务商收支判断条件 ([e594b98](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/e594b98)) by: handsomeFu on 2021-12-22
- 更新本地环境 ([8e7a495](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/8e7a495)) by: handsomeFu on 2021-12-14
- 更新销售产品数据下拉接口 ([ab631e1](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/ab631e1)) by: handsomeFu on 2021-11-26
- 添加 trim 指令 ([297a1bf](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/297a1bf)) by: handsomeFu on 2021-11-30
- 添加了一下公共下拉 ([a1b7f0e](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/a1b7f0e)) by: handsomeFu on 2021-11-26
- 添加详情相关权限 ([176cdc0](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/176cdc0)) by: handsomeFu on 2021-12-13
- 移除菜单组件校验 ([48fcae8](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/48fcae8)) by: handsomeFu on 2021-11-24
- 移除路由 ([6fcc986](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/6fcc986)) by: handsomeFu on 2021-12-03
- 调整币种汇率错误提示 ([a03159f](https://gitee.com/ningbo-discovery-international/web-tms-system/commits/a03159f)) by: handsomeFu on 2021-11-30
