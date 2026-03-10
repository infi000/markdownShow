import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

export interface MarkdownFile {
  slug: string
  title: string
  date?: string
  content: string
  excerpt?: string
}

const markdownDirectory = path.join(process.cwd(), 'public/markdown')

// 确保 markdown 目录存在
export function ensureMarkdownDirectory() {
  if (!fs.existsSync(markdownDirectory)) {
    fs.mkdirSync(markdownDirectory, { recursive: true })
  }
}

// 获取所有 markdown 文件
export function getAllMarkdownFiles(): MarkdownFile[] {
  ensureMarkdownDirectory()

  const fileNames = fs.readdirSync(markdownDirectory)
  const markdownFiles = fileNames.filter(name => name.endsWith('.md'))

  const files = markdownFiles.map(fileName => {
    const slug = fileName.replace(/\.md$/, '')
    const fullPath = path.join(markdownDirectory, fileName)
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data, content } = matter(fileContents)

    return {
      slug,
      title: data.title || slug,
      date: data.date ? String(data.date) : '',
      content,
      excerpt: content.slice(0, 150) + '...',
    }
  })

  // 按日期排序（如果有的话）
  return files.sort((a, b) => {
    if (a.date && b.date) {
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    }
    return 0
  })
}

// 根据 slug 获取单个文件
export function getMarkdownFileBySlug(slug: string): MarkdownFile | null {
  ensureMarkdownDirectory()

  try {
    const fullPath = path.join(markdownDirectory, `${slug}.md`)
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data, content } = matter(fileContents)

    return {
      slug,
      title: data.title || slug,
      date: data.date ? String(data.date) : '',
      content,
    }
  } catch (error) {
    return null
  }
}

// 搜索 markdown 文件
export function searchMarkdownFiles(query: string): MarkdownFile[] {
  const allFiles = getAllMarkdownFiles()
  const lowerQuery = query.toLowerCase()

  return allFiles.filter(file =>
    file.title.toLowerCase().includes(lowerQuery) ||
    file.content.toLowerCase().includes(lowerQuery)
  )
}
