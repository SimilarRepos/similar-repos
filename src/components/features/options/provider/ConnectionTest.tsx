import { i18n } from '#imports'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Spinner } from '@/components/ui/spinner'
import { ConnectionTestMini } from './ConnectionTestMini'

interface ConnectionTestProps {
  testResult?: {
    success: boolean
    message?: string
    model?: string
  } | null
  isTesting: boolean
  onTest: () => void
  disabled?: boolean
}

export function ConnectionTest({
  testResult,
  isTesting,
  onTest,
  disabled = false,
}: ConnectionTestProps) {
  return (
    <div className="border-t pt-4">
      <div className="flex items-center justify-between mb-2">
        <Label className="text-sm font-medium">
          {i18n.t('options.provider.configDialog.test.button')}
        </Label>
        <Button onClick={onTest} disabled={disabled || isTesting} size="sm">
          {isTesting
            ? (
                <span className="flex items-center">
                  <Spinner className="mr-1 size-4" />
                  {i18n.t('options.provider.configDialog.test.testing')}
                </span>
              )
            : (
                <>{i18n.t('options.provider.configDialog.test.button')}</>
              )}
        </Button>
      </div>

      {testResult && (
        <ConnectionTestMini
          isTesting={isTesting}
          testResult={testResult}
          className="mt-2"
        />
      )}
    </div>
  )
}
