'use client'

import { useEffect, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'

interface MarkdownRendererProps {
  content: string
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // 动态导入 highlight.js 样式
    import('highlight.js/styles/github-dark.css')

    // 为标题添加 ID，用于目录导航
    if (containerRef.current) {
      const headings = containerRef.current.querySelectorAll('h1, h2, h3')
      headings.forEach((heading, index) => {
        heading.id = `heading-${index}`
      })
    }
  }, [content])

  return (
    <div ref={containerRef} className="markdown-body">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
