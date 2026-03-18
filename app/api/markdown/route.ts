import { NextResponse } from 'next/server'
import { getMarkdownListFiles } from '@/lib/markdown'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const files = getMarkdownListFiles()
    return NextResponse.json(files)
  } catch (error) {
    return NextResponse.json({ error: '获取文件失败' }, { status: 500 })
  }
}
