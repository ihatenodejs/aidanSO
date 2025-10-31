import { SiGithub, SiForgejo } from 'react-icons/si'
import { TbStar, TbGitBranch } from 'react-icons/tb'
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
      {projects.map((project) => (
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
          <div className="mt-auto flex items-center justify-between border-t border-gray-700 pt-4">
            <Link href={project.url} className="text-blue-400 hover:underline">
              View Repo
            </Link>
            <div className="flex items-center text-gray-400">
              <TbStar className="mr-1 size-5" /> {project.stars}
              <TbGitBranch className="mr-1 ml-4 size-5" /> {project.forks}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
