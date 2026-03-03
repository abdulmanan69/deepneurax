import { blogPostsData } from '@/lib/data/index'
import BlogPostClient from './BlogPostClient'

export async function generateStaticParams() {
  return blogPostsData.map((p) => ({ slug: p.slug }))
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return <BlogPostClient slug={slug} />
}
