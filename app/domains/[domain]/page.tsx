import { notFound } from 'next/navigation'
import DomainTimeline from '@/components/domains/DomainTimeline'
import DomainDetails from '@/components/domains/DomainDetails'
import PageShell from '@/components/layout/PageShell'
import { ArrowLeft, Globe } from 'lucide-react'
import Link from 'next/link'
import { DomainService } from '@/lib/services'

const domains = DomainService.getAllDomains()

export async function generateStaticParams() {
  return domains.map((domain) => ({
    domain: domain.domain
  }))
}

export default async function DomainPage({
  params
}: {
  params: Promise<{ domain: string }>
}) {
  const { domain: domainParam } = await params
  const domain = domains.find((d) => d.domain === domainParam)

  if (!domain) {
    notFound()
  }

  return (
    <PageShell variant="centered" maxWidth="5xl">
      <Link
        href="/domains"
        className="inline-flex items-center gap-2 text-gray-400 transition-colors hover:text-gray-300"
      >
        <ArrowLeft />
        Back to Domains
      </Link>

      <div className="flex items-center gap-4">
        <Globe className="h-10 w-10 text-gray-400" />
        <div>
          <h1 className="glow text-4xl font-bold text-gray-200">
            {domain.domain}
          </h1>
          <p className="mt-1 text-gray-400">{domain.usage}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <DomainDetails domain={domain} />
        <DomainTimeline domain={domain} />
      </div>
    </PageShell>
  )
}
