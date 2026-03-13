import { create } from 'zustand'
import type { ScheduleItem } from '@/types'

// 스케줄 스토어 상태 타입
interface ScheduleState {
  schedules: ScheduleItem[]
  // 스케줄 목록 설정
  setSchedules: (schedules: ScheduleItem[]) => void
}

export const useScheduleStore = create<ScheduleState>((set) => ({
  schedules: [],

  setSchedules: (schedules) => set({ schedules }),
}))
