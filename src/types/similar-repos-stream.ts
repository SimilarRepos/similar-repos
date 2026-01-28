import type { GitHubRepoInfo } from './github'

export interface SimilarReposStreamRequest {
  repoInfo: GitHubRepoInfo
  count: number
  excludedRepos?: string[]
}

export interface SimilarReposStreamItem {
  repoUrl: string
  repoDesc: string
}

export interface SimilarReposStreamResponse {
  type: 'data' | 'error' | 'complete'
  data?: SimilarReposStreamItem
  error?: string
}
