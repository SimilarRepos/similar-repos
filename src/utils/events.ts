import type { AllEventNames } from '@/configs/events'
import { analytics } from '#imports'
import { logger } from './logger'

export function track(event: AllEventNames, properties?: Record<string, any>) {
  try {
    analytics.track(event, properties || {})
  }
  catch (error) {
    logger.warn('Analytics track failed:', error)
  }
}
