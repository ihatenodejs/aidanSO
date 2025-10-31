import {
  Claude,
  GithubCopilot,
  Gemini,
  Perplexity,
  OpenAI,
  Qwen,
  ZAI,
  V0
} from '@lobehub/icons'
import type { FavoriteModel, AIReview, AITool } from '@/app/ai/types'
import { aiToolListSchema, isInactiveTool } from '@/app/ai/types'
import OpenCodeIcon from '@/components/icons/OpenCodeIcon'

const rawAiTools = [
  {
    name: 'ChatGPT Business',
    icon: OpenAI,
    description: 'Feature-rich and budget-friendly (for now)',
    status: 'active',
    hasUsage: true,
    link: 'https://chatgpt.com/',
    price: 60
  },
  {
    name: 'Claude Max 5x',
    icon: Claude,
    description: 'My favorite model provider for general use and coding',
    status: 'primary',
    usage: '/ai/usage',
    hasUsage: true,
    link: 'https://claude.ai/',
    price: 100,
    discountedPrice: 0
  },
  {
    name: 'GLM Coding Lite',
    icon: ZAI,
    description: 'Cheap, Claude-like model with a slow API',
    status: 'cancelled',
    reason: 'Poor quality output and a bad experience in general',
    link: 'https://z.ai/',
    price: 3
  },
  {
    name: 'Gemini Pro',
    icon: Gemini,
    description: 'Chatting, asking questions, and image generation',
    status: 'occasional',
    link: 'https://gemini.google.com/',
    price: 20,
    discountedPrice: 0
  },
  {
    name: 'Qwen Chat',
    icon: Qwen,
    description: 'My favorite open source LLM for chatting',
    status: 'occasional',
    link: 'https://chat.qwen.ai/',
    price: 0
  },
  {
    name: 'Perplexity Pro',
    icon: Perplexity,
    description: 'Reliable for more in-depth searching',
    status: 'occasional',
    link: 'https://perplexity.ai/',
    price: 20,
    discountedPrice: 0
  },
  {
    name: 'OpenCode',
    icon: OpenCodeIcon,
    description: 'My favorite FOSS AI coding assistant',
    status: 'active',
    link: 'https://opencode.ai/',
    price: 0
  },
  {
    name: 'GitHub Copilot Pro',
    icon: GithubCopilot,
    description: "Random edits when I don't want to start a Claude session",
    status: 'unused',
    reason: 'Poor performance and older models',
    link: 'https://github.com/features/copilot',
    price: 10,
    discountedPrice: 0
  },
  {
    name: 'v0 Free',
    icon: V0,
    description: 'Generating boilerplate UIs',
    status: 'occasional',
    link: 'https://v0.dev/',
    price: 0
  }
] as const satisfies ReadonlyArray<AITool>

export const aiTools: AITool[] = aiToolListSchema.parse(rawAiTools)
export const inactiveAiTools = aiTools.filter(isInactiveTool)

export const favoriteModels: FavoriteModel[] = [
  {
    name: 'Claude 4.5 Sonnet',
    provider: 'Anthropic',
    review: 'Better judgement with a different personality.',
    rating: 9.5
  },
  {
    name: 'Claude 4 Sonnet',
    provider: 'Anthropic',
    review:
      'The perfect balance of capability, speed, and price. Perfect for development with React.',
    rating: 9.0
  },
  {
    name: 'gpt-5-codex',
    provider: 'OpenAI',
    review: 'Very good at instruction calling with better code quality.',
    rating: 8.0
  },
  {
    name: 'Claude 4.1 Opus',
    provider: 'Anthropic',
    review:
      'Amazing planner, useful for Plan Mode in Claude Code. Useful in code generation, albeit at a higher cost.',
    rating: 9.0
  },
  {
    name: 'Qwen3-235B-A22B',
    provider: 'Alibaba',
    review:
      'The OG thinking model. Amazing, funny, and smart for chats. Surprisingly good at coding too.',
    rating: 8.5
  },
  {
    name: 'GPT-5',
    provider: 'OpenAI',
    review: `A solid model for coding and instruction following. Lacks personality and quality critical thinking at times, but this isn't a barrier to quality output.`,
    rating: 8.0
  },
  {
    name: 'Qwen3-Max-Preview',
    provider: 'Alibaba',
    review:
      "A new personality for Qwen3 at a larger size, amazing for use in chats. I'm not so happy that it's closed source (for now).",
    rating: 8.5
  },
  {
    name: 'Gemini 2.5 Pro',
    provider: 'Google',
    review:
      'Amazing for Deep Research and reasoning tasks. I hate it for coding.',
    rating: 7.5
  },
  {
    name: 'gemma3 27B',
    provider: 'Google',
    review:
      'My favorite for playing around with AI or creating a project. Easy to run locally and open weight!',
    rating: 8.0
  }
]

export const aiReviews: AIReview[] = [
  {
    tool: 'Claude Code',
    rating: 10.0,
    pros: [
      'Flagship models',
      'High usage limits',
      'Exceptional Claude integration'
    ],
    cons: [
      'API interface be slow at times',
      'High investment cost to get full value'
    ],
    verdict: 'Best overall for Claude lovers'
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
    rating: 6.0,
    pros: [
      'Latest models',
      'Great autocomplete',
      'Budget-friendly subscription price'
    ],
    cons: ['No thinking', 'Low quality output', 'Bad support for other IDEs'],
    verdict: 'Good for casual use'
  }
]
