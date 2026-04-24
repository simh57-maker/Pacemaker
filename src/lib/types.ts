export interface RawRecord {
  일시: string
  프로젝트: string
  제작자: string
  신규: number
  베리: number
}

export interface WeeklyData {
  week: string        // "2026-W17"
  weekLabel: string   // "4/20~4/26"
  신규: number
  베리: number
  total: number
}

export interface CreatorData {
  name: string
  신규: number
  베리: number
  total: number
  share: number       // % of grand total
  projects: Record<string, { 신규: number; 베리: number; total: number }>
}

export interface ProjectData {
  name: string
  신규: number
  베리: number
  total: number
  share: number
  creators: Record<string, { 신규: number; 베리: number; total: number }>
}

export interface DashboardData {
  records: RawRecord[]
  weekly: WeeklyData[]
  creators: CreatorData[]
  projects: ProjectData[]
  grandTotal: { 신규: number; 베리: number; total: number }
  lastUpdated: string
}
