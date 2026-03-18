import fs from 'fs'
import path from 'path'
import { NextResponse } from 'next/server'
import { getAllMarkdownFiles } from '@/lib/markdown'

export const dynamic = 'force-dynamic'

const markdownDirectory = path.join(process.cwd(), 'public/markdown')
const indexFileName = 'GitHub-AI-Frontend-Trending-Index.md'

export async function POST() {
  try {
    const allFiles = getAllMarkdownFiles()
    const seriesFiles = allFiles.filter(
      file => file.series === 'github-ai-frontend-trending' && file.type !== 'template' && !file.slug.includes('TEMPLATE')
    )

    const briefings = seriesFiles
      .filter(file => file.type === 'briefing')
      .sort((a, b) => (b.date || '').localeCompare(a.date || ''))

    const deepDives = seriesFiles
      .filter(file => file.type === 'deep-dive')
      .sort((a, b) => (b.date || '').localeCompare(a.date || ''))

    const latest = briefings[0]

    const lines: string[] = [
      '---',
      'title: GitHub AI Frontend Trending 简报索引',
      `date: ${latest?.date || new Date().toISOString().slice(0, 10)}`,
      'series: github-ai-frontend-trending',
      'type: index',
      'pinned: 3',
      'summary: GitHub AI Frontend Trending 栏目索引，汇总最新一期、深度解读与历史期数。',
      '---',
      '',
      '# 🗂️ GitHub AI Frontend Trending 简报索引',
      '',
      '> 持续追踪 GitHub 上 AI 前端、Agent UI、组件库、网站生成器与 Copilot 扩展相关热门项目。',
      '',
      '---',
      '',
      '## 最新推荐',
      '',
    ]

    if (latest) {
      lines.push(`- **最新一期：[${latest.date}](./${latest.slug}.md)**`)
      lines.push(`  - ${latest.title}`)
      if (latest.summary) lines.push(`  - ${latest.summary}`)
      lines.push('')
    }

    if (deepDives[0]) {
      lines.push(`- **深度解读：[${deepDives[0].date} 前端开发者视角版](./${deepDives[0].slug}.md)**`)
      lines.push(`  - ${deepDives[0].title}`)
      if (deepDives[0].summary) lines.push(`  - ${deepDives[0].summary}`)
      lines.push('')
    }

    lines.push('## 历史期数', '')
    for (const file of briefings) {
      lines.push(`- **[${file.date}](./${file.slug}.md)**`)
      lines.push(`  - ${file.title}`)
      if (file.summary) lines.push(`  - ${file.summary}`)
    }

    lines.push('', '## 深度解读', '')
    if (deepDives.length === 0) {
      lines.push('- 暂无深度解读')
    } else {
      for (const file of deepDives) {
        lines.push(`- **[${file.date}](./${file.slug}.md)**`)
        lines.push(`  - ${file.title}`)
        if (file.summary) lines.push(`  - ${file.summary}`)
      }
    }

    lines.push(
      '',
      '## 建议阅读顺序',
      '',
      '1. 先看最新一期，快速把握近期热点迁移。',
      '2. 再看对应的前端开发者视角版，提炼可落地判断。',
      '3. 最后回看历史期数，对比项目、技术栈和赛道变化。',
      ''
    )

    fs.writeFileSync(path.join(markdownDirectory, indexFileName), lines.join('\n'), 'utf8')

    return NextResponse.json({
      success: true,
      file: indexFileName,
      latest: latest?.slug || null,
      counts: {
        briefings: briefings.length,
        deepDives: deepDives.length,
      },
    })
  } catch (error) {
    return NextResponse.json({ error: '重建索引失败' }, { status: 500 })
  }
}
