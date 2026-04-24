import { getISOWeek, getISOWeekYear, startOfISOWeek, endOfISOWeek, format } from 'date-fns'
import { RawRecord, WeeklyData, CreatorData, ProjectData, DashboardData } from './types'

function getWeekKey(date: Date): string {
  const year = getISOWeekYear(date)
  const week = getISOWeek(date)
  return `${year}-W${String(week).padStart(2, '0')}`
}

function getWeekLabel(date: Date): string {
  const start = startOfISOWeek(date)
  const end = endOfISOWeek(date)
  return `${format(start, 'M/d')}~${format(end, 'M/d')}`
}

export function processData(records: RawRecord[]): DashboardData {
  const weeklyMap = new Map<string, WeeklyData>()
  const creatorMap = new Map<string, CreatorData>()
  const projectMap = new Map<string, ProjectData>()

  let grandTotal = { 신규: 0, 베리: 0, total: 0 }

  for (const r of records) {
    const date = new Date(r.일시)
    const weekKey = getWeekKey(date)
    const weekLabel = getWeekLabel(date)
    const 신규 = Number(r.신규) || 0
    const 베리 = Number(r.베리) || 0
    const total = 신규 + 베리

    grandTotal.신규 += 신규
    grandTotal.베리 += 베리
    grandTotal.total += total

    // Weekly
    if (!weeklyMap.has(weekKey)) {
      weeklyMap.set(weekKey, { week: weekKey, weekLabel, 신규: 0, 베리: 0, total: 0 })
    }
    const w = weeklyMap.get(weekKey)!
    w.신규 += 신규
    w.베리 += 베리
    w.total += total

    // Creator
    if (!creatorMap.has(r.제작자)) {
      creatorMap.set(r.제작자, { name: r.제작자, 신규: 0, 베리: 0, total: 0, share: 0, projects: {} })
    }
    const c = creatorMap.get(r.제작자)!
    c.신규 += 신규
    c.베리 += 베리
    c.total += total
    if (!c.projects[r.프로젝트]) c.projects[r.프로젝트] = { 신규: 0, 베리: 0, total: 0 }
    c.projects[r.프로젝트].신규 += 신규
    c.projects[r.프로젝트].베리 += 베리
    c.projects[r.프로젝트].total += total

    // Project
    if (!projectMap.has(r.프로젝트)) {
      projectMap.set(r.프로젝트, { name: r.프로젝트, 신규: 0, 베리: 0, total: 0, share: 0, creators: {} })
    }
    const p = projectMap.get(r.프로젝트)!
    p.신규 += 신규
    p.베리 += 베리
    p.total += total
    if (!p.creators[r.제작자]) p.creators[r.제작자] = { 신규: 0, 베리: 0, total: 0 }
    p.creators[r.제작자].신규 += 신규
    p.creators[r.제작자].베리 += 베리
    p.creators[r.제작자].total += total
  }

  // Calculate shares
  const creators = Array.from(creatorMap.values())
    .map(c => ({ ...c, share: grandTotal.total > 0 ? Math.round((c.total / grandTotal.total) * 1000) / 10 : 0 }))
    .sort((a, b) => b.total - a.total)

  const projects = Array.from(projectMap.values())
    .map(p => ({ ...p, share: grandTotal.total > 0 ? Math.round((p.total / grandTotal.total) * 1000) / 10 : 0 }))
    .sort((a, b) => b.total - a.total)

  const weekly = Array.from(weeklyMap.values()).sort((a, b) => a.week.localeCompare(b.week))

  return {
    records,
    weekly,
    creators,
    projects,
    grandTotal,
    lastUpdated: new Date().toISOString(),
  }
}
