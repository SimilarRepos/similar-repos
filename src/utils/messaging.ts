import type { ChatRepoRequest, ChatRepoResult } from '@/types/chat-repo'
import type {
  SimilarReposRequest,
  SimilarReposResult,
} from '@/types/similar-repos'
import type { TestConnRequest, TestConnResult } from '@/types/test-model'
import { defineExtensionMessaging } from '@webext-core/messaging'

export interface ProtocolMap {
  similarRepos: (data: SimilarReposRequest) => SimilarReposResult

  chatRepo: (data: ChatRepoRequest) => ChatRepoResult | null

  testModelConfig: (data: TestConnRequest) => TestConnResult

  openPage: (data: { url: string, active?: boolean }) => void
}

export const { sendMessage, onMessage }
  = defineExtensionMessaging<ProtocolMap>()
