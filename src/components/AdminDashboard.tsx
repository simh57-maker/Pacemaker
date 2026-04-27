'use client'

import { useState, useEffect, useCallback } from 'react'
import { DashboardData } from '@/lib/types'
import StatCard from './StatCard'
import WeeklyChart from './WeeklyChart'
import CreatorChart from './CreatorChart'
import ProjectChart from './ProjectChart'
import CreatorShareBar from './CreatorShareBar'

interface Props {
  initialData: DashboardData | null
}

function formatDate(iso: string) {
  const d = new Date(iso)
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

const ADMIN_PASSWORD = '0000'

export default function AdminDashboard({ initialData }: Props) {
  const [authed, setAuthed] = useState(false)
  const [pw, setPw] = useState('')
  const [pwError, setPwError] = useState(false)

  const [data, setData] = useState<DashboardData | null>(initialData)
  const [loading, setLoading] = useState(!initialData)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true)
    else setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/sheets', { cache: 'no-store' })
      if (!res.ok) throw new Error('데이터를 불러오지 못했습니다.')
      const json = await res.json()
      setData(json)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    if (authed && !initialData) fetchData()
  }, [authed, initialData, fetchData])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (pw === ADMIN_PASSWORD) {
      setAuthed(true)
      setPwError(false)
    } else {
      setPwError(true)
    }
  }

  if (!authed) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#161616' }}>
        <style>{`@keyframes shake { 0%,100%{transform:translateX(0)} 20%,60%{transform:translateX(-6px)} 40%,80%{transform:translateX(6px)} }`}</style>
        <div style={{ background: '#262626', padding: '48px 40px', width: 360, borderTop: '3px solid #0f62fe' }}>
          <p style={{ fontSize: 11, color: '#8d8d8d', letterSpacing: '0.32px', textTransform: 'uppercase', marginBottom: 4 }}>Pacemaker</p>
          <p style={{ fontSize: 24, fontWeight: 300, color: '#f4f4f4', marginBottom: 32 }}>Admin</p>
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', fontSize: 12, color: '#c6c6c6', marginBottom: 8 }}>비밀번호</label>
              <input
                type="password"
                value={pw}
                onChange={e => { setPw(e.target.value); setPwError(false) }}
                autoFocus
                style={{
                  width: '100%',
                  background: '#393939',
                  border: `1px solid ${pwError ? '#fa4d56' : '#525252'}`,
                  color: '#f4f4f4',
                  padding: '10px 12px',
                  fontSize: 14,
                  outline: 'none',
                  animation: pwError ? 'shake 0.3s ease' : 'none',
                  fontFamily: "'IBM Plex Mono', monospace",
                  letterSpacing: '0.2em',
                }}
              />
              {pwError && <p style={{ color: '#fa4d56', fontSize: 12, marginTop: 6 }}>비밀번호가 올바르지 않습니다.</p>}
            </div>
            <button
              type="submit"
              style={{ width: '100%', background: '#0f62fe', color: '#fff', border: 'none', padding: '12px', fontSize: 14, cursor: 'pointer' }}
            >
              로그인
            </button>
          </form>
          <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid #393939' }}>
            <a href="/" style={{ fontSize: 12, color: '#8d8d8d', textDecoration: 'none' }}>← 대시보드로 돌아가기</a>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#161616' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 40, height: 40, border: '3px solid #393939', borderTopColor: '#4589ff', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
          <p style={{ color: '#8d8d8d', fontSize: 14 }}>데이터를 불러오는 중...</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#161616' }}>
        <div style={{ textAlign: 'center', padding: 32, background: '#262626', maxWidth: 400 }}>
          <p style={{ color: '#fa4d56', fontSize: 14, marginBottom: 16 }}>{error || '알 수 없는 오류가 발생했습니다.'}</p>
          <button onClick={() => fetchData()} style={{ background: '#0f62fe', color: '#fff', border: 'none', padding: '12px 24px', fontSize: 14, cursor: 'pointer' }}>
            다시 시도
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#161616' }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>

      <header style={{
        background: '#262626',
        borderBottom: '1px solid #393939',
        padding: '0 32px',
        height: 48,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontSize: 11, color: '#8d8d8d', letterSpacing: '0.32px', textTransform: 'uppercase' }}>Pacemaker</span>
          <span style={{ width: 1, height: 16, background: '#525252' }} />
          <span style={{ fontSize: 14, color: '#f4f4f4' }}>Admin</span>
          <span style={{ fontSize: 11, background: '#0f62fe', color: '#fff', padding: '2px 8px', letterSpacing: '0.32px' }}>ADMIN</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {data.lastUpdated && (
            <span style={{ fontSize: 12, color: '#8d8d8d' }}>갱신: {formatDate(data.lastUpdated)}</span>
          )}
          <button
            onClick={() => fetchData(true)}
            disabled={refreshing}
            style={{
              background: 'transparent',
              border: '1px solid #525252',
              color: refreshing ? '#525252' : '#c6c6c6',
              padding: '6px 16px',
              fontSize: 12,
              cursor: refreshing ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            {refreshing && <span style={{ width: 12, height: 12, border: '2px solid #393939', borderTopColor: '#4589ff', borderRadius: '50%', animation: 'spin 0.8s linear infinite', display: 'inline-block' }} />}
            새로고침
          </button>
          <a href="/" style={{ fontSize: 12, color: '#8d8d8d', textDecoration: 'none', border: '1px solid #393939', padding: '6px 16px' }}>
            ← 대시보드
          </a>
          <button
            onClick={() => { setAuthed(false); setPw('') }}
            style={{ background: 'transparent', border: '1px solid #525252', color: '#8d8d8d', padding: '6px 16px', fontSize: 12, cursor: 'pointer' }}
          >
            로그아웃
          </button>
        </div>
      </header>

      <main style={{ padding: '32px', maxWidth: 1400, margin: '0 auto' }}>
        <div style={{ marginBottom: 24 }}>
          <p style={{ fontSize: 12, color: '#8d8d8d', letterSpacing: '0.32px', textTransform: 'uppercase', marginBottom: 4 }}>Overview</p>
          <p style={{ fontSize: 28, fontWeight: 300, color: '#f4f4f4' }}>전체 요약</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 1, marginBottom: 1 }}>
          <StatCard label="총 제작 수량" value={data.grandTotal.total} sub="신규 + 베리" accent="blue" />
          <StatCard label="신규" value={data.grandTotal.신규} accent="teal" />
          <StatCard label="베리" value={data.grandTotal.베리} accent="purple" />
          <StatCard label="참여 제작자" value={data.creators.length} sub="명" accent="yellow" />
          <StatCard label="진행 프로젝트" value={data.projects.length} sub="개" accent="red" />
        </div>

        <div style={{ marginTop: 1 }}>
          <CreatorShareBar data={data.creators} grandTotal={data.grandTotal.total} />
        </div>

        <div style={{ marginTop: 1 }}>
          <WeeklyChart data={data.weekly} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, marginTop: 1 }}>
          <CreatorChart data={data.creators} />
          <ProjectChart data={data.projects} />
        </div>

        <footer style={{ marginTop: 32, paddingTop: 16, borderTop: '1px solid #393939', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 11, color: '#525252' }}>Pacemaker Admin · IBM Carbon Design System</span>
          <span style={{ fontSize: 11, color: '#525252', fontFamily: "'IBM Plex Mono', monospace" }}>{data.records.length} records</span>
        </footer>
      </main>
    </div>
  )
}
