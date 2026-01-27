export const EVENTS = {
  LIFECYCLE: {
    EXTENSION_INSTALLED: 'extension_installed',
    EXTENSION_UPDATED: 'extension_updated',
    EXTENSION_UNINSTALLED: 'extension_uninstalled',
  },

  POPUP: {
    OPEN_POPUP: 'click_popup',
  },

  OPTIONS: {
    OPEN_OPTIONS: 'open_options',

    CLICK_GENERAL: 'options_menu_general',
    CLICK_MODEL: 'options_menu_model',
    CLICK_PROMPT: 'options_menu_prompt',

    CHANGE_MODEL: 'options_change_model',
  },

  CONTENT_SCRIPT: {
    OPEN_OPTIONS: 'content_open_options',
    CHAT_WITH_AI: 'content_chat_with_ai',
  },

  ERROR: {
    GENERIC: 'error_generic',
    NETWORK: 'error_network',
    API: 'error_api',
    RUNTIME: 'error_runtime',
    PERMISSION: 'error_permission',
  },
} as const

export type EventCategory = keyof typeof EVENTS
export type EventName<T extends EventCategory> = keyof (typeof EVENTS)[T]

export type AllEventNames = {
  [K in EventCategory]: (typeof EVENTS)[K][keyof (typeof EVENTS)[K]];
}[EventCategory]
