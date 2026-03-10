# Markdown 文档服务

一个基于 Next.js 的 Markdown 文档渲染服务，支持热更新、代码高亮、目录导航和全文搜索。

## 功能特性

- ✅ **热更新支持** - 添加新的 markdown 文件后，刷新页面即可看到
- ✅ **代码语法高亮** - 使用 highlight.js 提供代码高亮
- ✅ **目录导航** - 自动生成文章目录，支持点击跳转
- ✅ **全文搜索** - 支持搜索文档标题和内容
- ✅ **移动端友好** - 响应式设计，适配各种屏幕尺寸
- ✅ **Front Matter 支持** - 支持在 markdown 文件中添加元数据

## 快速开始

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000 查看效果。

### 添加文档

将 `.md` 文件放入 `public/markdown` 目录即可。

#### 文件格式示例

```markdown
---
title: 文档标题
date: 2024-03-10
---

# 标题

这是文档内容...
```

## 项目结构

```
.
├── app/
│   ├── api/
│   │   └── markdown/          # API 路由
│   ├── markdown/
│   │   └── [slug]/           # 动态路由 - 文档详情页
│   ├── globals.css           # 全局样式
│   ├── layout.tsx            # 根布局
│   └── page.tsx              # 首页 - 文档列表
├── components/
│   ├── MarkdownRenderer.tsx  # Markdown 渲染组件
│   └── TableOfContents.tsx   # 目录导航组件
├── lib/
│   └── markdown.ts           # Markdown 文件处理工具
├── public/
│   └── markdown/             # 存放 markdown 文件
└── package.json
```

## 技术栈

- **Next.js 15** - React 全栈框架
- **TypeScript** - 类型安全
- **Tailwind CSS** - 样式框架
- **react-markdown** - Markdown 渲染
- **remark-gfm** - GitHub Flavored Markdown 支持
- **rehype-highlight** - 代码语法高亮
- **gray-matter** - Front Matter 解析

## 使用说明

### 搜索功能

在首页搜索框中输入关键词，可以搜索文档标题和内容。

### 刷新文档列表

点击首页的"刷新"按钮，可以重新加载文档列表，查看新添加的文档。

### 目录导航

在文档详情页右侧（桌面端）会显示文章目录，点击可快速跳转到对应章节。

## 部署

### 构建生产版本

```bash
npm run build
npm start
```

### 部署到 Vercel

```bash
npm install -g vercel
vercel
```

## 自定义

### 修改样式

编辑 `app/globals.css` 中的 `.markdown-body` 样式类。

### 修改代码高亮主题

在 `components/MarkdownRenderer.tsx` 中修改导入的 highlight.js 主题：

```typescript
import 'highlight.js/styles/github-dark.css'  // 更换为其他主题
```

可用主题：`github`, `github-dark`, `monokai`, `atom-one-dark` 等。

## 注意事项

- markdown 文件必须使用 UTF-8 编码
- 文件名将作为 URL slug，建议使用英文和连字符
- 支持的 markdown 扩展：表格、任务列表、删除线等（GFM）

## License

MIT
