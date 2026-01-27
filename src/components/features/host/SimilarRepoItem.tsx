import { i18n } from '#imports'
import { GitFork, Star } from 'lucide-react'
import { memo } from 'react'

interface SimilarRepoItemProps {
  name: string
  owner: string
  description: string
  stars: number
  forks: number
  url: string
}

export const SimilarRepoItem = memo(({
  name,
  owner,
  description,
  stars,
  forks,
  url,
}: SimilarRepoItemProps) => {
  return (
    <div className="border border-gray-200 rounded-sm p-3 mb-3 hover:bg-gray-50 transition-colors">
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:underline font-semibold text-sm mb-2 block"
      >
        {owner}
        /
        {name}
      </a>

      <p className="text-gray-600 text-xs mb-3 line-clamp-2">
        {description || i18n.t('host.similarRepos.content.noDescription')}
      </p>

      <div className="flex items-center gap-4 text-xs text-gray-600">
        <div className="flex items-center gap-1">
          <Star size={14} className="text-yellow-500" />
          <span>{stars === 0 ? '-' : stars.toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-1">
          <GitFork size={14} className="text-gray-500" />
          <span>{forks === 0 ? '-' : forks.toLocaleString()}</span>
        </div>
      </div>
    </div>
  )
},
)
