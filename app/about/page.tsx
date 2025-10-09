import Link from '@/components/objects/Link'
import Button from '@/components/objects/Button'
import FeaturedRepos from '@/components/widgets/FeaturedRepos'
import GitHubStatsImage from '@/components/widgets/GitHubStatsImage'
import PageHeader from '@/components/objects/PageHeader'
import { Card } from '@/components/ui/Card'
import { CardGrid } from '@/components/ui/CardGrid'
import { SiGoogle } from 'react-icons/si'
import { TbUserHeart } from 'react-icons/tb'
import { getFeaturedReposWithMetrics } from '@/lib/github'

const getGitHubUsername = () => {
  return process.env.GITHUB_PROJECTS_USER ?? process.env.GITHUB_USERNAME ?? 'ihatenodejs'
}

interface ContentSection {
  title: string
  content: React.ReactElement
}

export default async function About() {
  const featuredProjects = await getFeaturedReposWithMetrics()
  const githubUsername = getGitHubUsername()

  const sections: ContentSection[] = [
    {
      title: "Projects",
      content: (
        <>
          <p className="text-gray-300 leading-relaxed mt-2">
            I have worked on countless projects over the past five years, for the most part. I started learning to code with Python when I was seven and my interest has only evolved from there. I got into web development due to my uncle, who taught my how to write my first lines of HTML.
          </p>
          <p className="text-gray-300 leading-relaxed mt-2">
            Recently, I have been involved in developing several projects, especially with TypeScript, which is my new favorite language as of a year ago. My biggest project currently is <Link href="https://p0ntus.com/">p0ntus</Link>, a free service provider for privacy-focused individuals.
          </p>
          <p className="text-gray-300 leading-relaxed mt-2">
            You will also come to find that I have an addiction to Docker! Almost every project I&apos;ve made is able to be run in Docker.
          </p>
          <p className="text-gray-300 leading-relaxed mt-2">
            Me and my developer friends operate an organization called <Link href="https://github.com/abocn">ABOCN</Link>, where we primarily maintain a Telegram bot called <Link href="https://github.com/abocn/TelegramBot">Kowalski</Link>. You can find it on Telegram as <Link href="https://t.me/KowalskiNodeBot">@KowalskiNodeBot</Link>.
          </p>
          <p className="text-gray-300 leading-relaxed mt-2">
            I have learned system administration from the past three years of learning Linux for practical use and fun. I currently operate four servers running in the cloud, ran out of Canada, Germany, and the United States.
          </p>
          <p className="text-gray-300 leading-relaxed mt-2">
            I own a channel called <Link href="https://t.me/PontusHub">PontusHub</Link> on Telegram, where I post updates about my projects, along with commentary and info about my projects related to the Android rooting community.
          </p>
        </>
      )
    },
    {
      title: "Hobbies",
      content: (
        <>
          <p className="text-gray-300 leading-relaxed mt-2">
            When I&apos;m not programming, I can typically be found distro hopping or flashing a new ROM to <Link href="/device/cheetah">my phone</Link>. I also spend a lot of time spreading Next.js and TypeScript propaganda to JavaScript developers.
          </p>
          <p className="text-gray-300 leading-relaxed mt-2">
            I consider maintaining my devices as a hobby as well, as I devote a lot of time to it. I genuinely enjoy installing Arch, Gentoo, and NixOS frequently, and flashing new ROMs to the phones I own.
          </p>
          <p className="text-gray-300 leading-relaxed mt-2">
            I am frequently active on <Link href="https://git.p0ntus.com/">my Forgejo server</Link> and GitHub, and aim to make daily contributions. I am a big fan of open source software and public domain software (which most of my repos are licensed under). In fact, the website you&apos;re currently on is free and open source. It&apos;s even under the public domain!
          </p>
          <p className="text-gray-300 leading-relaxed mt-2">
            When I touch grass, I prefer to walk on the streets, especially in Boston, Massachusetts. I also used to swim competitively, though it has turned into to a casual hobby over time.
          </p>
          <p className="text-gray-300 leading-relaxed mt-2">
            Editing Wikipedia has also been a good pastime for me, and I have been editing for a year and a half now. As of writing, I have made 6.1k edits to the English Wikipedia. I am also an <Link href="https://en.wikipedia.org/wiki/Wikipedia:WikiProject_Articles_for_creation">AfC</Link> reviewer, new page reviewer, and rollbacker. You can find me on Wikipedia as <Link href="https://en.wikipedia.org/wiki/User:OnlyNano">OnlyNano</Link>.
          </p>
        </>
      )
    },
    {
      title: "Devices",
      content: (
        <>
          <h3 className="text-xl font-semibold mb-2 text-gray-200">Mobile Devices</h3>
          <p className="text-gray-300 leading-relaxed mt-2">
            I use a Google Pixel 9 Pro XL (komodo) as my daily driver. It runs <Link href="https://developer.android.com/about/versions/16/get">Android 16</Link> and is proudly rooted with <Link href="https://github.com/KernelSU-Next/KernelSU-Next">KernelSU-Next</Link>.
          </p>
          <p className="text-gray-300 leading-relaxed mt-2">
            My previous phone, the Google Pixel 7 Pro (cheetah), is still in use as my secondary WiFi-only device. It runs <Link href="https://developer.android.com/about/versions/16/get">Android 16</Link> and is proudly rooted with <Link href="https://github.com/KernelSU-Next/KernelSU-Next">KernelSU-Next</Link>.
          </p>
          <p className="text-gray-300 leading-relaxed mt-2">
            I also have a Google Pixel 3a XL (bonito) which I use as a tertiary device. It runs <Link href="https://wiki.lineageos.org/devices/bonito/">LineageOS 22.2</Link> and is rooted with Magisk.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
            <Button href="/device/komodo" icon={<SiGoogle />}>
              Pixel 9 Pro XL
            </Button>
            <Button href="/device/cheetah" icon={<SiGoogle />}>
              Pixel 7 Pro
            </Button>
            <Button href="/device/bonito" icon={<SiGoogle />}>
              Pixel 3a XL
            </Button>
          </div>
          <h3 className="text-xl font-semibold mb-2 text-gray-200 mt-4">Laptops</h3>
          <p className="text-gray-300 leading-relaxed mt-2">
            I currently daily-drive with a 16-inch MacBook Pro with an M4 Max, 64GB of memory, 2TB of storage, 16 core CPU, and a 40 core GPU.
          </p>
          <p className="text-gray-300 leading-relaxed mt-2">
            I use a Lenovo Thinkpad T470s with macOS Sequoia (using <Link href="https://github.com/acidanthera/OpenCorePkg">OpenCore</Link>) as my &quot;side piece,&quot; if you will. I&apos;ve had it for about a year now, and it&apos;s been a great experience.
          </p>
          <p className="text-gray-300 leading-relaxed mt-2">
            I also own two MacBook Airs (2015 and 2013 base models) and an HP Chromebook, used as secondary devices. The 2013 runs unsupported macOS Sequoia Beta, the 2015 runs <Link href="https://xubuntu.org/">Xubuntu</Link>, and the Chromebook runs Arch Linux.
          </p>
        </>
      )
    },
    {
      title: "Contributions",
      content: (
        <>
          <p className="text-gray-300 leading-relaxed mt-2">
            Most of my repositories have migrated to <Link href="https://git.p0ntus.com/">p0ntus git</Link>. My username is <Link href="https://git.p0ntus.com/aidan/">aidan</Link>. You can find me on GitHub as <Link href={`https://github.com/${githubUsername}/`}>{githubUsername}</Link>.
          </p>
          <GitHubStatsImage username={githubUsername} />
        </>
      )
    },
    {
      title: "Featured Projects",
      content: (
        <>
          <p className="text-gray-300 leading-relaxed mt-2">
            Here&apos;s just four of my top projects. Star and fork counts are fetched in real-time from both GitHub and Forgejo APIs.
          </p>
          <FeaturedRepos projects={featuredProjects} className="mt-4" />
        </>
      )
    }
  ]

  return (
    <div className="w-full">
      <div className="my-12 text-center">
        <PageHeader
          icon={<TbUserHeart size={60} />}
          title="Get to Know Me"
        />
      </div>

      <CardGrid cols="3">
        {sections.map((section) => (
          <Card
            key={section.title}
            variant="default"
            title={section.title}
            spanCols={section.title === "Featured Projects" ? 2 : undefined}
            className="p-4 sm:p-8"
          >
            {section.content}
          </Card>
        ))}
      </CardGrid>
    </div>
  )
}
