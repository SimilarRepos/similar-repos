import type { Repository } from '@/types/github'
import type { SimilarReposStreamItem } from '@/types/similar-repos-stream'

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

      // GitHub repo URLs have format: /owner/name
      if (parts.length >= 2) {
        const [owner, name] = parts
        // Filter out invalid characters and common non-repo paths
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
      // Handle pathname only (e.g., /facebook/react)
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

export function getCurrentRepo(): { owner: string, name: string } | null {
  return extractRepoFromUrl(window.location.href)
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
    return repo.owner === other.owner
      && repo.name === other.name
      && repo.description === other.description
      && repo.stars === other.stars
      && repo.forks === other.forks
      && repo.url === other.url
  })
}

export function areStringArraysEqual(a: string[], b: string[]): boolean {
  if (a.length !== b.length)
    return false
  const sortedA = [...a].sort()
  const sortedB = [...b].sort()
  return sortedA.every((str, index) => str === sortedB[index])
}

export function convertToRepositories(items: SimilarReposStreamItem[]): Repository[] {
  const basicRepos = items
    .map((item) => {
      const repoInfo = extractRepoFromUrl(item.repoUrl)
      if (repoInfo) {
        return {
          owner: repoInfo.owner,
          name: repoInfo.name,
          description: item.repoDesc,
          url: item.repoUrl,
        }
      }
      return null
    })
    .filter((repo): repo is NonNullable<typeof repo> => repo !== null)

  return basicRepos.map(repo => ({
    name: repo.name,
    owner: repo.owner,
    description: repo.description,
    stars: 0,
    forks: 0,
    url: repo.url,
  }))
}
