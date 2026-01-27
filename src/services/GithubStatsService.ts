import { LRUCache } from 'lru-cache'
// src/services/githubStatsService.ts
import { logger } from '@/utils/logger'

interface RepoStats {
  stars: number
  forks: number
  description: string
}

interface RepoIdentifier {
  owner: string
  name: string
}

const repoStatsCache = new LRUCache<string, RepoStats>({
  max: 500,
  ttl: 1000 * 60 * 10,
  updateAgeOnGet: true,
  updateAgeOnHas: false,
})

function getCacheKey(owner: string, name: string): string {
  return `${owner}/${name}`.toLowerCase()
}

async function fetchRepoStatsFromHTML(
  owner: string,
  name: string,
): Promise<RepoStats | null> {
  try {
    const url = `https://github.com/${owner}/${name}`
    const response = await fetch(url, {
      headers: {
        Accept: 'text/html',
      },
    })

    if (!response.ok) {
      console.warn(
        `Failed to fetch page for ${owner}/${name}: ${response.status}`,
      )
      return null
    }

    const html = await response.text()
    const parser = new DOMParser()
    const doc = parser.parseFromString(html, 'text/html')

    // 提取 stars
    let stars = 0
    const starsSelectors = [
      '#repo-stars-counter-star',
      'a[href$="/stargazers"] strong',
      '#repo-stars-counter-star span',
      '[data-view-component="true"] a[href$="/stargazers"]',
    ]

    for (const selector of starsSelectors) {
      const element = doc.querySelector(selector)
      if (element) {
        const text
          = element.getAttribute('title') || element.textContent || '0'
        const parsed = Number.parseInt(text.replace(/[,\s]/g, ''))
        if (!Number.isNaN(parsed)) {
          stars = parsed
          break
        }
      }
    }

    // 提取 forks
    let forks = 0
    const forksSelectors = [
      '#repo-network-counter',
      'a[href$="/forks"] strong',
      'a[href$="/network/members"] strong',
    ]

    for (const selector of forksSelectors) {
      const element = doc.querySelector(selector)
      if (element) {
        const text
          = element.getAttribute('title') || element.textContent || '0'
        const parsed = Number.parseInt(text.replace(/[,\s]/g, ''))
        if (!Number.isNaN(parsed)) {
          forks = parsed
          break
        }
      }
    }

    // 提取描述
    let description = ''
    const descSelectors = [
      'p[class*="f4"]',
      '[data-repository-hover-card-target-url] + p',
      '.repository-content p.f4',
    ]

    for (const selector of descSelectors) {
      const element = doc.querySelector(selector)
      if (element?.textContent) {
        description = element.textContent.trim()
        break
      }
    }

    logger.log(`Extracted stats for ${owner}/${name}:`, { stars, forks })
    return { stars, forks, description }
  }
  catch (err) {
    logger.error(`Error fetching HTML for ${owner}/${name}:`, err)
    return null
  }
}

async function _fetchReposFromGitHubByHTML(
  repos: RepoIdentifier[],
): Promise<Map<string, RepoStats>> {
  const statsMap = new Map<string, RepoStats>()

  if (repos.length === 0)
    return statsMap

  const CONCURRENT_LIMIT = 3
  const results: Array<{ key: string, stats: RepoStats } | null> = []

  for (let i = 0; i < repos.length; i += CONCURRENT_LIMIT) {
    const batch = repos.slice(i, i + CONCURRENT_LIMIT)

    const batchPromises = batch.map(async (repo) => {
      await new Promise(resolve => setTimeout(resolve, Math.random() * 1000))

      const stats = await fetchRepoStatsFromHTML(repo.owner, repo.name)
      if (stats) {
        return {
          key: getCacheKey(repo.owner, repo.name),
          stats,
        }
      }
      return null
    })

    const batchResults = await Promise.all(batchPromises)
    results.push(...batchResults)

    if (i + CONCURRENT_LIMIT < repos.length) {
      await new Promise(resolve => setTimeout(resolve, 500))
    }
  }

  results.forEach((result) => {
    if (result) {
      statsMap.set(result.key, result.stats)
    }
  })

  logger.log(`Successfully fetched ${statsMap.size}/${repos.length} repos`)
  return statsMap
}

async function fetchReposFromGitHubByGraphQL(
  repos: RepoIdentifier[],
): Promise<Map<string, RepoStats>> {
  const statsMap = new Map<string, RepoStats>()

  if (repos.length === 0)
    return statsMap

  try {
    const repoQueries = repos
      .map(
        (repo, index) => `
      repo${index}: repository(owner: "${repo.owner}", name: "${repo.name}") {
        nameWithOwner
        description
        stargazerCount
        forkCount
      }
    `,
      )
      .join('\n')

    const query = `
      query {
        ${repoQueries}
      }
    `

    const response = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    })

    if (!response.ok) {
      logger.error(`GraphQL request failed with status: ${response.status}`)
      return statsMap
    }

    const result = await response.json()

    if (result.errors) {
      logger.error('GraphQL errors:', result.errors)
    }

    if (result.data) {
      Object.values(result.data).forEach((repoData: any) => {
        if (repoData && repoData.nameWithOwner) {
          const stats: RepoStats = {
            stars: repoData.stargazerCount || 0,
            forks: repoData.forkCount || 0,
            description: repoData.description || '',
          }

          statsMap.set(repoData.nameWithOwner.toLowerCase(), stats)
        }
      })
    }
  }
  catch (err) {
    logger.error('Failed to fetch GitHub stats:', err)
  }

  return statsMap
}

export async function getRepoStats(
  owner: string,
  name: string,
): Promise<RepoStats | null> {
  const cacheKey = getCacheKey(owner, name)

  const cached = repoStatsCache.get(cacheKey)
  if (cached) {
    logger.log(`Cache hit for ${cacheKey}`)
    return cached
  }

  logger.log(`Cache miss for ${cacheKey}, fetching...`)
  const statsMap = await fetchReposFromGitHubByGraphQL([{ owner, name }])
  const stats = statsMap.get(cacheKey)

  if (stats) {
    repoStatsCache.set(cacheKey, stats)
    return stats
  }

  return null
}

export async function getBatchRepoStats(
  repos: RepoIdentifier[],
): Promise<Map<string, RepoStats>> {
  const resultMap = new Map<string, RepoStats>()
  const reposToFetch: RepoIdentifier[] = []

  repos.forEach((repo) => {
    const cacheKey = getCacheKey(repo.owner, repo.name)
    const cached = repoStatsCache.get(cacheKey)

    if (cached) {
      logger.log(`Cache hit for ${cacheKey}`)
      resultMap.set(cacheKey, cached)
    }
    else {
      logger.log(`Cache miss for ${cacheKey}`)
      reposToFetch.push(repo)
    }
  })

  if (reposToFetch.length === 0) {
    logger.log('All repos found in cache')
    return resultMap
  }

  logger.log(`Fetching ${reposToFetch.length} repos from GitHub API`)
  const fetchedStats = await fetchReposFromGitHubByGraphQL(reposToFetch)

  fetchedStats.forEach((stats, key) => {
    repoStatsCache.set(key, stats)
    resultMap.set(key, stats)
  })

  return resultMap
}

export function clearRepoCache(owner: string, name: string): void {
  const cacheKey = getCacheKey(owner, name)
  repoStatsCache.delete(cacheKey)
  logger.log(`Cleared cache for ${cacheKey}`)
}

export function clearAllCache(): void {
  repoStatsCache.clear()
  logger.log('Cleared all cache')
}

export function getCacheStats() {
  return {
    size: repoStatsCache.size,
    max: repoStatsCache.max,
    calculatedSize: repoStatsCache.calculatedSize,
  }
}
