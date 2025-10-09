import PageHeader from '@/components/objects/PageHeader'
import { BookOpen } from 'lucide-react'

export default function Manifesto() {
  return (
    <div className="grow container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center">
          <PageHeader
            icon={<BookOpen size={60} />}
            title="Internet Manifesto"
          />
          <div className="px-6 pt-12">
            <h2 className="text-2xl font-semibold mb-4 text-gray-200">
              1. Empathy and Understanding
            </h2>
            <p className="text-gray-300 mb-4">
              We live in a distant world. People I meet are from all over, which can be hard to understand for others. I aim to utilize my ability to connect by understanding and getting interested in people&apos;s lives. I pledge to:
            </p>
            <ul className="list-disc list-outside marker:text-gray-500 pl-6 space-y-2 text-left text-gray-300 mt-8 mb-4">
              <li>Listen deeply and genuinely</li>
              <li>Suspend judgment and seek to understand</li>
              <li>Recognize the humanity in every digital interaction</li>
            </ul>

            <h2 className="text-2xl font-semibold mb-4 mt-12 text-gray-200">
              2. Unconditional Sharing!
            </h2>
            <p className="text-gray-300 mb-4">
              Information should be free and accessible to all. I will:
            </p>
            <ul className="list-disc list-outside marker:text-gray-500 pl-6 space-y-2 text-left text-gray-300 mt-8 mb-4">
              <li>Make all of my work free and accessible to all</li>
              <li>Create and share content for others&apos; benefit</li>
              <li>Support open-source principles</li>
              <li>Create extensive documentation on all of my projects</li>
            </ul>

            <h2 className="text-2xl font-semibold mb-4 mt-12 text-gray-200">
              3. Genuine Human Connection
            </h2>
            <p className="text-gray-300 mb-4">
              I aim to create a genuine human connection with all people I meet, regardless of who or where they are from.
            </p>

            <h2 className="text-2xl font-semibold mb-4 mt-12 text-gray-200">
              4. Privacy & Self-Hosted Services
            </h2>
            <p className="text-gray-300 mb-4">
              In terms of my personal (some public) services, I commit to never selling, viewing or sharing personal information with third parties or myself. I will:
            </p>
            <ul className="list-disc list-outside marker:text-gray-500 pl-6 space-y-2 text-left text-gray-300 mt-8 mb-4">
              <li>Respect user data as a fundamental human right</li>
              <li>Not implement tracking and/or monetization in my services</li>
              <ul className="list-disc list-outside marker:text-gray-400 pl-6 mt-2 text-gray-300">
                <li>I pledge to not implement tracking or systems in which a user can be individualized or categorized</li>
              </ul>
              <li>Ensure user data is never used for profit</li>
              <li>Focus my services on being free and open</li>
              <li>Suggest and support privacy-focused software</li>
            </ul>

            <h2 className="text-2xl font-semibold mb-4 mt-12 text-gray-200">
              I Commit
            </h2>
            <p className="text-gray-300 mb-4">
              I am not perfect, that&apos;s for sure, but I am committed. I promise to continuously learn, grow, and adapt to my environment, goals, purpose, and the people around me.
            </p>
          </div>
        </div>
    </div>
  )
}
