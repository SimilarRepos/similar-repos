import { atom, getDefaultStore } from 'jotai'

export const defaultStore = getDefaultStore()

// 存储所有推荐过的仓库ID，用于排除已推荐的仓库
export const allRecommendedReposAtom = atom<string[]>([])
