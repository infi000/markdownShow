---
title: Next.js 快速入门指南
date: 2024-03-10
---

# Next.js 快速入门指南

Next.js 是一个基于 React 的全栈框架。

## 安装

```bash
npx create-next-app@latest my-app
cd my-app
npm run dev
```

## 路由系统

Next.js 使用基于文件系统的路由：

- `app/page.tsx` → `/`
- `app/about/page.tsx` → `/about`
- `app/blog/[slug]/page.tsx` → `/blog/:slug`

## API 路由

创建 API 端点：

```typescript
// app/api/hello/route.ts
export async function GET() {
  return Response.json({ message: 'Hello' })
}
```

## 数据获取

### 服务端组件

```typescript
async function getData() {
  const res = await fetch('https://api.example.com/data')
  return res.json()
}

export default async function Page() {
  const data = await getData()
  return <div>{data.title}</div>
}
```

### 客户端组件

```typescript
'use client'

import { useState, useEffect } from 'react'

export default function Page() {
  const [data, setData] = useState(null)

  useEffect(() => {
    fetch('/api/data')
      .then(res => res.json())
      .then(setData)
  }, [])

  return <div>{data?.title}</div>
}
```

## 样式方案

### Tailwind CSS

```tsx
<div className="bg-blue-500 text-white p-4 rounded-lg">
  Hello World
</div>
```

### CSS Modules

```tsx
import styles from './page.module.css'

export default function Page() {
  return <div className={styles.container}>Hello</div>
}
```

## 部署

最简单的部署方式是使用 Vercel：

```bash
npm install -g vercel
vercel
```

## 更多资源

- [官方文档](https://nextjs.org/docs)
- [学习课程](https://nextjs.org/learn)
- [示例项目](https://github.com/vercel/next.js/tree/canary/examples)
