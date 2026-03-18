'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import type { MarkdownFile } from '@/lib/markdown'

const FEATURED_PREFIX = 'GitHub-AI-Frontend-Trending'
const TEMPLATE_SERIES = 'github-ai-frontend-trending-template'

function isTemplateFile(file: MarkdownFile) {
  return file.type === 'template' || file.series === TEMPLATE_SERIES || file.slug.includes('TEMPLATE')
}

function getSeriesTypeLabel(slug: string) {
  if (slug.endsWith('Index')) return '栏目索引'
  if (slug.includes('Frontend-Dev-View')) return '深度解读'
  return '趋势简报'
}

function getSeriesOrder(slug: string) {
  if (slug.endsWith('Index')) return 3
  if (slug.includes('Frontend-Dev-View')) return 2
  if (/\d{4}-\d{2}-\d{2}$/.test(slug)) return 1
  return 99
}

export default function HomePageClient({ initialFiles }: { initialFiles: MarkdownFile[] }) {
  const [files, setFiles] = useState<MarkdownFile[]>(initialFiles)
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [rebuildingIndex, setRebuildingIndex] = useState(false)
  const [rebuildMessage, setRebuildMessage] = useState('')

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

    setLoading(true)
    try {
      const response = await fetch(`/api/markdown/search?q=${encodeURIComponent(searchQuery)}`)
      const data = await response.json()
      setFiles(data)
    } catch (error) {
      console.error('搜索失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRebuildIndex = async () => {
    setRebuildingIndex(true)
    setRebuildMessage('正在重建 Index...')

    try {
      const response = await fetch('/api/markdown/rebuild-index', { method: 'POST' })
      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data?.error || '重建失败')
      }

      await fetchFiles()
      setRebuildMessage(`Index 已更新：简报 ${data.counts?.briefings ?? 0} 篇，深度解读 ${data.counts?.deepDives ?? 0} 篇。`)
    } catch (error) {
      console.error('重建 Index 失败:', error)
      setRebuildMessage('Index 重建失败，请稍后重试。')
    } finally {
      setRebuildingIndex(false)
    }
  }

  const {
    featuredFiles,
    archiveFiles,
    otherFiles,
    latestFile,
    frontendViewFile,
    indexFile,
  } = useMemo(() => {
    const filteredFiles = files.filter(file => !isTemplateFile(file))
    const githubSeries = filteredFiles
      .filter(file => file.slug.startsWith(FEATURED_PREFIX))
      .sort((a, b) => {
        const orderDiff = getSeriesOrder(a.slug) - getSeriesOrder(b.slug)
        if (orderDiff !== 0) return orderDiff
        return (b.date || '').localeCompare(a.date || '')
      })

    const latest = githubSeries.find(file => /\d{4}-\d{2}-\d{2}$/.test(file.slug))
    const frontendView = githubSeries.find(file => file.slug.includes('Frontend-Dev-View'))
    const index = githubSeries.find(file => file.slug.endsWith('Index'))
    const archive = githubSeries.filter(file => !file.slug.endsWith('Index') && !file.slug.includes('Frontend-Dev-View'))
    const others = filteredFiles.filter(file => !file.slug.startsWith(FEATURED_PREFIX))

    return {
      featuredFiles: githubSeries,
      archiveFiles: archive,
      otherFiles: others,
      latestFile: latest,
      frontendViewFile: frontendView,
      indexFile: index,
    }
  }, [files])

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 text-slate-900">
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <header className="mb-10 rounded-3xl bg-slate-900 text-white p-8 md:p-12 shadow-2xl">
          <div className="max-w-4xl">
            <div className="inline-flex items-center rounded-full bg-white/10 px-4 py-1 text-sm mb-4">
              GitHub AI Frontend Trending
            </div>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
              AI 前端趋势简报中心
            </h1>
            <p className="text-slate-300 text-lg leading-8 mb-6">
              这里集中展示 GitHub 上与 AI 前端、Agent UI、组件库、网站生成器、Copilot 扩展相关的趋势简报与深度解读。
            </p>

            <div className="flex flex-wrap gap-3">
              {latestFile && (
                <Link
                  href={`/markdown/${latestFile.slug}`}
                  className="rounded-xl bg-blue-500 px-5 py-3 text-sm font-semibold hover:bg-blue-400 transition"
                >
                  阅读最新一期
                </Link>
              )}
              {frontendViewFile && (
                <Link
                  href={`/markdown/${frontendViewFile.slug}`}
                  className="rounded-xl border border-white/20 px-5 py-3 text-sm font-semibold hover:bg-white/10 transition"
                >
                  看前端视角版
                </Link>
              )}
              {indexFile && (
                <Link
                  href={`/markdown/${indexFile.slug}`}
                  className="rounded-xl border border-white/20 px-5 py-3 text-sm font-semibold hover:bg-white/10 transition"
                >
                  查看栏目索引
                </Link>
              )}
            </div>
          </div>
        </header>

        <section className="grid gap-6 md:grid-cols-3 mb-10">
          <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200">
            <div className="text-sm text-slate-500 mb-2">最新栏目</div>
            <div className="text-2xl font-bold">{latestFile?.date || '—'}</div>
            <div className="text-slate-600 mt-2">最近更新的一期 GitHub AI 前端趋势简报</div>
          </div>
          <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200">
            <div className="text-sm text-slate-500 mb-2">专题文章数</div>
            <div className="text-2xl font-bold">{featuredFiles.length}</div>
            <div className="text-slate-600 mt-2">含索引、标准简报与前端开发者视角解读</div>
          </div>
          <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200">
            <div className="text-sm text-slate-500 mb-2">历史期数</div>
            <div className="text-2xl font-bold">{archiveFiles.length}</div>
            <div className="text-slate-600 mt-2">已自动归档，可持续扩展成长期系列</div>
          </div>
        </section>

        <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">🛠️ 后台操作</h2>
              <p className="text-sm text-slate-600 mt-1">当你新增或调整栏目文章后，可以在这里一键重建 Index。</p>
            </div>
            <button
              onClick={handleRebuildIndex}
              disabled={rebuildingIndex}
              className="rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-700 transition disabled:cursor-not-allowed disabled:opacity-60"
            >
              {rebuildingIndex ? '重建中...' : '重建 Index'}
            </button>
          </div>
          {rebuildMessage && (
            <div className="mt-4 rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-700 border border-slate-200">
              {rebuildMessage}
            </div>
          )}
        </section>

        <div className="mb-8 flex gap-2">
          <input
            type="text"
            placeholder="搜索文档标题或内容..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="flex-1 px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSearch}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
          >
            搜索
          </button>
          <button
            onClick={fetchFiles}
            className="px-6 py-3 bg-slate-700 text-white rounded-xl hover:bg-slate-800 transition"
          >
            刷新
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-slate-600">加载中...</p>
          </div>
        ) : files.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl shadow border border-slate-200">
            <p className="text-slate-600 text-lg">暂无文档</p>
            <p className="text-slate-500 mt-2">请在 public/markdown 目录下添加 .md 文件</p>
          </div>
        ) : (
          <div className="space-y-10">
            {featuredFiles.length > 0 && (
              <section>
                <div className="flex items-end justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold">🔥 GitHub AI Frontend Trending 专题</h2>
                    <p className="text-slate-600 mt-1">首页主入口已按“最新简报 → 深度解读 → 栏目索引 → 历史期数”排序。</p>
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {featuredFiles.map((file) => (
                    <Link
                      key={file.slug}
                      href={`/markdown/${file.slug}`}
                      className="block rounded-2xl bg-white shadow-sm hover:shadow-lg transition p-6 border border-slate-200 hover:border-blue-400"
                    >
                      <div className="flex items-center justify-between gap-3 mb-3">
                        <span className="text-xs text-blue-600 font-semibold">{getSeriesTypeLabel(file.slug)}</span>
                        {file.date && <span className="text-xs text-slate-400">{file.date}</span>}
                      </div>
                      <h3 className="text-xl font-semibold text-slate-800 mb-2 line-clamp-2">{file.title}</h3>
                      <p className="text-slate-600 text-sm line-clamp-4">{file.excerpt}</p>
                      <div className="mt-4 text-blue-600 text-sm font-medium">阅读更多 →</div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {archiveFiles.length > 0 && (
              <section className="rounded-3xl bg-white border border-slate-200 shadow-sm p-6 md:p-8">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold">🗄️ 历史归档</h2>
                  <p className="text-slate-600 mt-1">按时间倒序查看往期 GitHub AI 前端趋势简报。</p>
                </div>
                <div className="space-y-4">
                  {archiveFiles.map((file) => (
                    <Link
                      key={file.slug}
                      href={`/markdown/${file.slug}`}
                      className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 rounded-2xl border border-slate-200 px-5 py-4 hover:border-blue-400 hover:bg-slate-50 transition"
                    >
                      <div>
                        <div className="text-sm text-slate-500 mb-1">{file.date || '未标注日期'}</div>
                        <div className="font-semibold text-slate-800">{file.title}</div>
                        <div className="text-sm text-slate-600 mt-1 line-clamp-2">{file.excerpt}</div>
                      </div>
                      <div className="text-blue-600 text-sm font-medium whitespace-nowrap">进入阅读 →</div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {otherFiles.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold mb-4">📚 其他 Markdown 文档</h2>
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {otherFiles.map((file) => (
                    <Link
                      key={file.slug}
                      href={`/markdown/${file.slug}`}
                      className="block bg-white rounded-2xl shadow-sm hover:shadow-lg transition p-6 border border-slate-200 hover:border-blue-400"
                    >
                      <h3 className="text-xl font-semibold text-slate-800 mb-2 line-clamp-2">{file.title}</h3>
                      {file.date && <p className="text-sm text-slate-500 mb-3">📅 {file.date}</p>}
                      <p className="text-slate-600 text-sm line-clamp-3">{file.excerpt}</p>
                      <div className="mt-4 text-blue-600 text-sm font-medium">阅读更多 →</div>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
