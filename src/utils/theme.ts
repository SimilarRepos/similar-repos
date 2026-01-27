import type { ClassValue } from 'clsx'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isDarkMode() {
  return (
    // TODO: change this to storage API for browser extension
    localStorage.theme === 'dark'
    || (!('theme' in localStorage)
      && typeof window !== 'undefined'
      && window.matchMedia
      && window.matchMedia('(prefers-color-scheme: dark)').matches)
  )
}
