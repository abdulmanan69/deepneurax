import { servicesData } from '@/lib/data/index'
import ServiceDetailClient from './ServiceDetailClient'

export async function generateStaticParams() {
  return servicesData.map((s) => ({ slug: s.slug }))
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return <ServiceDetailClient slug={slug} />
}
