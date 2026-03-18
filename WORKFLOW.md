# GitHub AI Frontend Trending 内容生产流程

## 默认输出目录

所有与 markdownShow 展示相关的文章，默认写入：

`/home/admin/webroot/markdownShow/public/markdown`

除非老板明确指定其他目录，否则一律使用这个路径。

---

## 栏目结构

当前栏目由以下内容组成：

1. **标准简报**
   - 文件命名：`GitHub-AI-Frontend-Trending-YYYY-MM-DD.md`
   - 模板：`GitHub-AI-Frontend-Trending-TEMPLATE.md`

2. **前端开发者视角版**
   - 文件命名：`GitHub-AI-Frontend-Trending-YYYY-MM-DD-Frontend-Dev-View.md`
   - 模板：`GitHub-AI-Frontend-Trending-Frontend-Dev-View-TEMPLATE.md`

3. **栏目索引**
   - 文件命名：`GitHub-AI-Frontend-Trending-Index.md`

---

## frontmatter 标准

每篇文章优先补齐：

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

### 字段说明

- `title`: 用于列表页和详情页展示
- `date`: 统一使用 `YYYY-MM-DD`
- `series`: 固定为 `github-ai-frontend-trending`
- `type`: 
  - `briefing` = 标准简报
  - `deep-dive` = 深度解读 / 前端开发者视角版
  - `index` = 栏目索引
- `pinned`: 数字越小越靠前
- `summary`: 首页卡片摘要优先读取这个字段

---

## 推荐 pinned 规则

- `1`: 最新标准简报
- `2`: 对应的前端开发者视角版
- `3`: 栏目索引
- `10+`: 历史期数
- `50+`: 模板文件或非正式内容

---

## 每次生成简报的执行步骤

### A. 生成标准简报

1. 收集 GitHub 热门 AI 前端相关项目
2. 按栏目结构输出内容：
   - 本期导读
   - 核心发现
   - 必看项目精选
   - 分类整理
   - 技术栈热度观察
   - 推荐学习路径
3. 写入：
   - `/home/admin/webroot/markdownShow/public/markdown/GitHub-AI-Frontend-Trending-YYYY-MM-DD.md`

### B. 生成前端开发者视角版

1. 基于当期标准简报提炼结论
2. 增加：
   - 最值得关注的 5 个项目
   - 值得抄的产品形态
   - 值得抄的技术实现
   - 能力投入建议
   - 可立即开做的项目路线
3. 写入：
   - `/home/admin/webroot/markdownShow/public/markdown/GitHub-AI-Frontend-Trending-YYYY-MM-DD-Frontend-Dev-View.md`

### C. 更新索引

确保 `GitHub-AI-Frontend-Trending-Index.md` 包含：
- 最新一期入口
- 历史期数列表
- 推荐阅读顺序

---

## 展示站说明

- 项目路径：`/home/admin/webroot/markdownShow`
- PM2 服务名：`markdownShow`
- 首页已做专题化展示，支持：
  - 专题置顶
  - 历史归档
  - 搜索
  - 自动读取 Markdown 静态文件

修改展示逻辑后，如需生效：

```bash
pm2 restart markdownShow
```

---

## 注意事项

1. **不要再写错目录**
   - 默认目录就是 `/home/admin/webroot/markdownShow/public/markdown`

2. **优先补 frontmatter**
   - 否则首页排序、摘要、专题识别会退化

3. **日期一律统一格式**
   - 只用 `YYYY-MM-DD`

4. **模板不要删**
   - 后续批量生产内容会直接复用
