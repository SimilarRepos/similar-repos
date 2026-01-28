export interface Repository {
  name: string
  owner: string
  description: string
  stars: number
  forks: number
  url: string
}

export interface GitHubRepoInfo {
  id: string
  name: string
  owner: string
  description: string
  language: string
  topics: string[]
  stars: number
  forks: number
  license?: string
  readme?: string
  createdAt?: string
  updatedAt?: string
}
