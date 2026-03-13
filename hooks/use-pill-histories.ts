'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { getTodaySchedule, togglePillTaken, createPillHistory } from '@/lib/api/pill-histories'
import type { PillHistory, ScheduleItem } from '@/types'
import { format } from 'date-fns'

const todayKey = () => format(new Date(), 'yyyy-MM-dd')

// 오늘의 복약 일정 조회
export function useTodaySchedule() {
  return useQuery({
    queryKey: ['today-schedule', todayKey()],
    queryFn: () => getTodaySchedule(),
  })
}

// 복약 완료 토글 (낙관적 업데이트)
export function useToggleTaken() {
  const queryClient = useQueryClient()
  const today = todayKey()

  return useMutation({
    mutationFn: ({
      scheduleItemId,
      taken,
    }: {
      scheduleItemId: string
      taken: boolean
    }) => {
      // scheduleItemId 형식: "{pillHistoryId}_{timeSlot}"
      const [pillHistoryId, timeSlot] = scheduleItemId.split('_')
      return togglePillTaken(pillHistoryId, timeSlot, taken, today)
    },

    // 낙관적 업데이트
    onMutate: async ({ scheduleItemId, taken }) => {
      await queryClient.cancelQueries({ queryKey: ['today-schedule', today] })

      const previous = queryClient.getQueryData<ScheduleItem[]>(['today-schedule', today])

      queryClient.setQueryData<ScheduleItem[]>(['today-schedule', today], (old) =>
        old?.map((item) =>
          item.id === scheduleItemId ? { ...item, isChecked: taken } : item
        ) ?? []
      )

      return { previous }
    },

    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['today-schedule', today], context.previous)
      }
      toast.error('복약 체크 업데이트에 실패했습니다.')
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['today-schedule', today] })
    },
  })
}

// 복약 이력 생성
export function useCreatePillHistory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: Omit<PillHistory, 'id'>) => createPillHistory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['today-schedule'] })
      queryClient.invalidateQueries({ queryKey: ['pill-histories'] })
      toast.success('복약 일정이 추가되었습니다.')
    },
    onError: () => {
      toast.error('복약 일정 추가에 실패했습니다.')
    },
  })
}
