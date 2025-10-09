import { notFound } from 'next/navigation'
import DomainTimeline from '@/components/domains/DomainTimeline'
import DomainDetails from '@/components/domains/DomainDetails'
import { ArrowLeft, Globe } from 'lucide-react'
import Link from 'next/link'
import { domains } from '@/lib/domains/data'

export async function generateStaticParams() {
  return domains.map((domain) => ({
    domain: domain.domain,
  }))
}

export default async function DomainPage({ params }: { params: Promise<{ domain: string }> }) {
  const { domain: domainParam } = await params
  const domain = domains.find(d => d.domain === domainParam)

  if (!domain) {
    notFound()
  }

  return (
    <div className="grow container mx-auto px-4 py-12">
      <div className="max-w-5xl mx-auto">
        <Link href="/domains" className="inline-flex items-center gap-2 text-gray-400 hover:text-gray-300 mb-8 transition-colors">
          <ArrowLeft />
          Back to Domains
        </Link>

        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Globe className="w-10 h-10 text-gray-400" />
            <div>
              <h1 className="text-4xl font-bold text-gray-200 glow">
                {domain.domain}
              </h1>
              <p className="text-gray-400 mt-1">{domain.usage}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <DomainDetails domain={domain} />
          <DomainTimeline domain={domain} />
        </div>
      </div>
    </div>
  )
}