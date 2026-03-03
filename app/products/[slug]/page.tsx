import { productsData } from '@/lib/data/index'
import ProductDetailClient from './ProductDetailClient'

export async function generateStaticParams() {
  return productsData.map((p) => ({ slug: p.slug }))
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return <ProductDetailClient slug={slug} />
}
