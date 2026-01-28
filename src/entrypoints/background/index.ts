import type { Browser } from '#imports'
import type { SimilarReposStreamRequest, SimilarReposStreamResponse } from '@/types/similar-repos-stream'
import type { TestConnResult } from '@/types/test-model'
import { browser, defineBackground } from '#imports'
import { EVENTS } from '@/configs/events'
import { SimilarReposStreamService } from '@/services/SimilarReposStreamService'
import { TestModelService } from '@/services/TestModelService'
import { track } from '@/utils/events'
import { logger } from '@/utils/logger'
import { onMessage } from '@/utils/messaging'

export default defineBackground(() => {
  browser.runtime.onInstalled.addListener(async (details) => {
    if (details.reason === 'install') {
      logger.log('SimilarRepos extension installed')
      // await browser.tabs.create({
      //   url: `https://github.com/vinta/awesome-python`,
      // })
      track(EVENTS.LIFECYCLE.EXTENSION_INSTALLED)
    }
    if (details.reason === 'update') {
      track(EVENTS.LIFECYCLE.EXTENSION_UPDATED)
    }
  })

  onMessage('openPage', async (message) => {
    const { url, active } = message.data
    logger.info('openPage', { url, active })
    await browser.tabs.create({ url, active: active ?? true })
  })

  browser.runtime.onConnect.addListener((port) => {
    if (port.name === 'similar-repos-stream') {
      listenSimilarReposStreamPort(port)
    }
    else if (port.name === 'chat-repo-stream') {
      listenChatRepoStreamPort(port)
    }
  })

  onMessage('testModelConfig', async (message): Promise<TestConnResult> => {
    return new TestModelService().test(message.data)
  })
})

export function listenSimilarReposStreamPort(port: Browser.runtime.Port) {
  port.onMessage.addListener(async (msg: SimilarReposStreamRequest) => {
    logger.info('Starting similar repos stream for:', msg.repoInfo.id)

    const service = new SimilarReposStreamService()

    try {
      const generator = service.generate(msg.repoInfo, msg.count, msg.excludedRepos)

      for await (const item of generator) {
        const response: SimilarReposStreamResponse = {
          type: 'data',
          data: item,
        }
        port.postMessage(response)
      }
      port.postMessage({ type: 'complete' } as SimilarReposStreamResponse)
      port.disconnect()
    }
    catch (error) {
      logger.error('Error in similar repos stream:', error)
      const errorResponse: SimilarReposStreamResponse = {
        type: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
      }
      port.postMessage(errorResponse)
    }
  })
}

export function listenChatRepoStreamPort(port: Browser.runtime.Port) {
  port.onMessage.addListener((msg) => {
    logger.info(msg)
    // TODO
  })
}
