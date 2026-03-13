'use client'

import { useQuery } from '@tanstack/react-query'
import { getMonthlyCalendar } from '@/lib/api/pill-histories'

export function useCalendarMonth(year: number, month: number) {
  return useQuery({
    queryKey: ['calendar', year, month],
    queryFn: () => getMonthlyCalendar(year, month),
    staleTime: 2 * 60 * 1000, // 2분 캐시
  })
}
