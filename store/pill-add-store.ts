import { create } from 'zustand'
import type { PillInfo } from '@/types'

// 약 추가 플로우 스토어 상태 타입
interface PillAddState {
  step: 1 | 2
  selectedPills: PillInfo[]
  startDate: string
  endDate: string
  selectedTimes: string[]
  // 단계 변경
  setStep: (step: 1 | 2) => void
  // 약 추가
  addPill: (pill: PillInfo) => void
  // 약 제거
  removePill: (itemSeq: string) => void
  // 시작일 설정
  setStartDate: (date: string) => void
  // 종료일 설정
  setEndDate: (date: string) => void
  // 복약 시간 토글
  toggleTime: (time: string) => void
  // 스토어 초기화
  reset: () => void
}

// 초기 상태
const initialState = {
  step: 1 as const,
  selectedPills: [],
  startDate: '',
  endDate: '',
  selectedTimes: [],
}

export const usePillAddStore = create<PillAddState>((set) => ({
  ...initialState,

  setStep: (step) => set({ step }),

  addPill: (pill) =>
    set((state) => {
      // 이미 추가된 약이면 무시
      if (state.selectedPills.some((p) => p.itemSeq === pill.itemSeq)) {
        return state
      }
      return { selectedPills: [...state.selectedPills, pill] }
    }),

  removePill: (itemSeq) =>
    set((state) => ({
      selectedPills: state.selectedPills.filter((p) => p.itemSeq !== itemSeq),
    })),

  setStartDate: (date) => set({ startDate: date }),

  setEndDate: (date) => set({ endDate: date }),

  toggleTime: (time) =>
    set((state) => {
      const isSelected = state.selectedTimes.includes(time)
      return {
        selectedTimes: isSelected
          ? state.selectedTimes.filter((t) => t !== time)
          : [...state.selectedTimes, time],
      }
    }),

  reset: () => set(initialState),
}))
