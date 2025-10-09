import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Documentation | aidxnCC',
  description:
    'Complete API documentation for aidxnCC services, utilities, types, and theme system.',
}

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="w-full">
      {children}
    </div>
  )
}
