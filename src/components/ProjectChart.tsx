'use client'

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { ProjectData } from '@/lib/types'

interface Props {
  data: ProjectData[]
  showBreakdown?: boolean
}

const COLORS = ['#4589ff', '#08bdba', '#be95ff', '#ff7eb6', '#ff832b', '#f1c21b', '#42be65', '#fa4d56']

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null
  const d = payload[0]?.payload as ProjectData
  return (
    <div style={{ background: '#393939', border: '1px solid #525252', padding: '12px 16px', fontSize: 13 }}>
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

const RADIAN = Math.PI / 180
const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, share }: any) => {
  if (share < 5) return null
  const r = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + r * Math.cos(-midAngle * RADIAN)
  const y = cy + r * Math.sin(-midAngle * RADIAN)
  return (
    <text x={x} y={y} fill="#161616" textAnchor="middle" dominantBaseline="central" fontSize={12} fontWeight={600}>
      {share}%
    </text>
  )
}

export default function ProjectChart({ data, showBreakdown = true }: Props) {
  return (
    <div style={{ background: '#262626', padding: '24px' }}>
      <p style={{ fontSize: 12, color: '#8d8d8d', letterSpacing: '0.32px', textTransform: 'uppercase', marginBottom: 4 }}>
        프로젝트 분석
      </p>
      <p style={{ fontSize: 20, fontWeight: 400, color: '#f4f4f4', marginBottom: 24 }}>
        프로젝트별 수량 비중
      </p>
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie
            data={data}
            dataKey="total"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            innerRadius={50}
            labelLine={false}
            label={renderCustomLabel}
          >
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="none" />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            formatter={(v) => <span style={{ color: '#c6c6c6', fontSize: 12 }}>{v}</span>}
            wrapperStyle={{ paddingTop: 16 }}
          />
        </PieChart>
      </ResponsiveContainer>

      {showBreakdown && <div style={{ marginTop: 24, borderTop: '1px solid #393939', paddingTop: 16 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {data.map((p, i) => (
            <div key={p.name} style={{ borderBottom: '1px solid #393939' }}>
              {/* Project header */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr auto auto auto auto',
                gap: '8px 16px',
                padding: '10px 0',
                alignItems: 'center',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 10, height: 10, background: COLORS[i % COLORS.length], flexShrink: 0 }} />
                  <span style={{ color: '#f4f4f4', fontSize: 13, fontWeight: 600 }}>{p.name}</span>
                </div>
                <span style={{ color: '#4589ff', fontSize: 13, textAlign: 'right', fontFamily: "'IBM Plex Mono', monospace" }}>{p.신규.toLocaleString()}</span>
                <span style={{ color: '#08bdba', fontSize: 13, textAlign: 'right', fontFamily: "'IBM Plex Mono', monospace" }}>{p.베리.toLocaleString()}</span>
                <span style={{ color: '#f4f4f4', fontSize: 13, textAlign: 'right', fontFamily: "'IBM Plex Mono', monospace" }}>{p.total.toLocaleString()}</span>
                <span style={{ color: '#f1c21b', fontSize: 13, textAlign: 'right', fontFamily: "'IBM Plex Mono', monospace" }}>{p.share}%</span>
              </div>
              {/* Creator sub-rows */}
              {Object.entries(p.creators).map(([creator, stats]) => (
                <div key={creator} style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr auto auto auto auto',
                  gap: '4px 16px',
                  padding: '6px 0 6px 18px',
                  alignItems: 'center',
                  background: '#1e1e1e',
                }}>
                  <span style={{ color: '#8d8d8d', fontSize: 12 }}>└ {creator}</span>
                  <span style={{ color: '#4589ff', fontSize: 12, textAlign: 'right', fontFamily: "'IBM Plex Mono', monospace" }}>{stats.신규.toLocaleString()}</span>
                  <span style={{ color: '#08bdba', fontSize: 12, textAlign: 'right', fontFamily: "'IBM Plex Mono', monospace" }}>{stats.베리.toLocaleString()}</span>
                  <span style={{ color: '#c6c6c6', fontSize: 12, textAlign: 'right', fontFamily: "'IBM Plex Mono', monospace" }}>{stats.total.toLocaleString()}</span>
                  <span style={{ color: '#8d8d8d', fontSize: 12, textAlign: 'right' }}>
                    {p.total > 0 ? `${Math.round((stats.total / p.total) * 100)}%` : '–'}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>}
    </div>
  )
}
