export default function StreamLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex flex-col flex-1 bg-muted/50">{children}</main>
    </div>
  )
}
