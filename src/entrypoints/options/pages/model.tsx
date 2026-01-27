import { ActiveConfigDetails } from '@/components/features/options/provider/ActiveConfigDetails'
import { ActiveConfigSelector } from '@/components/features/options/provider/ActiveConfigSelector'
import { ConfigDialog } from '@/components/features/options/provider/ConfigDialog'
import { ConfigList } from '@/components/features/options/provider/ConfigList'

export default function ModelPage() {
  return (
    <div className="flex flex-col">
      <ActiveConfigSelector />
      <ActiveConfigDetails />
      <ConfigList />
      <ConfigDialog />
    </div>
  )
}
