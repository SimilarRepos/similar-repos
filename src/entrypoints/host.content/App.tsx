import { useAtomValue } from 'jotai'
import { ShadowPortal } from '@/components/common/ShadowPortal'
import { SimilarRepos } from '@/components/features/host/SimilarRepos'
import { configEnabledAtom } from '@/configs/model-store'
import { isPrivateRepo } from '@/utils/github'
import { logger } from '@/utils/logger'
import { cn } from '@/utils/theme'

export default function App() {
  const enabled = useAtomValue(configEnabledAtom)
  if (!enabled) {
    return null
  }

  if (isPrivateRepo()) {
    logger.info('Skip for private repo')
    return null
  }

  return (
    <>
      <ShadowPortal
        selector=".BorderGrid"
        position="prepend"
        className="BorderGrid-row"
        injetStyle={true}
        rootClassName={cn('h-full w-full')}
      >
        <SimilarRepos />
      </ShadowPortal>

    </>
  )
}
