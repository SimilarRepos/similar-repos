import {
  APICallError,
  LoadAPIKeyError,
  NoSuchModelError,
  NoSuchProviderError,
  RetryError,
} from 'ai'

const AI_ERRORS = [
  'AI_APICallError',
  'AI_LoadAPIKeyError',
  'AI_RetryError',
  'AI_NoSuchModelError',
  'AI_NoSuchProviderError',
  'UnauthorizedResponseError',
  'PaymentRequiredResponseError',
  'NotFoundResponseError',
  'TooManyRequestsResponseError',
]

export function needThrowError(error: any) {
  // if (!AISDKError.isInstance(error)) {
  //   return false
  // }

  // 有的 SDK provider 不规范，没写message
  if (!(error as Error).message) {
    (error as Error).message = `${error.statusCode} ${error.responseBody}`
  }

  // 用名字判断一下，下方的 isInstance 不生效，
  // 可能是因为异常从 backbround script 中抛出的
  if (AI_ERRORS.includes((error as Error).name)) {
    return true
  }

  // 需要 prompt 给用户的错误信息
  if (
    APICallError.isInstance(error)
    || LoadAPIKeyError.isInstance(error)
    || RetryError.isInstance(error)
    || NoSuchModelError.isInstance(error)
    || NoSuchProviderError.isInstance(error)
  ) {
    return true
  }

  return false
}
