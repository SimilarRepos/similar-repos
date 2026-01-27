import { useSimilarRepos } from '@/hooks/useSimilarRepos'
import { SimilarReposContent } from './SimilarReposContent'
import { SimilarReposFooter } from './SimilarReposFooter'
import { SimilarReposHeader } from './SimilarReposHeader'

export function SimilarRepos() {
  const { repos, loading, error, refreshRepos } = useSimilarRepos()

  const handleRefresh = async () => {
    await refreshRepos()
  }

  return (
    <div className="pt-4 w-full mb-4">
      <SimilarReposHeader onRefresh={handleRefresh} />
      <SimilarReposContent repos={repos} loading={loading} error={error} />
      <SimilarReposFooter />
    </div>
  )
}
