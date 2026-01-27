import { i18n } from '#imports'
import { CheckCircle, XCircle } from 'lucide-react'
import { TEST_MODEL_CONTENT } from '@/configs/constants'
import { cn } from '@/utils/theme'

interface ConnectionTestMiniProps {
  isTesting: boolean
  testResult: {
    success: boolean
    message?: string
    model?: string
  }
  className?: string
}

export function ConnectionTestMini({
  isTesting,
  testResult,
  className,
}: ConnectionTestMiniProps) {
  if (isTesting) {
    return null
  }

  return (
    <div
      className={cn(
        'text-sm p-3 rounded-md border gap-1 flex flex-col',
        testResult.success
          ? 'bg-green-50 text-green-700 border-green-200'
          : 'bg-red-50 text-red-700 border-red-200',
        className,
      )}
    >
      <div className="flex  items-center">
        {testResult.success
          ? (
              <CheckCircle className="h-4 w-4 mr-1" />
            )
          : (
              <XCircle className="h-4 w-4 mr-1" />
            )}
        <span className="font-medium">
          {testResult.success
            ? i18n.t('options.provider.configDialog.test.success')
            : i18n.t('options.provider.configDialog.test.failed')}
        </span>
      </div>
      <div className="flex  items-baseline text-xs">
        <span className="font-semibold whitespace-nowrap">
          {i18n.t('options.provider.configDialog.test.request')}
        </span>
        <span className="ml-1">{`"${TEST_MODEL_CONTENT}"`}</span>
      </div>
      {testResult.message && (
        <div className="flex  items-baseline text-xs">
          <span className="font-semibold whitespace-nowrap">
            {i18n.t('options.provider.configDialog.test.response')}
          </span>
          <span className="ml-1">{testResult.message}</span>
        </div>
      )}
    </div>
  )
}
