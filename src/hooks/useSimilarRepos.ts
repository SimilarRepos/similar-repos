import type { Browser } from '#imports'
import type { Repository } from '@/types/github'
import type { SimilarReposStreamItem, SimilarReposStreamResponse } from '@/types/similar-repos-stream'
import { useAtom, useAtomValue } from 'jotai'
import { useCallback, useEffect, useRef, useState } from 'react'
import { browser } from 'wxt/browser'
import { configSimilarCountAtom } from '@/configs/model-store'
import { allRecommendedReposAtom } from '@/entrypoints/host.content/atoms'
import { getBatchRepoStats } from '@/services/GithubStatsService'
import {
  areReposEqual,
  areStringArraysEqual,
  convertToRepositories,
  extractRepoFromUrl,
  extractRepoInfoFromDOM,
} from '@/utils/github'
import { logger } from '@/utils/logger'

interface UseSimilarReposResult {
  repos: Repository[]
  loading: boolean
  error: string | null
  currentRepoId: string | null
  refreshRepos: () => Promise<void>
}

const DEFAULT_REPOS: Repository[] = []

export function useSimilarRepos(): UseSimilarReposResult {
  const [repos, setRepos] = useState<Repository[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const repoCount = useAtomValue(configSimilarCountAtom)
  const [currentRepoId, setCurrentRepoId] = useState<string | null>(null)
  const [allRecommendedRepos, setAllRecommendedRepos] = useAtom(allRecommendedReposAtom)
  const portRef = useRef<Browser.runtime.Port | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)
  const statsCacheRef = useRef<Map<string, { description?: string, stars: number, forks: number }>>(new Map())

  const fetchSimilarRepos = useCallback(async () => {
    if (portRef.current) {
      portRef.current.disconnect()
      portRef.current = null
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    abortControllerRef.current = new AbortController()
    setLoading(true)
    setError(null)
    setRepos(DEFAULT_REPOS)
    // Clear stats cache when fetching new repos
    statsCacheRef.current.clear()

    try {
      const currentRepoInfo = extractRepoInfoFromDOM({ maxReadmeParagraphs: 3, maxReadmeChars: 1000 })
      if (currentRepoInfo) {
        setCurrentRepoId(currentRepoInfo.id)
        logger.log('Streaming similar repos for:', currentRepoInfo.id)

        const limitedExcludedRepos
          = allRecommendedRepos.length > 100 ? allRecommendedRepos.slice(-100) : allRecommendedRepos

        const port = browser.runtime.connect({ name: 'similar-repos-stream' })
        portRef.current = port
        const streamedItems: SimilarReposStreamItem[] = []

        const updateRepoStats = async (repos: Repository[]) => {
          // Filter out repos that already have stats in cache
          const reposNeedingStats = repos.filter((repo) => {
            const key = `${repo.owner}/${repo.name}`.toLowerCase()
            return !statsCacheRef.current.has(key)
          })

          // Only fetch stats if there are repos that need them
          if (reposNeedingStats.length > 0) {
            const statsMap = await getBatchRepoStats(
              reposNeedingStats.map(r => ({ owner: r.owner, name: r.name })),
            )
            // Update cache with new stats
            statsMap.forEach((stats, key) => {
              statsCacheRef.current.set(key, stats)
            })
          }

          setRepos((prevRepos) => {
            const newRepos = prevRepos.map((repo) => {
              const key = `${repo.owner}/${repo.name}`.toLowerCase()
              const cachedStats = statsCacheRef.current.get(key)

              if (cachedStats) {
                return {
                  ...repo,
                  stars: cachedStats.stars,
                  forks: cachedStats.forks,
                }
              }
              return repo
            })
            return areReposEqual(prevRepos, newRepos) ? prevRepos : newRepos
          })
        }

        port.onMessage.addListener((response: SimilarReposStreamResponse) => {
          if (response.type === 'data' && response.data) {
            logger.log('Port onMessage received data: ', response.data)
            streamedItems.push(response.data)
            const repositories = convertToRepositories(streamedItems)
            if (repositories.length > 0) {
              if (repositories.length > repoCount) {
                return
              }
              const finalRepos = repositories.length > repoCount
                ? repositories.slice(0, repoCount)
                : repositories

              if (repositories.length >= repoCount) {
                setLoading(false)
              }
              if (!areReposEqual(repos, finalRepos)) {
                setRepos(finalRepos)
              }
              updateRepoStats(finalRepos)
            }
          }
          else if (response.type === 'error') {
            setError(response.error || 'Failed to fetch similar repositories')
            setLoading(false)
          }
          else if (response.type === 'complete') {
            setLoading(false)
            const newRepoIds = streamedItems
              .map((item) => {
                const repoInfo = extractRepoFromUrl(item.repoUrl)
                return repoInfo ? `${repoInfo.owner}/${repoInfo.name}` : null
              })
              .filter((id): id is string => id !== null)

            if (newRepoIds.length > 0) {
              setAllRecommendedRepos((prev) => {
                const combined = [...prev, ...newRepoIds]
                return areStringArraysEqual(prev, combined) ? prev : combined
              })
            }
          }
        })

        port.onDisconnect.addListener(() => {
          logger.info('Similar repos stream port disconnected')
          portRef.current = null
        })

        port.postMessage({
          repoInfo: currentRepoInfo,
          count: repoCount,
          excludedRepos: limitedExcludedRepos,
        })
      }
      else {
        logger.warn('Not on a GitHub repository page')
        setCurrentRepoId(null)
        setRepos(DEFAULT_REPOS)
        setLoading(false)
      }
    }
    catch (err) {
      logger.error('Failed to fetch similar repos:', err)
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to fetch similar repositories',
      )
      setRepos(DEFAULT_REPOS)
      setLoading(false)
    }
  }, [repoCount, allRecommendedRepos, setAllRecommendedRepos])

  const refreshRepos = useCallback(async () => {
    await fetchSimilarRepos()
  }, [fetchSimilarRepos])

  useEffect(() => {
    fetchSimilarRepos()

    return () => {
      if (portRef.current) {
        portRef.current.disconnect()
      }
      statsCacheRef.current.clear()
    }
  }, [])

  return {
    repos,
    loading,
    error,
    currentRepoId,
    refreshRepos,
  }
}
