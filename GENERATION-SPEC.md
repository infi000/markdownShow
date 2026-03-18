# GitHub AI Frontend Trending 生成规范

这个文档定义：当老板说“生成今天的 GitHub 简报”时，应该如何稳定执行。

---

## 一句话触发词

以下表达都视为同类任务：

- 生成今天的 GitHub 简报
- 生成一期 GitHub AI 前端趋势
- 做一版 GitHub 热门 AI 前端项目汇总
- 再来一版前端开发者视角

---

## 标准输出物（按顺序）

每次正式生成，默认产出 3 个文件：

1. **标准简报**
   - `GitHub-AI-Frontend-Trending-YYYY-MM-DD.md`

2. **前端开发者视角版**
   - `GitHub-AI-Frontend-Trending-YYYY-MM-DD-Frontend-Dev-View.md`

3. **栏目索引更新**
   - `GitHub-AI-Frontend-Trending-Index.md`

默认目录：
`/home/admin/webroot/markdownShow/public/markdown`

---

## 生成顺序

### Step 1：采集数据
优先收集以下方向的 GitHub 热门项目：

- AI 前端 / Agent UI
- AI 组件库 / UI 框架
- AI 网站生成器 / Builder
- Copilot / IDE 扩展
- 与前端工程工作流高度相关的 AI 产品

### Step 2：输出标准简报
基于 `GitHub-AI-Frontend-Trending-TEMPLATE.md` 生成。

必须包含：
- 本期导读
- 核心发现
- 必看项目精选
- 分类整理
- 技术栈热度观察
- 推荐学习路径
- 适合马上关注的项目

### Step 3：输出前端开发者视角版
基于 `GitHub-AI-Frontend-Trending-Frontend-Dev-View-TEMPLATE.md` 生成。

必须包含：
- 最值得关注的 5 个项目
- 值得抄的产品形态
- 值得抄的技术实现
- 最值得投入的能力
- 适合立即开做的项目路线
- 最后一条判断

### Step 4：更新索引
生成完两篇文章后，调用索引重建能力，更新：
- `GitHub-AI-Frontend-Trending-Index.md`

---

## frontmatter 约束

每篇正式文章必须带：

```yaml
---
title: 标题
date: YYYY-MM-DD
series: github-ai-frontend-trending
type: briefing | deep-dive | index
pinned: 数字
summary: 30-50 字摘要
---
```

### 推荐 pinned

- `1`：最新标准简报
- `2`：最新前端开发者视角版
- `3`：索引
- `10+`：历史简报
- `50+`：模板文件

---

## 质量标准

生成内容时，必须满足：

1. **不是简单堆项目列表**
   - 要有判断、趋势、归类

2. **站在前端开发者视角**
   - 重点说清楚：哪些值得学、值得抄、值得做

3. **栏目化表达**
   - 标题、导读、摘要、结构必须统一

4. **默认适配 markdownShow 展示**
   - 不依赖额外渲染器
   - Markdown 结构清晰

---

## 生成后的动作

完成一轮生成后，默认执行：

1. 写入正确目录
2. 更新索引
3. 如有展示逻辑改动，再重启服务：
   ```bash
   pm2 restart markdownShow
   ```

如果只是新增 Markdown 文件，通常不需要改代码。

---

## 推荐执行口令（给 AI）

### 简版

> 生成今天的 GitHub AI Frontend Trending：产出标准简报 + 前端开发者视角版，写入 `/home/admin/webroot/markdownShow/public/markdown`，补齐 frontmatter，并更新 Index。

### 完整版

> 基于最新 GitHub 热门 AI 前端相关项目，生成一份正式栏目内容。输出 1）标准简报 2）前端开发者视角版 3）更新后的 Index。默认目录 `/home/admin/webroot/markdownShow/public/markdown`。所有文件必须使用统一模板，包含 title/date/series/type/pinned/summary frontmatter，日期统一为 YYYY-MM-DD。
