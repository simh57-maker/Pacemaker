'use client'

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts'
import { WeeklyData } from '@/lib/types'

interface Props {
  data: WeeklyData[]
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: '#393939', border: '1px solid #525252', padding: '12px 16px', fontSize: 13 }}>
      <p style={{ color: '#c6c6c6', marginBottom: 6, fontWeight: 600 }}>{label}</p>
      {payload.map((p: any) => (
        <p key={p.dataKey} style={{ color: p.color, margin: '2px 0' }}>
          {p.dataKey}: <strong>{p.value.toLocaleString()}</strong>
        </p>
      ))}
      <p style={{ color: '#8d8d8d', marginTop: 6, borderTop: '1px solid #525252', paddingTop: 6 }}>
        합계: <strong style={{ color: '#f4f4f4' }}>{payload.reduce((s: number, p: any) => s + p.value, 0).toLocaleString()}</strong>
      </p>
    </div>
  )
}

export default function WeeklyChart({ data }: Props) {
  const chartData = data.map(d => ({ name: d.weekLabel, 신규: d.신규, 베리: d.베리 }))

  return (
    <div style={{ background: '#262626', padding: '24px' }}>
      <p style={{ fontSize: 12, color: '#8d8d8d', letterSpacing: '0.32px', textTransform: 'uppercase', marginBottom: 4 }}>
        주차별 현황
      </p>
      <p style={{ fontSize: 20, fontWeight: 400, color: '#f4f4f4', marginBottom: 24 }}>
        신규 · 베리 수량 추이
      </p>
      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={chartData} margin={{ top: 4, right: 16, left: 0, bottom: 0 }} barGap={2}>
          <CartesianGrid strokeDasharray="2 4" stroke="#393939" vertical={false} />
          <XAxis dataKey="name" tick={{ fill: '#8d8d8d', fontSize: 12 }} axisLine={{ stroke: '#525252' }} tickLine={false} />
          <YAxis tick={{ fill: '#8d8d8d', fontSize: 12 }} axisLine={false} tickLine={false} width={40} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
          <Legend
            wrapperStyle={{ fontSize: 12, color: '#c6c6c6', paddingTop: 16 }}
            formatter={(v) => <span style={{ color: '#c6c6c6' }}>{v}</span>}
          />
          <Bar dataKey="신규" fill="#4589ff" radius={[2, 2, 0, 0]} maxBarSize={48} />
          <Bar dataKey="베리" fill="#08bdba" radius={[2, 2, 0, 0]} maxBarSize={48} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
