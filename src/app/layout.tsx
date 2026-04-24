import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Pacemaker Dashboard',
  description: '제작자별 신규·베리 수량 현황 대시보드',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body style={{ minHeight: '100vh', background: '#161616' }}>{children}</body>
    </html>
  )
}
