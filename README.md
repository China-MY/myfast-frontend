# MyFast-Admin 前端

<div align="center">

MyFast-Admin 是一款基于 FastAPI 和 Vue3 的现代化企业级开发框架，这是项目的前端部分。

[![Vue](https://img.shields.io/badge/Vue-3.x-brightgreen.svg)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-4.x-yellow.svg)](https://vitejs.dev/)
[![Element Plus](https://img.shields.io/badge/Element_Plus-2.x-blue.svg)](https://element-plus.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

</div>

## 🌟 项目简介

MyFast-Admin 前端采用 Vue3 + TypeScript + Vite + Element Plus 技术栈开发，提供现代化、响应式的用户界面，支持各种企业管理功能。

## ✨ 核心特性

- **现代化框架**：基于 Vue 3 Composition API 和 TypeScript
- **响应式界面**：适配各种屏幕尺寸的设计
- **主题定制**：可定制的主题和布局
- **权限控制**：精细的按钮和页面级权限管理
- **丰富组件**：内置大量业务组件
- **国际化**：多语言支持
- **API 集成**：与后端 API 的无缝集成
- **状态管理**：基于 Pinia 的高效状态管理

## 🔥 技术栈

- **核心框架**：Vue 3
- **开发语言**：TypeScript
- **构建工具**：Vite 4
- **UI 框架**：Element Plus 2
- **状态管理**：Pinia
- **路由**：Vue Router 4
- **HTTP 客户端**：Axios
- **CSS 预处理器**：SCSS

## 📦 项目结构

```
myfast-frontend/                      # 前端项目根目录
├── src/                              # 源代码目录
│   ├── api/                          # API接口定义
│   │   ├── index.ts                  # API入口文件
│   │   ├── renzheng.ts               # 认证API
│   │   ├── yonghuguanli.ts           # 用户管理API
│   │   ├── jiaoseguanli.ts           # 角色管理API
│   │   ├── caidanguanli.ts           # 菜单管理API
│   │   ├── zidianguanli.ts           # 字典管理API
│   │   └── ...                       # 其他API文件
│   ├── assets/                       # 静态资源
│   ├── components/                   # 组件
│   ├── hooks/                        # 自定义hooks
│   ├── layout/                       # 布局组件
│   ├── router/                       # 路由配置
│   ├── store/                        # 状态管理
│   ├── stores/                       # Pinia状态管理
│   ├── styles/                       # 样式文件
│   ├── types/                        # 类型定义
│   ├── utils/                        # 工具函数
│   ├── views/                        # 页面视图
│   │   ├── dashboard/                # 仪表盘页面
│   │   ├── login/                    # 登录页面
│   │   ├── monitor/                  # 监控管理
│   │   ├── system/                   # 系统管理
│   │   ├── user/                     # 用户相关
│   │   └── ...                       # 其他页面
│   ├── App.vue                       # 根组件
│   ├── main.ts                       # 入口文件
│   └── request.ts                    # 请求封装
├── public/                           # 公共资源
├── index.html                        # HTML模板
├── vite.config.ts                    # Vite配置
├── tsconfig.json                     # TypeScript配置
├── package.json                      # 项目依赖
└── ...                               # 其他配置文件
```



## 🚀 快速开始

### 环境要求

- Node.js 16+
- npm 或 pnpm

### 安装步骤

1. 克隆仓库

```bash
git clone https://gitee.com/myxzgzs/myfast-frontend.git
或
git clone https://github.com/China-MY/myfast-frontend.git
cd myfast-frontend
```

2. 安装依赖

```bash
npm install
# 或
pnpm install
```

3. 启动开发服务器

```bash
npm run dev
# 或
pnpm dev
```

4. 构建生产版本

```bash
npm run build
# 或
pnpm build
```

## 📃 功能列表

- **登录/注册**
  - 账号密码登录
  - 用户注册
  - 第三方登录集成

- **系统管理**
  - 用户管理
    - 用户列表
    - 用户创建/编辑/删除
    - 用户角色分配
  
  - 角色管理
    - 角色列表
    - 角色创建/编辑/删除
    - 权限分配
  
  - 菜单管理
    - 菜单树结构
    - 菜单创建/编辑/删除
  
  - 字典管理
    - 字典类型列表
    - 字典类型创建/编辑/删除
    - 字典数据管理
    - 字典数据弹窗编辑
  
  - 部门管理
    - 部门树结构
    - 部门创建/编辑/删除

- **个人中心**
  - 个人信息
  - 修改密码
  - 操作日志

## 💻 开发指南

### 新增页面

1. 在 `src/views/` 下创建新的页面组件
2. 在 `src/router/routes.ts` 中添加路由配置
3. 如果需要，在 `src/api/` 下创建对应的 API 接口
4. 添加页面的权限控制（如需）

### 状态管理

使用 Pinia 进行状态管理，在 `src/store/modules/` 下创建新的状态模块。

### 权限控制

按钮和页面级别的权限控制通过路由守卫和指令实现，详见 `src/router/guard.ts` 和权限指令。

## 🔐 安全建议

- 所有敏感信息不要在前端存储
- 实施合理的请求速率限制
- 确保所有 API 请求都有适当的权限检查
- 定期更新依赖包

## 🤝 参与贡献

1. Fork 本仓库
2. 创建特性分支 `git checkout -b feature/your-feature`
3. 提交更改 `git commit -m 'Add some feature'`
4. 推送到分支 `git push origin feature/your-feature`
5. 提交 Pull Request

## 📄 许可证

[MIT License](LICENSE)

---

© 2025-2026 明裕学长 团队. 保留所有权利.
