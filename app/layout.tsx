import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AI 前端趋势简报中心',
  description: '展示 GitHub AI Frontend Trending 系列 Markdown 简报、索引与前端开发者视角解读。',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  )
}
