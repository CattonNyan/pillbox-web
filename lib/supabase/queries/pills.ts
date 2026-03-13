import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '../database.types'

export type PillInformationRow = Database['public']['Tables']['pill_information']['Row']

// 의약품 텍스트 검색 (pill_information 테이블 - 데이터 없으면 빈 배열 반환)
export async function searchPillInformation(
  supabase: SupabaseClient<Database>,
  query: string,
  limit = 20
): Promise<PillInformationRow[]> {
  if (!query.trim()) return []

  const { data, error } = await supabase
    .from('pill_information')
    .select('*')
    .ilike('item_name', `%${query}%`)
    .eq('is_active' as never, true)
    .limit(limit)

  if (error) {
    // 테이블 미존재 또는 데이터 없음 → 빈 배열 반환 (정상 동작)
    console.warn('pill_information query error:', error.message)
    return []
  }

  return (data ?? []) as unknown as PillInformationRow[]
}

// 의약품 단건 조회
export async function getPillByItemSeq(
  supabase: SupabaseClient<Database>,
  itemSeq: string
): Promise<PillInformationRow | null> {
  const { data, error } = await supabase
    .from('pill_information')
    .select('*')
    .eq('item_seq', itemSeq)
    .single()

  if (error) {
    console.warn('pill_information single query error:', error.message)
    return null
  }

  return data as unknown as PillInformationRow
}
