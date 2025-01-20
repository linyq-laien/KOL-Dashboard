# KOL-Dashboard
KOL数据仪表盘 - 产品需求文档(PRD)

## 1. 产品概述

### 1.1 产品定位
KOL-Dashboard 是一个专业的网红数据管理平台，旨在帮助品牌方和MCN机构高效管理KOL资源，评估合作效果，优化投放决策。

### 1.2 目标用户
- 品牌营销团队
- MCN机构运营人员
- 社交媒体投放专员
- 数据分析师

### 1.3 核心价值
- 集中化管理KOL资源库
- 数据驱动的合作决策
- 投放效果实时追踪
- 多维度分析报告

## 2. 功能需求

### 2.1 数据字段设计

#### 2.1.1 KOL基础信息
| 字段名 | 数据类型 | 是否必填 | 说明 |
|-------|---------|---------|------|
| KOL ID | String | 是 | KOL平台唯一标识 |
| KOL Name | String | 是 | KOL显示名称 |
| Email | String | 是 | 联系邮箱 |
| Bio | Text | 否 | KOL简介 |
| Gender | Enum | 是 | 性别(MALE/FEMALE) |
| Language | String | 是 | 主要使用语言 |
| Location | String | 是 | 所在地区 |
| Source | String | 是 | 数据来源平台 |
| Tag | Array | 否 | 标签分类 |
| Account link | URL | 是 | 社交账号链接 |
| Creator ID | String | 是 | 平台原始ID |

#### 2.1.2 数据指标
| 字段名 | 数据类型 | 更新频率 | 说明 |
|-------|---------|---------|------|
| Followers(K) | Number | 日更新 | 粉丝数(千) |
| Likes(K) | Number | 日更新 | 获赞数(千) |
| Mean Views(K) | Number | 日更新 | 平均观看数(千) |
| Median Views(K) | Number | 日更新 | 中位数观看量(千) |
| Engagement Rate(%) | Float | 日更新 | 互动率 |
| Average Views(K) | Number | 日更新 | 平均观看量(千) |
| Average Likes(K) | Number | 日更新 | 平均点赞数(千) |
| Average Comments(K) | Number | 日更新 | 平均评论数(千) |

#### 2.1.3 运营数据
| 字段名 | 数据类型 | 说明 |
|-------|---------|------|
| Send Status | Enum | 发送状态 |
| Send Date | DateTime | 发送日期 |
| Export Date | DateTime | 导出日期 |
| Level | Enum | KOL等级(如:Micro 10-50k) |
| Keywords-AI | Array | AI提取的关键词 |
| Most used hashtags | Array | 常用话题标签 |

#### 2.1.4 合作记录
| 字段名 | 数据类型 | 说明 |
|-------|---------|------|
| 合作ID | String | 唯一标识 |
| 品牌方 | String | 合作品牌 |
| 合作类型 | Enum | 直播/短视频/图文 |
| 投放时间 | DateTime | 发布时间 |
| 合作费用 | Number | 单位：元 |
| 合作效果 | Object | 包含多个效果指标 |
| 备注 | Text | 其他说明 |

### 2.2 功能模块

#### 2.2.1 数据管理
- 新增KOL信息
  - 表单手动录入
  - Excel批量导入
  - 平台数据自动抓取
- 编辑现有数据
  - 单字段快速修改
  - 整体信息编辑
  - 批量更新功能
- 删除操作
  - 单条删除(二次确认)
  - 批量删除(二次确认)
  - 删除记录日志

#### 2.2.2 数据查询
- 基础搜索
  - 关键词模糊匹配
  - 多字段组合查询
- 高级筛选
  - 数值范围筛选
  - 多选条件筛选
  - 时间区间选择
- 数据导出
  - 自定义字段导出
  - 多种文件格式
  - 导出历史记录

#### 2.2.3 数据分析
- 数据概览
  - KOL总量统计
  - 平台分布占比
  - 领域分布占比
- 趋势分析
  - 粉丝增长趋势
  - 互动率变化
  - 投放效果对比
- 定制报表
  - 自定义指标组合
  - 多维度交叉分析
  - 报表定时发送

## 3. 界面设计

### 3.1 总体布局

## 4. 项目结构

```
KOL-Dashboard/
├── src/
│   ├── components/         # 基础组件
│   │   ├── Header.tsx     # 顶部导航栏
│   │   ├── Sidebar.tsx    # 侧边菜单栏
│   │   ├── TableColumnSelector.tsx  # 表格列选择器
│   │   └── TableFilter.tsx # 表格筛选器
│   ├── pages/             # 页面组件
│   │   ├── Analytics.tsx  # 数据分析页面
│   │   ├── Dashboard.tsx  # 仪表盘页面
│   │   ├── KOLManagement.tsx  # KOL管理页面
│   │   ├── Search.tsx     # 搜索页面
│   │   └── Settings.tsx   # 设置页面
│   ├── types/            # TypeScript 类型定义
│   ├── App.tsx          # 应用程序入口
│   └── main.tsx         # 主渲染文件
├── public/              # 静态资源
├── .bolt/              # Bolt 配置
├── eslint.config.js    # ESLint 配置
├── tailwind.config.js  # Tailwind CSS 配置
├── tsconfig.json       # TypeScript 配置
├── vite.config.ts      # Vite 配置
└── package.json        # 项目依赖配置
```

## 5. 功能完成状态

### 5.1 已完成功能

- ✅ 项目基础架构搭建
  - React + TypeScript + Vite 环境配置
  - Tailwind CSS 样式集成
  - ESLint 代码规范配置
  
- ✅ 基础UI组件
  - 响应式布局
  - 顶部导航栏
  - 侧边菜单栏
  - 表格列选择器
  - 表格筛选器

- ✅ 页面路由
  - 仪表盘页面
  - 数据分析页面
  - KOL管理页面
  - 搜索页面
  - 设置页面

### 5.2 开发中功能

- 🚧 数据管理
  - [ ] KOL信息的增删改查
  - [ ] 批量导入导出
  - [ ] 数据验证

- 🚧 数据分析
  - [ ] 数据可视化图表
  - [ ] 趋势分析
  - [ ] 自定义报表

- 🚧 系统功能
  - [ ] 用户认证
  - [ ] 权限管理
  - [ ] 操作日志

### 5.3 待开发功能

- 📅 API集成
  - [ ] 社交平台数据接入
  - [ ] 数据自动更新
  - [ ] 第三方服务集成

- 📅 高级功能
  - [ ] AI关键词提取
  - [ ] 智能推荐
  - [ ] 自动化报告

## 6. 技术栈

- **前端框架**: React 18
- **开发语言**: TypeScript
- **构建工具**: Vite
- **CSS框架**: Tailwind CSS
- **状态管理**: 待定
- **UI组件**: 自定义组件
- **图表库**: 待定
- **代码规范**: ESLint
