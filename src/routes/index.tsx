import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6">
      <p className="text-muted-foreground text-sm">PARTZYNC Marketplace</p>
    </main>
  )
}
