import { createClient } from '@/lib/supabase/client'
import type { Tables } from '@/lib/supabase/database.types'
import type { PillHistory, ScheduleItem } from '@/types'
import { format } from 'date-fns'

type PillHistoryRow = Tables<'pill_histories'>
type PillTakenRow = Pick<Tables<'pill_taken_records'>, 'pill_history_id' | 'time_slot'>
type CalendarHistoryRow = Pick<Tables<'pill_histories'>, 'id' | 'times' | 'start_date' | 'end_date'>
type CalendarTakenRow = Pick<Tables<'pill_taken_records'>, 'taken_date' | 'pill_history_id' | 'time_slot'>

// Supabase 행 → 앱 PillHistory 타입 변환
function mapToPillHistory(row: {
  id: string
  pill_name: string
  item_seq: string
  start_date: string
  end_date: string | null
  times: string[]
  is_active: boolean
}): PillHistory {
  return {
    id: row.id,
    pillName: row.pill_name,
    itemSeq: row.item_seq,
    startDate: row.start_date,
    endDate: row.end_date,
    times: row.times,
    isActive: row.is_active,
  }
}

// 복약 이력 목록 조회
export async function getPillHistories(params?: {
  isActive?: boolean
}): Promise<PillHistory[]> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  let query = supabase
    .from('pill_histories')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (params?.isActive !== undefined) {
    query = query.eq('is_active', params.isActive)
  }

  const { data, error } = await query
  if (error) throw error
  return ((data ?? []) as unknown as PillHistoryRow[]).map(mapToPillHistory)
}

// 복약 이력 생성
export async function createPillHistory(
  data: Omit<PillHistory, 'id'>
): Promise<PillHistory> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: created, error } = await (supabase.from('pill_histories') as any)
    .insert({
      user_id: user.id,
      pill_name: data.pillName,
      item_seq: data.itemSeq,
      start_date: data.startDate,
      end_date: data.endDate ?? null,
      times: data.times,
      is_active: data.isActive,
    })
    .select()
    .single()

  if (error) throw error
  return mapToPillHistory(created as unknown as PillHistoryRow)
}

// 오늘의 복약 일정 조회 (pill_histories + pill_taken_records 조인)
export async function getTodaySchedule(date?: string): Promise<ScheduleItem[]> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const today = date ?? format(new Date(), 'yyyy-MM-dd')

  // 활성 복약 이력 조회 (오늘이 기간 내)
  const { data: histories, error: histError } = await supabase
    .from('pill_histories')
    .select('*')
    .eq('user_id', user.id)
    .eq('is_active', true)
    .lte('start_date', today)
    .or(`end_date.is.null,end_date.gte.${today}`)

  if (histError) throw histError
  if (!histories || histories.length === 0) return []

  const typedHistories = histories as unknown as PillHistoryRow[]

  // 오늘 복약 완료 기록 조회
  const historyIds = typedHistories.map((h) => h.id)
  const { data: takenRecords, error: takenError } = await supabase
    .from('pill_taken_records')
    .select('pill_history_id, time_slot')
    .eq('user_id', user.id)
    .eq('taken_date', today)
    .in('pill_history_id', historyIds)

  if (takenError) throw takenError

  const takenSet = new Set(
    ((takenRecords ?? []) as unknown as PillTakenRow[]).map((r) => `${r.pill_history_id}_${r.time_slot}`)
  )

  // ScheduleItem 배열 생성
  const items: ScheduleItem[] = []
  for (const history of typedHistories) {
    for (const time of history.times) {
      items.push({
        id: `${history.id}_${time}`,
        pillName: history.pill_name,
        itemSeq: history.item_seq,
        time: time as ScheduleItem['time'],
        isChecked: takenSet.has(`${history.id}_${time}`),
      })
    }
  }

  return items
}

// 복약 완료 토글 (upsert / delete)
export async function togglePillTaken(
  pillHistoryId: string,
  timeSlot: string,
  taken: boolean,
  date?: string
): Promise<void> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const today = date ?? format(new Date(), 'yyyy-MM-dd')

  if (taken) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase.from('pill_taken_records') as any).upsert({
      user_id: user.id,
      pill_history_id: pillHistoryId,
      taken_date: today,
      time_slot: timeSlot,
    }, { onConflict: 'pill_history_id,taken_date,time_slot' })
    if (error) throw error
  } else {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase.from('pill_taken_records') as any)
      .delete()
      .eq('user_id', user.id)
      .eq('pill_history_id', pillHistoryId)
      .eq('taken_date', today)
      .eq('time_slot', timeSlot)
    if (error) throw error
  }
}

// 월별 복약 통계 조회
export async function getMonthlyCalendar(
  year: number,
  month: number
): Promise<Map<string, { total: number; taken: number }>> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return new Map()

  const startDate = `${year}-${String(month).padStart(2, '0')}-01`
  const endDate = `${year}-${String(month).padStart(2, '0')}-${new Date(year, month, 0).getDate()}`

  // 해당 월 활성 복약 이력
  const { data: histories } = await supabase
    .from('pill_histories')
    .select('id, times, start_date, end_date')
    .eq('user_id', user.id)
    .eq('is_active', true)
    .lte('start_date', endDate)
    .or(`end_date.is.null,end_date.gte.${startDate}`)

  // 해당 월 복약 기록
  const { data: records } = await supabase
    .from('pill_taken_records')
    .select('taken_date, time_slot, pill_history_id')
    .eq('user_id', user.id)
    .gte('taken_date', startDate)
    .lte('taken_date', endDate)

  const typedRecords = ((records ?? []) as unknown as CalendarTakenRow[])
  const typedHistoriesC = ((histories ?? []) as unknown as CalendarHistoryRow[])

  const takenMap = new Map<string, Set<string>>()
  for (const record of typedRecords) {
    const key = record.taken_date
    if (!takenMap.has(key)) takenMap.set(key, new Set())
    takenMap.get(key)!.add(`${record.pill_history_id}_${record.time_slot}`)
  }

  const result = new Map<string, { total: number; taken: number }>()

  // 각 날짜별 total/taken 계산
  const daysInMonth = new Date(year, month, 0).getDate()
  for (let day = 1; day <= daysInMonth; day++) {
    const dateKey = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    let total = 0
    const taken = takenMap.get(dateKey)?.size ?? 0

    for (const history of typedHistoriesC) {
      const inRange =
        history.start_date <= dateKey &&
        (history.end_date == null || history.end_date >= dateKey)
      if (inRange) {
        total += history.times.length
      }
    }

    if (total > 0) {
      result.set(dateKey, { total, taken })
    }
  }

  return result
}
