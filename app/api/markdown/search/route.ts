import { NextResponse } from 'next/server'
import { searchMarkdownFiles } from '@/lib/markdown'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q') || ''

    if (!query) {
      return NextResponse.json([])
    }

    const results = searchMarkdownFiles(query, false)
    return NextResponse.json(results)
  } catch (error) {
    return NextResponse.json({ error: '搜索失败' }, { status: 500 })
  }
}
