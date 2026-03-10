'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { MarkdownFile } from '@/lib/markdown'

export default function Home() {
  const [files, setFiles] = useState<MarkdownFile[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFiles()
  }, [])

  const fetchFiles = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/markdown')
      const data = await response.json()
      setFiles(data)
    } catch (error) {
      console.error('获取文件列表失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      fetchFiles()
      return
    }

    try {
      const response = await fetch(`/api/markdown/search?q=${encodeURIComponent(searchQuery)}`)
      const data = await response.json()
      setFiles(data)
    } catch (error) {
      console.error('搜索失败:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* 头部 */}
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">📚 Markdown 文档库</h1>
          <p className="text-gray-600">支持热更新的文档渲染服务</p>
        </header>

        {/* 搜索栏 */}
        <div className="mb-8 flex gap-2">
          <input
            type="text"
            placeholder="搜索文档标题或内容..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSearch}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            搜索
          </button>
          <button
            onClick={fetchFiles}
            className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
          >
            刷新
          </button>
        </div>

        {/* 文件列表 */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">加载中...</p>
          </div>
        ) : files.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-600 text-lg">暂无文档</p>
            <p className="text-gray-500 mt-2">请在 public/markdown 目录下添加 .md 文件</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {files.map((file) => (
              <Link
                key={file.slug}
                href={`/markdown/${file.slug}`}
                className="block bg-white rounded-lg shadow hover:shadow-lg transition p-6 border border-gray-200 hover:border-blue-400"
              >
                <h2 className="text-xl font-semibold text-gray-800 mb-2 line-clamp-2">
                  {file.title}
                </h2>
                {file.date && (
                  <p className="text-sm text-gray-500 mb-3">📅 {file.date}</p>
                )}
                <p className="text-gray-600 text-sm line-clamp-3">{file.excerpt}</p>
                <div className="mt-4 text-blue-600 text-sm font-medium">
                  阅读更多 →
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
