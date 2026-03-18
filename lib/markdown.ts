import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

export interface MarkdownFile {
  slug: string
  title: string
  date?: string
  content?: string
  excerpt?: string
  summary?: string
  series?: string
  type?: string
  pinned?: number
}

const markdownDirectory = path.join(process.cwd(), 'public/markdown')

export function ensureMarkdownDirectory() {
  if (!fs.existsSync(markdownDirectory)) {
    fs.mkdirSync(markdownDirectory, { recursive: true })
  }
}

function extractTitle(content: string, fallback: string) {
  const match = content.match(/^#\s+(.+)$/m)
  return match?.[1]?.trim() || fallback
}

function normalizeDate(input: string) {
  const match = input.match(/(\d{4}-\d{2}-\d{2})/)
  return match?.[1] || input
}

function extractDate(data: Record<string, unknown>, raw: string) {
  if (data.date instanceof Date) {
    return data.date.toISOString().slice(0, 10)
  }

  if (data.date) return normalizeDate(String(data.date))

  const updateMatch = raw.match(/更新日期[:：]\s*(\d{4}-\d{2}-\d{2})/)
  if (updateMatch) return updateMatch[1]

  const filenameMatch = raw.match(/(\d{4}-\d{2}-\d{2})/)
  return filenameMatch?.[1] || ''
}

function stripMarkdown(content: string) {
  return content
    .replace(/^#.*$/gm, '')
    .replace(/^>.*$/gm, '')
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[>*_~#-]/g, ' ')
    .replace(/\n+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function extractExcerpt(content: string, summary?: string) {
  if (summary?.trim()) return summary.trim()
  const plain = stripMarkdown(content)
  if (!plain) return '暂无摘要'
  return plain.slice(0, 140) + (plain.length > 140 ? '...' : '')
}

function parseMarkdownFile(fileName: string, includeContent = true): MarkdownFile {
  const slug = fileName.replace(/\.md$/, '')
  const fullPath = path.join(markdownDirectory, fileName)
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(fileContents)

  const summary = data.summary ? String(data.summary) : ''
  const pinnedRaw = data.pinned ? Number(data.pinned) : undefined

  return {
    slug,
    title: extractTitle(content, String(data.title || slug)),
    date: extractDate(data as Record<string, unknown>, `${fileName}\n${content}`),
    content: includeContent ? content : undefined,
    summary,
    excerpt: extractExcerpt(content, summary),
    series: data.series ? String(data.series) : '',
    type: data.type ? String(data.type) : '',
    pinned: Number.isFinite(pinnedRaw) ? pinnedRaw : undefined,
  }
}

function sortMarkdownFiles(files: MarkdownFile[]) {
  return files.sort((a, b) => {
    const pinnedA = a.pinned ?? Number.MAX_SAFE_INTEGER
    const pinnedB = b.pinned ?? Number.MAX_SAFE_INTEGER
    if (pinnedA !== pinnedB) return pinnedA - pinnedB

    if (a.date && b.date) {
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    }
    if (a.date) return -1
    if (b.date) return 1
    return a.title.localeCompare(b.title, 'zh-CN')
  })
}

export function getAllMarkdownFiles(includeContent = true): MarkdownFile[] {
  ensureMarkdownDirectory()

  const fileNames = fs.readdirSync(markdownDirectory)
  const markdownFiles = fileNames.filter(name => name.endsWith('.md'))
  const files = markdownFiles.map(fileName => parseMarkdownFile(fileName, includeContent))

  return sortMarkdownFiles(files)
}

export function getMarkdownListFiles(): MarkdownFile[] {
  return getAllMarkdownFiles(false)
}

export function getMarkdownFileBySlug(slug: string): MarkdownFile | null {
  ensureMarkdownDirectory()

  try {
    return parseMarkdownFile(`${slug}.md`, true)
  } catch (error) {
    return null
  }
}

export function searchMarkdownFiles(query: string, includeContent = false): MarkdownFile[] {
  const allFiles = getAllMarkdownFiles(includeContent)
  const lowerQuery = query.toLowerCase()

  return allFiles.filter(file =>
    file.title.toLowerCase().includes(lowerQuery) ||
    (file.summary || '').toLowerCase().includes(lowerQuery) ||
    (file.excerpt || '').toLowerCase().includes(lowerQuery) ||
    (includeContent && (file.content || '').toLowerCase().includes(lowerQuery))
  )
}
