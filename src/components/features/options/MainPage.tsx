import { Route, Routes } from 'react-router'
import NAV_ITEMS from '@/entrypoints/options/nav-items'

export default function MainPage() {
  return (
    <main className="p-4 md:p-8">
      <Routes>
        {NAV_ITEMS.map(item => (
          <Route key={item.title} path={item.url} element={<item.page />} />
        ))}
      </Routes>
    </main>
  )
}
