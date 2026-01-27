export default function OptionsLine({ children }: React.PropsWithChildren) {
  return (
    <div className="flex justify-between items-center py-3 px-4 text-foreground text-sm font-semibold">
      {children}
    </div>
  )
}
