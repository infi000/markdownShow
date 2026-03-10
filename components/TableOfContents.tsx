'use client'

import { useEffect, useState } from 'react'

interface TocItem {
  id: string
  text: string
  level: number
}

export default function TableOfContents({ content }: { content: string }) {
  const [toc, setToc] = useState<TocItem[]>([])
  const [activeId, setActiveId] = useState<string>('')

  useEffect(() => {
    // 解析标题生成目录
    const headings = content.match(/^#{1,3}\s+.+$/gm) || []
    const tocItems = headings.map((heading, index) => {
      const level = heading.match(/^#+/)?.[0].length || 1
      const text = heading.replace(/^#+\s+/, '')
      const id = `heading-${index}`
      return { id, text, level }
    })
    setToc(tocItems)

    // 监听滚动
    const handleScroll = () => {
      const headingElements = document.querySelectorAll('h1, h2, h3')
      let currentId = ''

      headingElements.forEach((element) => {
        const rect = element.getBoundingClientRect()
        if (rect.top <= 100) {
          currentId = element.id
        }
      })

      setActiveId(currentId)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [content])

  if (toc.length === 0) return null

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <div className="sticky top-8 bg-white rounded-lg shadow p-6 max-h-[calc(100vh-4rem)] overflow-y-auto">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">📑 目录</h3>
      <nav>
        <ul className="space-y-2">
          {toc.map((item) => (
            <li
              key={item.id}
              style={{ paddingLeft: `${(item.level - 1) * 1}rem` }}
            >
              <button
                onClick={() => scrollToHeading(item.id)}
                className={`text-left w-full text-sm hover:text-blue-600 transition ${
                  activeId === item.id
                    ? 'text-blue-600 font-semibold'
                    : 'text-gray-600'
                }`}
              >
                {item.text}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}
