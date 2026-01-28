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
  if (!(error as Error).message) {
    (error as Error).message = `${error.statusCode} ${error.responseBody}`
  }

  if (AI_ERRORS.includes((error as Error).name)) {
    return true
  }
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
