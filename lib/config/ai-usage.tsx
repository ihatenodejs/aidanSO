import {
  Claude,
  GithubCopilot,
  Gemini,
  Perplexity,
  OpenAI,
  Qwen,
  ZAI,
  V0,
  Devin,
  XiaomiMiMo,
  Grok
} from '@lobehub/icons'
import type { FavoriteModel, AIReview, AITool } from '@/app/ai/types'
import { aiToolListSchema, isInactiveTool } from '@/app/ai/types'
import OpenCodeIcon from '@/components/icons/OpenCodeIcon'
import AmpIcon from '@/components/icons/AmpIcon'
import CommandCodeIcon from '@/components/icons/CommandCodeIcon'

const rawAiTools = [
  {
    name: 'Amp Free',
    icon: AmpIcon,
    description: 'Free agent with decent output',
    status: 'unused',
    reason: 'Using better, cheap-but-not-free providers',
    link: 'https://ampcode.com/',
    price: 0
  },
  {
    name: 'ChatGPT Pro',
    icon: OpenAI,
    description: 'Budget-friendly with decent ratelimits',
    status: 'primary',
    link: 'https://chatgpt.com/',
    price: 100
  },
  {
    name: 'ChatGPT Business',
    icon: OpenAI,
    description: 'Feature-rich and budget-friendly (for now)',
    status: 'cancelled',
    reason: 'Became too expensive for me, switched to cheaper providers',
    hasUsage: true,
    link: 'https://chatgpt.com/',
    price: 60
  },
  {
    name: 'Claude Max 5x',
    icon: Claude,
    description: 'My favorite model provider for general use and coding',
    status: 'cancelled',
    reason: 'Become too expensive for me, and usage limits were cut',
    usage: '/ai/usage',
    hasUsage: true,
    link: 'https://claude.ai/',
    price: 100,
    discountedPrice: 0
  },
  {
    name: 'Command Code',
    icon: CommandCodeIcon,
    description: 'A top provider',
    status: 'occasional',
    link: 'https://commandcode.ai/',
    price: 1
  },
  {
    name: 'GLM Coding Lite',
    icon: ZAI,
    description: 'Cheap, Claude-like model with good output quality',
    status: 'cancelled',
    reason:
      'Prior quality output and a bad experience in general. I regret cancelling due to improvements made and a recent price hike.',
    link: 'https://z.ai/',
    price: 6,
    discountedPrice: 3
  },
  {
    name: 'Gemini AI Pro',
    icon: Gemini,
    description: 'Agentic coding with Antigravity and basic chat tasks',
    status: 'primary',
    link: 'https://gemini.google.com/',
    price: 19.99,
    discountedPrice: 4.99
  },
  {
    name: 'Qwen Chat/Qwen CLI',
    icon: Qwen,
    description: 'My favorite open source LLM for chatting',
    status: 'unused',
    reason: 'Free usage is no longer included.',
    link: 'https://chat.qwen.ai/',
    price: 0
  },
  {
    name: 'SuperGrok',
    icon: Grok,
    description:
      'Well-priced models for coding. Web Grok is good for doing research on X.',
    status: 'occasional',
    link: 'https://grok.com/',
    price: 30,
    discountedPrice: 20
  },
  {
    name: 'Perplexity Pro',
    icon: Perplexity,
    description: 'Reliable for more in-depth searches.',
    status: 'primary',
    link: 'https://perplexity.ai/',
    price: 20,
    discountedPrice: 0
  },
  {
    name: 'OpenCode Zen/Go',
    icon: OpenCodeIcon,
    description:
      'My favorite FOSS AI coding assistant with a good selection of free models w/ API use',
    status: 'active',
    link: 'https://opencode.ai/',
    price: 0
  },
  {
    name: 'GitHub Copilot Pro',
    icon: GithubCopilot,
    description: "Random edits when I don't want to start a Claude session",
    status: 'unused',
    reason:
      'Poor performance and older models. The recent usage limit cuts have made it practically unusable.',
    link: 'https://github.com/features/copilot',
    price: 10,
    discountedPrice: 0
  },
  {
    name: 'v0 Free',
    icon: V0,
    description: 'Generating boilerplate UIs',
    status: 'unused',
    reason: `Its purpose has become too primitive. I'm more familiar with boilerplate design so I don't have a use for it.`,
    link: 'https://v0.dev/',
    price: 0
  },
  {
    name: 'Devin Desktop/Windsurf',
    icon: Devin,
    description: 'Amazing free tab completion and solid IDE',
    status: 'unused',
    reason:
      'I switched to VSCodium after it become Devin Desktop due to the large amount of bloat added.',
    link: 'https://devin.ai/desktop',
    price: 0
  },
  {
    name: 'MiMo Token Plan',
    icon: XiaomiMiMo,
    description: 'Budget plans for a solid budget Chinese model',
    status: 'cancelled',
    reason:
      'Lower-tier token plans do not provide much value in comparison to API pricing',
    link: 'https://platform.xiaomimimo.com/token-plan',
    price: 6
  }
] as const satisfies ReadonlyArray<AITool>

export const aiTools: AITool[] = aiToolListSchema.parse(rawAiTools)
export const inactiveAiTools = aiTools.filter(isInactiveTool)

export const favoriteModels: FavoriteModel[] = [
  {
    name: 'Gemini 3.6 Flash',
    provider: 'Google',
    review: `A better-priced version of 3.6 with decent output quality. Some looping and laziness not present in 3.5 Flash. Improved design capabilities, and nice for planning/execution.`,
    rating: 8.5
  },
  {
    name: 'Gemini 3.5 Flash',
    provider: 'Google',
    review: `Great for use within Antigravity or Oh My Pi. It's dependable for day-to-day use and paired with an AI Pro subscription (or two), usable limits are bearable.`,
    rating: 9.0
  },
  {
    name: 'MiMo-V2.5',
    provider: 'Xiaomi',
    review: `Suprisingly good output quality for a small model. I use V2.5 daily, and it's great when given small, specific tasks.`,
    rating: 8.0
  },
  {
    name: 'MiMo-V2.5-Pro',
    provider: 'Xiaomi',
    review: `A great higher-powered alternative to MiMo-V2.5, though it lacks meaningful output quality when it counts, similar to V2.5. I prefer V2.5, though it shouldn't discount the improvements made in Pro to output quality.`,
    rating: 7.5
  },
  {
    name: 'Claude 5 Sonnet',
    provider: 'Anthropic',
    review: 'Over-inclusion of guardrails nerfed performance for me.',
    rating: 7.0
  },
  {
    name: 'Claude 4.6 Sonnet',
    provider: 'Anthropic',
    review:
      'Nice routine update with minimal day-to-day improvements; not unwelcome.',
    rating: 9.0
  },
  {
    name: 'Claude 4.5 Sonnet',
    provider: 'Anthropic',
    review: 'Better judgement with a different personality.',
    rating: 8.5
  },
  {
    name: 'Claude 4.1 Opus',
    provider: 'Anthropic',
    review:
      'Amazing planner, useful for Plan Mode in Claude Code. Useful in code generation, albeit at a higher cost.',
    rating: 9.0
  },
  {
    name: 'Claude 4 Sonnet',
    provider: 'Anthropic',
    review:
      'The perfect balance of capability, speed, and price. Perfect for development with React.',
    rating: 8.0
  },
  {
    name: 'GPT-5.6-Terra',
    provider: 'OpenAI',
    review:
      'Decent model but sometimes sloppy in select harnasses. Cuts corners too much for a frontier mid-tier model.',
    rating: 8.5
  },
  {
    name: 'gpt-5-codex',
    provider: 'OpenAI',
    review: 'Very good at instruction calling with better code quality.',
    rating: 8.0
  },
  {
    name: 'GPT-5',
    provider: 'OpenAI',
    review: `A solid model for coding and instruction following. Lacks personality and quality critical thinking at times, but this isn't a barrier to quality output.`,
    rating: 7.0
  },
  {
    name: 'Qwen3-235B-A22B',
    provider: 'Alibaba',
    review:
      'The OG thinking model. Amazing, funny, and smart for chats. Surprisingly good at coding too. Unfortunately, more of a novelty for "real work."',
    rating: 6.5
  },
  {
    name: 'Qwen3-Max-Preview',
    provider: 'Alibaba',
    review:
      "A new personality for Qwen3 at a larger size, amazing for use in chats. I'm not so happy that it's closed source (for now).",
    rating: 6.5
  },
  {
    name: 'Gemini 2.5 Pro',
    provider: 'Google',
    review:
      'Amazing for Deep Research and reasoning tasks. I hate it for coding.',
    rating: 5.5
  },
  {
    name: 'gemma3 27B',
    provider: 'Google',
    review:
      'My favorite for playing around with AI or creating a project. Easy to run locally and open weight!',
    rating: 5.0
  },
  {
    name: 'Grok 4.5',
    provider: 'xAI',
    review:
      'A good model for coding and planning. Usage limits and pricing are appropriate with SuperGrok plans.',
    rating: 9.0
  },
  {
    name: 'Grok 4.3',
    provider: 'xAI',
    review:
      'Cheap and fast model, good for basic coding tasks and commit summaries. Good quality for the price, especially with SuperGrok plans.',
    rating: 8.5
  }
]

export const aiReviews: AIReview[] = [
  {
    tool: 'Oh My Pi',
    rating: 10.0,
    pros: [
      'Best model and provider support',
      'Cutting-edge features with a customizable design',
      'Responsive TUI with first-class cmux support'
    ],
    cons: ['Hard to learn at first'],
    verdict: 'The best overall harnass'
  },
  {
    tool: 'Claude Code',
    rating: 9.0,
    pros: [
      'Flagship model support',
      'First-in-line feature support',
      'Exceptional Claude integration'
    ],
    cons: [
      'API interface be slow at times',
      'TUI can be glitchy',
      'High investment cost to get full value'
    ],
    verdict: 'Best overall for Claude users'
  },
  {
    tool: 'Codex',
    rating: 9.0,
    pros: [
      'Good TUI',
      'Perfectly tuned for GPT models',
      'Simple in the right ways'
    ],
    cons: ['Slow'],
    verdict: 'Exciting new player in the agent space'
  },
  {
    tool: 'Cursor',
    rating: 8.0,
    pros: [
      'Works like magic',
      'Lots of model support',
      'Huge ecosystem and community'
    ],
    cons: [
      'Expensive',
      'Hype around it is dying',
      'Unclear/manipulative pricing'
    ],
    verdict: 'Great all-rounder, slowly dying'
  },
  {
    tool: 'Trae',
    rating: 8.5,
    pros: [
      'Good UI/UX',
      'Very budget-friendly',
      'Fantastic premium usage limits'
    ],
    cons: ['No thinking', 'Occasional parsing issues'],
    verdict: 'Budget-friendly productivity boost'
  },
  {
    tool: 'GitHub Copilot',
    rating: 4.0,
    pros: [
      'Latest models',
      'Great autocomplete',
      'Budget-friendly subscription price'
    ],
    cons: [
      'Almost no provided usage limits to be usagble',
      'No thinking',
      'Low quality output',
      'Bad support for other IDEs'
    ],
    verdict: 'Good for casual use'
  }
]
