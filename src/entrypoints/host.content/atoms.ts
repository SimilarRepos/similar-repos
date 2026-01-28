import { atom, getDefaultStore } from 'jotai'

export const defaultStore = getDefaultStore()

export const allRecommendedReposAtom = atom<string[]>([])
