import Dashboard from '@/components/Dashboard'
import { DashboardData } from '@/lib/types'

async function getData(): Promise<DashboardData | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    const res = await fetch(`${baseUrl}/api/sheets`, { next: { revalidate: 60 } })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

export default async function Home() {
  const data = await getData()
  return <Dashboard initialData={data} />
}
