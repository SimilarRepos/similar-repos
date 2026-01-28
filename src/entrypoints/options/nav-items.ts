import type { LucideIcon } from 'lucide-react'
import { i18n } from '#imports'
import { Brain, FileText, Home } from 'lucide-react'
import GeneralPage from './pages/general'
import ModelPage from './pages/model'
import PromptPage from './pages/prompt'

export interface NavItem {
  title: string
  url: string
  icon: LucideIcon
  page?: React.ComponentType
}

export type NavItems = NavItem[]

const NAV_ITEMS = [
  {
    title: `${i18n.t('navitems.home')}`,
    url: '/',
    icon: Home,
    page: GeneralPage,
  },
  {
    title: `${i18n.t('navitems.model')}`,
    url: 'model',
    icon: Brain,
    page: ModelPage,
  },
  {
    title: `${i18n.t('navitems.prompt')}`,
    url: 'prompt',
    icon: FileText,
    page: PromptPage,
  },
] as const satisfies NavItems

export default NAV_ITEMS
