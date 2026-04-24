'use client'

interface StatCardProps {
  label: string
  value: number | string
  sub?: string
  accent?: 'blue' | 'teal' | 'purple' | 'yellow' | 'red'
}

const accentColors: Record<string, string> = {
  blue: '#4589ff',
  teal: '#08bdba',
  purple: '#be95ff',
  yellow: '#f1c21b',
  red: '#fa4d56',
}

export default function StatCard({ label, value, sub, accent = 'blue' }: StatCardProps) {
  const color = accentColors[accent]
  return (
    <div
      style={{
        background: '#262626',
        borderTop: `3px solid ${color}`,
        padding: '20px 24px',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        minWidth: 0,
      }}
    >
      <span style={{ fontSize: 12, color: '#8d8d8d', letterSpacing: '0.32px', textTransform: 'uppercase' }}>
        {label}
      </span>
      <span style={{ fontSize: 36, fontWeight: 300, color: '#f4f4f4', lineHeight: 1.1 }}>
        {typeof value === 'number' ? value.toLocaleString() : value}
      </span>
      {sub && <span style={{ fontSize: 12, color: '#8d8d8d' }}>{sub}</span>}
    </div>
  )
}
