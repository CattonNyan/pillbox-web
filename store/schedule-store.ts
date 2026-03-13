import { create } from 'zustand'
import type { ScheduleItem } from '@/types'

// 스케줄 스토어 상태 타입
interface ScheduleState {
  schedules: ScheduleItem[]
  // 복약 체크 토글
  toggleCheck: (id: string) => void
  // 스케줄 목록 설정
  setSchedules: (schedules: ScheduleItem[]) => void
}

// 오늘의 복약 일정 목업 데이터
const mockSchedules: ScheduleItem[] = [
  {
    id: '1',
    pillName: '아스피린 100mg',
    itemSeq: '200001001',
    time: 'morning',
    isChecked: false,
  },
  {
    id: '2',
    pillName: '메트포르민 500mg',
    itemSeq: '200001002',
    time: 'morning',
    isChecked: false,
  },
  {
    id: '3',
    pillName: '오메프라졸 20mg',
    itemSeq: '200001003',
    time: 'lunch',
    isChecked: false,
  },
  {
    id: '4',
    pillName: '아스피린 100mg',
    itemSeq: '200001001',
    time: 'dinner',
    isChecked: false,
  },
]

export const useScheduleStore = create<ScheduleState>((set) => ({
  schedules: mockSchedules,

  toggleCheck: (id) =>
    set((state) => ({
      schedules: state.schedules.map((item) =>
        item.id === id ? { ...item, isChecked: !item.isChecked } : item
      ),
    })),

  setSchedules: (schedules) => set({ schedules }),
}))
