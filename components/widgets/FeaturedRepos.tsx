import { SiGithub, SiForgejo } from "react-icons/si"
import { TbStar, TbGitBranch } from "react-icons/tb"
import Link from "next/link"
import { cn } from "@/lib/utils"
import type { FeaturedProject } from "@/lib/github"

interface FeaturedReposProps {
  projects: FeaturedProject[]
  className?: string
}

export default function FeaturedRepos({ projects, className }: FeaturedReposProps) {
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 gap-4", className)}>
      {projects.map((project) => (
        <div key={project.id} className="bg-gray-800 p-6 rounded-lg shadow-md min-h-[200px] flex flex-col">
          <div className="flex-1">
            <h3 className="flex items-center justify-center text-xl font-bold text-gray-100 mb-3">
              {project.platform === 'github' ? <SiGithub className="mr-2" /> : <SiForgejo className="mr-2" />} {project.name}
            </h3>
            <p className="text-gray-300 grow">{project.description}</p>
          </div>
          <div className="pt-4 border-t border-gray-700 flex justify-between items-center mt-auto">
            <Link href={project.url} className="text-blue-400 hover:underline">View Repo</Link>
            <div className="flex items-center text-gray-400">
              <TbStar className="mr-1 size-5" /> {project.stars}
              <TbGitBranch className="ml-4 mr-1 size-5" /> {project.forks}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}