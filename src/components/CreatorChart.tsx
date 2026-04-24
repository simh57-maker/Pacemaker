'use client'

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts'
import { CreatorData } from '@/lib/types'

interface Props {
  data: CreatorData[]
}

const COLORS = ['#4589ff', '#08bdba', '#be95ff', '#ff7eb6', '#ff832b', '#f1c21b', '#42be65', '#fa4d56']

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  const d = payload[0]?.payload as CreatorData
  return (
    <div style={{ background: '#393939', border: '1px solid #525252', padding: '12px 16px', fontSize: 13, minWidth: 180 }}>
      <p style={{ color: '#f4f4f4', fontWeight: 600, marginBottom: 8 }}>{d?.name}</p>
      <p style={{ color: '#4589ff', margin: '2px 0' }}>신규: <strong>{d?.신규.toLocaleString()}</strong></p>
      <p style={{ color: '#08bdba', margin: '2px 0' }}>베리: <strong>{d?.베리.toLocaleString()}</strong></p>
      <p style={{ color: '#8d8d8d', margin: '6px 0 2px', borderTop: '1px solid #525252', paddingTop: 6 }}>
        합계: <strong style={{ color: '#f4f4f4' }}>{d?.total.toLocaleString()}</strong>
      </p>
      <p style={{ color: '#8d8d8d' }}>비중: <strong style={{ color: '#f1c21b' }}>{d?.share}%</strong></p>
    </div>
  )
}

export default function CreatorChart({ data }: Props) {
  const chartData = data.map(d => ({ ...d, name: d.name }))

  return (
    <div style={{ background: '#262626', padding: '24px' }}>
      <p style={{ fontSize: 12, color: '#8d8d8d', letterSpacing: '0.32px', textTransform: 'uppercase', marginBottom: 4 }}>
        제작자 분석
      </p>
      <p style={{ fontSize: 20, fontWeight: 400, color: '#f4f4f4', marginBottom: 24 }}>
        제작자별 총 수량
      </p>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 24, left: 8, bottom: 0 }}>
          <CartesianGrid strokeDasharray="2 4" stroke="#393939" horizontal={false} />
          <XAxis type="number" tick={{ fill: '#8d8d8d', fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis type="category" dataKey="name" tick={{ fill: '#c6c6c6', fontSize: 13 }} axisLine={{ stroke: '#525252' }} tickLine={false} width={48} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
          <Bar dataKey="total" radius={[0, 2, 2, 0]} maxBarSize={28}>
            {chartData.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Share table */}
      <div style={{ marginTop: 24, borderTop: '1px solid #393939', paddingTop: 16 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto auto auto', gap: '8px 16px', alignItems: 'center' }}>
          <span style={{ fontSize: 11, color: '#525252', textTransform: 'uppercase', letterSpacing: '0.32px' }}>제작자</span>
          <span style={{ fontSize: 11, color: '#525252', textTransform: 'uppercase', textAlign: 'right' }}>신규</span>
          <span style={{ fontSize: 11, color: '#525252', textTransform: 'uppercase', textAlign: 'right' }}>베리</span>
          <span style={{ fontSize: 11, color: '#525252', textTransform: 'uppercase', textAlign: 'right' }}>합계</span>
          <span style={{ fontSize: 11, color: '#525252', textTransform: 'uppercase', textAlign: 'right' }}>비중</span>
          {data.map((c, i) => (
            <>
              <div key={`n-${i}`} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: COLORS[i % COLORS.length], flexShrink: 0 }} />
                <span style={{ color: '#c6c6c6', fontSize: 13 }}>{c.name}</span>
              </div>
              <span key={`s-${i}`} style={{ color: '#4589ff', fontSize: 13, textAlign: 'right', fontFamily: "'IBM Plex Mono', monospace" }}>{c.신규.toLocaleString()}</span>
              <span key={`b-${i}`} style={{ color: '#08bdba', fontSize: 13, textAlign: 'right', fontFamily: "'IBM Plex Mono', monospace" }}>{c.베리.toLocaleString()}</span>
              <span key={`t-${i}`} style={{ color: '#f4f4f4', fontSize: 13, textAlign: 'right', fontFamily: "'IBM Plex Mono', monospace" }}>{c.total.toLocaleString()}</span>
              <span key={`p-${i}`} style={{ color: '#f1c21b', fontSize: 13, textAlign: 'right', fontFamily: "'IBM Plex Mono', monospace" }}>{c.share}%</span>
            </>
          ))}
        </div>
      </div>
    </div>
  )
}
