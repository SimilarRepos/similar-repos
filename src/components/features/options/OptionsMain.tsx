import { HashRouter } from 'react-router'
import { Separator } from '@/components/ui/separator'
import { SidebarMobileTabs, SidebarProvider } from '@/components/ui/sidebar'
import NAV_ITEMS from '@/entrypoints/options/nav-items'
import MainPage from './MainPage'
import MainSidebar from './MainSidebar'

export default function OptionsMain() {
  return (
    <HashRouter>
      <SidebarProvider className="flex justify-center min-h-[calc(100vh-var(--spacing)*13)] min-w-120 bg-background">
        <div className="grid grid-cols-1 md:grid-cols-[auto_4fr] w-3/4">
          <aside className="hidden md:block md:w-48">
            <div className="fixed h-4/5 flex">
              <MainSidebar className="overflow-y-auto" />
              <Separator
                orientation="vertical"
                className="hidden md:block my-5"
              />
            </div>
          </aside>
          <div className="flex-1 flex flex-col pt-4">
            <MainPage />
          </div>
        </div>
        <SidebarMobileTabs items={NAV_ITEMS} />
      </SidebarProvider>
    </HashRouter>
  )
}
