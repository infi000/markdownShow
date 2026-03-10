import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getMarkdownFileBySlug, getAllMarkdownFiles } from '@/lib/markdown'
import MarkdownRenderer from '@/components/MarkdownRenderer'
import TableOfContents from '@/components/TableOfContents'

export const dynamic = 'force-dynamic'

export async function generateStaticParams() {
  const files = getAllMarkdownFiles()
  return files.map((file) => ({
    slug: file.slug,
  }))
}

export default async function MarkdownPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const file = getMarkdownFileBySlug(slug)

  if (!file) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* 返回按钮 */}
        <Link
          href="/"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6 transition"
        >
          ← 返回列表
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* 主内容区 */}
          <div className="lg:col-span-3">
            <article className="bg-white rounded-lg shadow-lg p-8 md:p-12">
              {/* 文章头部 */}
              <header className="mb-8 pb-6 border-b">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  {file.title}
                </h1>
                {file.date && (
                  <p className="text-gray-500">📅 发布时间: {file.date}</p>
                )}
              </header>

              {/* Markdown 内容 */}
              <MarkdownRenderer content={file.content} />
            </article>
          </div>

          {/* 侧边栏 - 目录 */}
          <aside className="hidden lg:block">
            <TableOfContents content={file.content} />
          </aside>
        </div>
      </div>
    </div>
  )
}
