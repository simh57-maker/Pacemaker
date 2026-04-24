'use client'

import { CreatorData } from '@/lib/types'

interface Props {
  data: CreatorData[]
  grandTotal: number
}

const COLORS = ['#4589ff', '#08bdba', '#be95ff', '#ff7eb6', '#ff832b', '#f1c21b', '#42be65', '#fa4d56']

export default function CreatorShareBar({ data, grandTotal }: Props) {
  return (
    <div style={{ background: '#262626', padding: '24px' }}>
      <p style={{ fontSize: 12, color: '#8d8d8d', letterSpacing: '0.32px', textTransform: 'uppercase', marginBottom: 4 }}>
        기여 비중
      </p>
      <p style={{ fontSize: 20, fontWeight: 400, color: '#f4f4f4', marginBottom: 20 }}>
        전체 대비 제작자 비중
      </p>

      {/* Stacked bar */}
      <div style={{ display: 'flex', height: 32, borderRadius: 2, overflow: 'hidden', gap: 1 }}>
        {data.map((c, i) => (
          <div
            key={c.name}
            title={`${c.name}: ${c.share}%`}
            style={{
              flex: c.total,
              background: COLORS[i % COLORS.length],
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 11,
              fontWeight: 600,
              color: '#161616',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              cursor: 'default',
              transition: 'opacity 0.2s',
            }}
          >
            {c.share >= 8 ? `${c.share}%` : ''}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px 24px', marginTop: 16 }}>
        {data.map((c, i) => (
          <div key={c.name} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 10, height: 10, background: COLORS[i % COLORS.length], borderRadius: 1 }} />
            <span style={{ fontSize: 12, color: '#c6c6c6' }}>{c.name}</span>
            <span style={{ fontSize: 12, color: '#8d8d8d', fontFamily: "'IBM Plex Mono', monospace" }}>{c.share}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}
