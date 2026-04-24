import { NextResponse } from 'next/server'
import { processData } from '@/lib/dataUtils'
import { RawRecord } from '@/lib/types'

const SHEET_ID = '1M1uuFJZRUpt4_2Xc_lQfjGEMOg1NPepOmks8Ad0OwCo'
const CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=0`

export const revalidate = 60 // cache 1 minute

export async function GET() {
  try {
    const res = await fetch(CSV_URL, { next: { revalidate: 60 } })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)

    const csv = await res.text()
    const lines = csv.trim().split('\n')
    const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''))

    const records: RawRecord[] = []
    for (let i = 1; i < lines.length; i++) {
      const vals = lines[i].split(',').map(v => v.trim().replace(/^"|"$/g, ''))
      if (vals.length < 5 || !vals[0]) continue
      records.push({
        일시: vals[0],
        프로젝트: vals[1],
        제작자: vals[2],
        신규: parseFloat(vals[3]) || 0,
        베리: parseFloat(vals[4]) || 0,
      })
    }

    const data = processData(records)
    return NextResponse.json(data)
  } catch (err) {
    console.error('Sheet fetch error:', err)
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 })
  }
}
