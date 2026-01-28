import { i18n } from '#imports'
import { useAtom, useAtomValue } from 'jotai'
import { useEffect, useState } from 'react'
import OptionsLine from '@/components/features/options/OptionsLine'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { customPromptAtom, writeCustomPromptAtom } from '@/configs/model-store'
import { promptTemplates } from '@/configs/prompts'

export default function PromptPage() {
  const savedPrompt = useAtomValue(customPromptAtom)
  const [, writeCustomPrompt] = useAtom(writeCustomPromptAtom)
  const [editingPrompt, setEditingPrompt] = useState('')
  const [isModified, setIsModified] = useState(false)

  useEffect(() => {
    if (savedPrompt && !editingPrompt) {
      setEditingPrompt(savedPrompt)
    }
  }, [savedPrompt])

  const handleSave = async () => {
    await writeCustomPrompt(editingPrompt)
    setIsModified(false)
  }

  const handleReset = () => {
    const defaultPrompt = promptTemplates.recommendRepos || ''
    setEditingPrompt(defaultPrompt)
    setIsModified(defaultPrompt !== savedPrompt)
  }

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditingPrompt(e.target.value)
    setIsModified(e.target.value !== savedPrompt)
  }

  return (
    <div className="flex flex-col">
      <OptionsLine>
        <div className="flex flex-col gap-2 w-full">
          <div className="text-sm font-medium text-foreground">
            {i18n.t('options.prompt.editPrompt')}
          </div>
          <div className="text-xs text-muted-foreground">
            {i18n.t('options.prompt.customizePrompt')}
            <br></br>
            {i18n.t('options.prompt.supportedVariables')}
            <div className="mt-1 space-y-1">
              <code className="px-1 py-0.5 bg-muted rounded text-xs">
                {'{repoId}'}
              </code>
              {' '}
              -
              {' '}
              {i18n.t('options.prompt.repoId')}
              <br />
              <code className="px-1 py-0.5 bg-muted rounded text-xs">
                {'{repoCount}'}
              </code>
              {' '}
              -
              {' '}
              {i18n.t('options.prompt.repoCount')}
              <br />
              <code className="px-1 py-0.5 bg-muted rounded text-xs">
                {'{repoDesc}'}
              </code>
              {' '}
              -
              {' '}
              {i18n.t('options.prompt.repoDesc')}
              <br />
              <code className="px-1 py-0.5 bg-muted rounded text-xs">
                {'{repoLanguage}'}
              </code>
              {' '}
              -
              {' '}
              {i18n.t('options.prompt.repoLanguage')}
              <br />
              <code className="px-1 py-0.5 bg-muted rounded text-xs">
                {'{repoTopics}'}
              </code>
              {' '}
              -
              {' '}
              {i18n.t('options.prompt.repoTopics')}
              <br />
              <code className="px-1 py-0.5 bg-muted rounded text-xs">
                {'{repoStars}'}
              </code>
              {' '}
              -
              {' '}
              {i18n.t('options.prompt.repoStars')}
              <br />
              <code className="px-1 py-0.5 bg-muted rounded text-xs">
                {'{repoForks}'}
              </code>
              {' '}
              -
              {' '}
              {i18n.t('options.prompt.repoForks')}
              <br />
              <code className="px-1 py-0.5 bg-muted rounded text-xs">
                {'{repoReadMe}'}
              </code>
              {' '}
              -
              {' '}
              {i18n.t('options.prompt.repoReadMe')}
            </div>
          </div>
        </div>
      </OptionsLine>

      <OptionsLine>
        <div className="flex flex-col gap-3 w-full">
          <Textarea
            value={editingPrompt}
            onChange={handleChange}
            placeholder={i18n.t('options.prompt.placeholder')}
            className="min-h-75 font-mono text-sm"
          />

          <div className="flex gap-2 justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              disabled={
                editingPrompt === (promptTemplates.recommendRepos || '')
              }
            >
              {i18n.t('options.prompt.resetToDefault')}
            </Button>

            <Button size="sm" onClick={handleSave} disabled={!isModified}>
              {i18n.t('options.prompt.save')}
            </Button>
          </div>
        </div>
      </OptionsLine>
    </div>
  )
}
