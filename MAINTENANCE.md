# markdownShow 维护手册

## 一、系统定位

`markdownShow` 是一个用于展示 Markdown 内容的轻量内容站，目前重点承载：

- GitHub AI Frontend Trending 标准简报
- 前端开发者视角版深度解读
- 栏目索引与历史归档

项目路径：
`/home/admin/webroot/markdownShow`

内容目录：
`/home/admin/webroot/markdownShow/public/markdown`

PM2 服务名：
`markdownShow`

---

## 二、日常维护原则

### 1. 把它当内容站维护，不要当临时 demo

目标是：
- 展示稳定
- 内容结构稳定
- 更新流程稳定
- 首页打开快

### 2. 内容和代码分开对待

- **新增文章**：通常不需要改代码
- **修改首页/接口/展示逻辑**：属于代码变更，需要验证后重启服务

---

## 三、内容维护规范

### 默认内容目录

所有正式文章默认写入：

`/home/admin/webroot/markdownShow/public/markdown`

不要写错到其他 markdownShow 副本目录。

### 正式文章 frontmatter 标准

```yaml
---
title: 文章标题
date: YYYY-MM-DD
series: github-ai-frontend-trending
type: briefing | deep-dive | index
pinned: 数字
summary: 30-50 字摘要
---
```

### 模板文件规范

模板文件必须标记为非正式内容：

```yaml
series: github-ai-frontend-trending-template
type: template
```

否则容易被首页或索引误收录。

### 日期规范

统一使用：

`YYYY-MM-DD`

不要混用英文时间字符串。

---

## 四、栏目更新标准流程

每次生成一期新内容，默认执行下面 4 步：

### Step 1：生成标准简报
文件示例：
- `GitHub-AI-Frontend-Trending-2026-03-18.md`

### Step 2：生成前端开发者视角版
文件示例：
- `GitHub-AI-Frontend-Trending-2026-03-18-Frontend-Dev-View.md`

### Step 3：确认 frontmatter 正确
重点检查：
- title
- date
- series
- type
- pinned
- summary

### Step 4：重建 Index
方式二选一：

#### 方式 A：首页后台按钮
点击：
- `重建 Index`

#### 方式 B：直接调用接口
```bash
curl -X POST http://127.0.0.1:3010/api/markdown/rebuild-index
```

---

## 五、性能维护重点

当前系统性能最敏感的点有 3 个：

### 1. 运行模式

**线上不要长期跑 `npm run dev`**。

理想方式：
- `npm run build`
- `npm run start`

### 2. 列表接口不能返回全文

`/api/markdown` 应只返回列表字段：
- slug
- title
- date
- summary
- excerpt
- series
- type
- pinned

不要把 `content` 一起返回给首页列表。

### 3. 首页优先服务端首屏渲染

避免首页先空转再客户端二次请求全文列表。

---

## 六、服务运维命令

### 查看服务状态
```bash
pm2 list
pm2 show markdownShow
```

### 查看日志
```bash
pm2 logs markdownShow --lines 100
```

### 重启服务
```bash
pm2 restart markdownShow
```

---

## 七、什么时候需要重启服务

### 需要重启的情况
- 改了 `app/`、`components/`、`lib/` 里的代码
- 改了接口逻辑
- 改了首页展示逻辑
- 切换运行模式（dev/start）

### 一般不需要重启的情况
- 只是新增 Markdown 文件
- 只是修改文章正文
- 只是更新栏目索引文件

---

## 八、每周巡检建议

每周至少看一次：

### 检查项
- `pm2 list` 是否在线
- `markdownShow` 重启次数是否异常上涨
- 首页是否能快速打开
- `/api/markdown` 是否正常返回
- 栏目索引是否是最新一期
- 模板文件是否混入正式内容区

### 快速检查命令
```bash
pm2 show markdownShow
curl -s http://127.0.0.1:3010/api/markdown | head
curl -s -X POST http://127.0.0.1:3010/api/markdown/rebuild-index
```

---

## 九、常见故障与处理

### 问题 1：首页打开很卡
优先检查：
1. 是否还在跑 `run dev`
2. `/api/markdown` 是否返回了全文 content
3. 首页是否退回成客户端二次 fetch

### 问题 2：Index 内容不对
检查：
1. 文章 frontmatter 是否正确
2. 模板是否被误识别为正式文章
3. 是否执行了重建 Index

### 问题 3：列表里出现模板文件
检查模板 frontmatter 是否为：
- `series: github-ai-frontend-trending-template`
- `type: template`

### 问题 4：日期显示成英文长字符串
说明日期解析层出了问题，应该统一回 `YYYY-MM-DD`。

---

## 十、推荐维护习惯

最简单稳定的习惯就是：

1. 新内容只写到固定目录
2. 每篇文章补好 frontmatter
3. 更新完后重建 Index
4. 改代码后再重启服务
5. 线上尽量跑生产模式

---

## 十一、当前已知待办

当前最重要的后续工作：

- 将 PM2 从 `npm run dev` 切换到生产模式：
  - `npm run build`
  - `npm run start`

这是当前影响首页冷启动性能的最大问题。
