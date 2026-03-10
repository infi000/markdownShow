import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Markdown 文档服务',
  description: '支持热更新的 Markdown 文档渲染服务',
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
