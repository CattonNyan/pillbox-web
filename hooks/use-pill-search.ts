'use client'

import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { searchPillInformation, getPillByItemSeq } from '@/lib/supabase/queries/pills'

// 의약품 텍스트 검색 (데이터 없으면 빈 배열)
export function usePillSearch(query: string) {
  return useQuery({
    queryKey: ['pill-search', query],
    queryFn: async () => {
      const supabase = createClient()
      return searchPillInformation(supabase, query)
    },
    enabled: query.trim().length > 0,
    staleTime: 5 * 60 * 1000, // 5분 캐시
  })
}

// 의약품 단건 조회
export function usePillDetail(itemSeq: string) {
  return useQuery({
    queryKey: ['pill-detail', itemSeq],
    queryFn: async () => {
      const supabase = createClient()
      return getPillByItemSeq(supabase, itemSeq)
    },
    enabled: !!itemSeq,
    staleTime: 10 * 60 * 1000, // 10분 캐시
  })
}
