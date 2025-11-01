import { SiGithub, SiForgejo, SiNpm } from 'react-icons/si'
import { TbStar, TbGitBranch, TbWorld } from 'react-icons/tb'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import type { FeaturedProject } from '@/lib/github'

interface FeaturedReposProps {
  projects: FeaturedProject[]
  className?: string
}

export default function FeaturedRepos({
  projects,
  className
}: FeaturedReposProps) {
  return (
    <div className={cn('grid grid-cols-1 gap-4 md:grid-cols-2', className)}>
      {projects.map((project) => {
        // Count the number of links to dynamically adjust text size
        const linkCount = [
          true, // View Repo always present
          project.websiteUrl,
          project.npmPackage
        ].filter(Boolean).length

        // Determine text size based on number of links
        const linkTextSize =
          linkCount === 3
            ? 'text-xs sm:text-sm'
            : linkCount === 2
              ? 'text-sm'
              : 'text-base'

        return (
          <div
            key={project.id}
            className="flex min-h-[200px] flex-col rounded-lg bg-gray-800 p-6 shadow-md"
          >
            <div className="flex-1">
              <h3 className="mb-3 flex items-center justify-center text-xl font-bold text-gray-100">
                {project.platform === 'github' ? (
                  <SiGithub className="mr-2" />
                ) : (
                  <SiForgejo className="mr-2" />
                )}{' '}
                {project.name}
              </h3>
              <p className="grow text-gray-300">{project.description}</p>
            </div>
            <div className="mt-auto border-t border-gray-700 pt-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                {/* Links section */}
                <div
                  className={cn(
                    'flex flex-wrap items-center gap-2 sm:gap-3',
                    linkTextSize
                  )}
                >
                  <Link
                    href={project.url}
                    className="flex items-center gap-1 text-blue-400 hover:underline"
                  >
                    {project.platform === 'github' ? (
                      <SiGithub className="size-4" />
                    ) : (
                      <SiForgejo className="size-4" />
                    )}
                    <span>View Repo</span>
                  </Link>
                  {project.websiteUrl && (
                    <>
                      <span className="text-gray-600">•</span>
                      <Link
                        href={project.websiteUrl}
                        className="flex items-center gap-1 text-blue-400 hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <TbWorld className="size-4" />
                        <span>View Site</span>
                      </Link>
                    </>
                  )}
                  {project.npmPackage && (
                    <>
                      <span className="text-gray-600">•</span>
                      <Link
                        href={`https://www.npmjs.com/package/${project.npmPackage}`}
                        className="flex items-center gap-1 text-blue-400 hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <SiNpm className="size-4" />
                        <span>View on NPM</span>
                      </Link>
                    </>
                  )}
                </div>
                {/* Stats section */}
                <div className="flex items-center text-sm text-gray-400">
                  <TbStar className="mr-1 size-4" /> {project.stars}
                  <TbGitBranch className="mr-1 ml-3 size-4" /> {project.forks}
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
