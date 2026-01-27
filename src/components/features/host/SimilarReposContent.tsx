import type { Repository } from '@/types/github'
import { i18n } from '#imports'
import { memo } from 'react'
import { Spinner } from '@/components/ui/spinner'
import { SimilarRepoItem } from './SimilarRepoItem'

interface SimilarReposContentProps {
  repos: Repository[] | null
  loading: boolean
  error: string | null
}

export const SimilarReposContent = memo(({
  repos,
  loading,
  error,
}: SimilarReposContentProps) => {
  const hasRepos = repos && repos.length > 0

  if (error) {
    return <div className="text-red-500">{error}</div>
  }
  return (
    <div className="space-y-0">
      {hasRepos && (
        <div className="space-y-0">
          {repos.map((repo, _index) => (
            <div
              key={`${repo.owner}/${repo.name}`}
              className="animate-in fade-in slide-in-from-right duration-300"
            >
              <SimilarRepoItem
                name={repo.name}
                owner={repo.owner}
                description={repo.description}
                stars={repo.stars}
                forks={repo.forks}
                url={repo.url}
              />
            </div>
          ))}
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center w-full py-4">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Spinner className="size-4" />
            <span>{i18n.t('host.similarRepos.content.loading')}</span>
          </div>
        </div>
      )}

      {!hasRepos && !loading && (
        <p className="text-gray-500 text-sm text-center py-4">
          {i18n.t('host.similarRepos.content.noRepos')}
        </p>
      )}
    </div>
  )
})
