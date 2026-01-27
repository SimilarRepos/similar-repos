import { defineAppConfig, storage } from '#imports'
import { googleAnalytics4 } from '@wxt-dev/analytics/providers/google-analytics-4'

export default defineAppConfig({
  analytics: {
    // debug: import.meta.env.DEV,
    providers: [
      googleAnalytics4({
        apiSecret: import.meta.env.WXT_GA_API_SECRET,
        measurementId: import.meta.env.WXT_GA_MEASUREMENT_ID,
      }),
    ],
    enabled: storage.defineItem('local:analytics-enabled', {
      fallback: true,
    }),
  },
})
