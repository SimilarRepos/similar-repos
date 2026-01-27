export interface SimilarReposRequest {
  repoId: string
  count: number
  excludedRepos?: string[]
}

export type SimilarReposResult = Array<{
  repoUrl: string
  repoDesc: string
}>
