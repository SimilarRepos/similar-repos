import type { GitHubRepoInfo, Repository } from '@/types/github'
import type { SimilarReposStreamItem } from '@/types/similar-repos-stream'
import { logger } from './logger'

const DOM_SELECTORS = {
  description: [
    '[data-pjax="#repo-content-pjax-container"] .f4.my-3',
    '.BorderGrid-cell .f4.my-3',
    '[itemprop="about"]',
    'p.f4.my-3',
  ],
  language: [
    '.BorderGrid-cell ul.list-style-none li:first-child a .text-bold',
  ],
  topics: [
    '[data-test-selector="topics-list"] a',
    '.topic-tag',
    '.list-topics a',
  ],
  stars: [
    '#repo-stars-counter-star',
    'a[href$="/stargazers"] strong',
    '[href$="/stargazers"] .Counter',
  ],
  forks: [
    '#repo-network-counter',
    'a[href$="/forks"] strong',
    'a[href$="/network/members"] strong',
  ],
  license: [
    '.BorderGrid-cell a[href*="LICENSE"]',
    '.BorderGrid-cell a[href*="license"]',
    '[itemprop="license"]',
  ],
  readme: [
    'article[itemprop="text"]',
    '[data-testid="readme"] article',
    '#readme article',
    '.markdown-body',
    'article.markdown-body',
  ],
  privateLabel: [
    '.Label--private',
    '.Label[data-label="private"]',
    '[aria-label*="Private"]',
    '.Label:has-text("Private")',
    'span.Label.Label--attention:contains("Private")',
  ],
} as const

function extractTextFromSelectors(selectors: readonly string[]): string {
  for (const selector of selectors) {
    const element = document.querySelector(selector)
    const text = element?.textContent?.trim()
    if (text) {
      return text
    }
  }
  return ''
}

function extractNumber(text: string): number {
  const cleanText = text.replace(/[,\s]/g, '')
  const parsed = Number.parseInt(cleanText, 10)
  return Number.isNaN(parsed) ? 0 : parsed
}

function extractNumberFromSelectors(selectors: readonly string[]): number {
  for (const selector of selectors) {
    const element = document.querySelector(selector)
    if (element) {
      const text = element.getAttribute('title') || element.textContent || '0'
      const number = extractNumber(text)
      if (number > 0) {
        return number
      }
    }
  }
  return 0
}

function extractTopics(selectors: readonly string[]): string[] {
  const topics: string[] = []
  const topicSet = new Set<string>()

  for (const selector of selectors) {
    const elements = document.querySelectorAll(selector)
    elements.forEach((element) => {
      const topic = element.textContent?.trim()
      if (topic && !topicSet.has(topic)) {
        topicSet.add(topic)
        topics.push(topic)
      }
    })

    if (topics.length > 0) {
      break
    }
  }

  return topics
}

function extractReadme(
  selectors: readonly string[],
  options: { maxParagraphs?: number, maxChars?: number } = {},
): string | undefined {
  const { maxParagraphs = 10, maxChars = 2000 } = options

  for (const selector of selectors) {
    const readmeElement = document.querySelector(selector)

    if (readmeElement) {
      const paragraphs = Array.from(readmeElement.querySelectorAll('p, h1, h2, h3, h4, h5, h6, li'))
        .map(el => el.textContent?.trim())
        .filter(text => text && text.length > 0)
        .slice(0, maxParagraphs)

      if (paragraphs.length > 0) {
        let readme = paragraphs.join('\n\n')

        if (readme.length > maxChars) {
          readme = `${readme.slice(0, maxChars)}...`
        }

        return readme
      }

      const fullText = readmeElement.textContent?.trim()
      if (fullText) {
        const lines = fullText.split('\n')
          .map(line => line.trim())
          .filter(line => line.length > 0)
          .slice(0, maxParagraphs)
          .join('\n')

        return lines.length > maxChars
          ? `${lines.slice(0, maxChars)}...`
          : lines
      }
    }
  }

  return undefined
}

export function extractRepoFromUrl(
  url: string,
): { owner: string, name: string } | null {
  try {
    if (url.startsWith('http')) {
      const urlObj = new URL(url)
      if (urlObj.hostname !== 'github.com') {
        return null
      }
      const pathname = urlObj.pathname.slice(1)
      const parts = pathname.split('/')

      if (parts.length >= 2) {
        const [owner, name] = parts
        if (
          owner
          && name
          && !owner.includes('.')
          && !name.includes('.')
          && !['settings', 'orgs', 'collections', 'topics'].includes(owner)
        ) {
          return { owner, name }
        }
      }
    }
    else {
      const cleanPath = url.startsWith('/') ? url.slice(1) : url
      const parts = cleanPath.split('/')

      if (parts.length >= 2) {
        const [owner, name] = parts
        if (owner && name) {
          return { owner, name }
        }
      }
    }
  }
  catch (error) {
    console.error('Failed to parse GitHub URL:', error)
  }

  return null
}

export function formatRepoId(owner: string, name: string): string {
  return `${owner}/${name}`
}

export function areReposEqual(a: Repository[], b: Repository[]): boolean {
  if (a.length !== b.length)
    return false

  return a.every((repo, index) => {
    const other = b[index]
    if (!other)
      return false

    return (
      repo.owner === other.owner
      && repo.name === other.name
      && repo.description === other.description
      && repo.stars === other.stars
      && repo.forks === other.forks
      && repo.url === other.url
    )
  })
}

export function areStringArraysEqual(a: string[], b: string[]): boolean {
  if (a.length !== b.length)
    return false

  const sortedA = [...a].sort()
  const sortedB = [...b].sort()

  return sortedA.every((str, index) => str === sortedB[index])
}

export function convertToRepositories(
  items: SimilarReposStreamItem[],
): Repository[] {
  const basicRepos = items
    .map((item) => {
      const repoInfo = extractRepoFromUrl(item.repoUrl)
      if (repoInfo) {
        return {
          owner: repoInfo.owner,
          name: repoInfo.name,
          description: item.repoDesc,
          url: item.repoUrl,
          starts: item.repoStars,
          froks: item.repoForks,
        }
      }
      return null
    })
    .filter((repo): repo is NonNullable<typeof repo> => repo !== null)

  return basicRepos.map(repo => ({
    name: repo.name,
    owner: repo.owner,
    description: repo.description,
    stars: Number.isNaN(repo.starts) ? 0 : Number.parseInt(repo.starts),
    forks: Number.isNaN(repo.froks) ? 0 : Number.parseInt(repo.froks),
    url: repo.url,
  }))
}

export function isPrivateRepo(): boolean {
  try {
    for (const selector of DOM_SELECTORS.privateLabel) {
      try {
        const element = document.querySelector(selector)
        if (element) {
          const text = element.textContent?.trim().toLowerCase()
          if (text === 'private') {
            return true
          }
        }
      }
      catch {
        continue
      }
    }

    const labels = document.querySelectorAll('.Label, [class*="Label"]')
    for (const label of labels) {
      const text = label.textContent?.trim().toLowerCase()
      if (text === 'private') {
        return true
      }
    }

    const hasPublicLabel = Array.from(
      document.querySelectorAll('.Label, [class*="Label"]'),
    ).some(label => label.textContent?.trim().toLowerCase() === 'public')

    if (hasPublicLabel) {
      return false
    }

    return false
  }
  catch (error) {
    logger.error('Failed to check if repository is private:', error)
    return false
  }
}

export function extractRepoInfoFromDOM(options?: {
  maxReadmeParagraphs?: number
  maxReadmeChars?: number
}): GitHubRepoInfo | null {
  try {
    const repoPath = window.location.pathname.slice(1)
    const [owner, name] = repoPath.split('/')

    if (!owner || !name) {
      console.warn('Unable to extract owner/name from URL:', window.location.pathname)
      return null
    }

    const description = extractTextFromSelectors(DOM_SELECTORS.description)
    const language = extractTextFromSelectors(DOM_SELECTORS.language)
    const topics = extractTopics(DOM_SELECTORS.topics)
    const stars = extractNumberFromSelectors(DOM_SELECTORS.stars)
    const forks = extractNumberFromSelectors(DOM_SELECTORS.forks)
    const license = extractTextFromSelectors(DOM_SELECTORS.license) || undefined
    const readme = extractReadme(DOM_SELECTORS.readme, {
      maxParagraphs: options?.maxReadmeParagraphs,
      maxChars: options?.maxReadmeChars,
    })

    const repoInfo: GitHubRepoInfo = {
      id: formatRepoId(owner, name),
      name,
      owner,
      description,
      language,
      topics,
      stars,
      forks,
      license,
      readme,
    }

    logger.log('Extracted repo info:', {
      ...repoInfo,
      readme: readme ? `${readme.slice(0, 100)}...` : undefined,
    })

    return repoInfo
  }
  catch (error) {
    logger.error('Failed to extract repository info from DOM:', error)
    return null
  }
}
