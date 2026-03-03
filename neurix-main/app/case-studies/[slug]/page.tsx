import { caseStudiesData } from '@/lib/data/index'
import CaseStudyDetailClient from './CaseStudyDetailClient'

export async function generateStaticParams() {
  return caseStudiesData.filter((c) => c.isActive).map((c) => ({ slug: c.slug }))
}

export default async function CaseStudyDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return <CaseStudyDetailClient slug={slug} />
}
