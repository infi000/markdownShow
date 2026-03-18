import HomePageClient from '@/components/HomePageClient'
import { getMarkdownListFiles } from '@/lib/markdown'

export const dynamic = 'force-dynamic'

export default function Home() {
  const files = getMarkdownListFiles()
  return <HomePageClient initialFiles={files} />
}
