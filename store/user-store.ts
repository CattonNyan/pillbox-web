import { create } from 'zustand'
import type { User, PresetTimes } from '@/types'

// 사용자 스토어 상태 타입
interface UserState {
  user: User | null
  presetTimes: PresetTimes
  isOnboarded: boolean
  // 사용자 정보 설정
  setUser: (user: User) => void
  // 프리셋 시간 업데이트
  setPresetTimes: (times: PresetTimes) => void
  // 온보딩 완료 처리
  setOnboarded: (value: boolean) => void
}

// 기본 복약 시간 프리셋
const defaultPresetTimes: PresetTimes = {
  morning: '08:00',
  lunch: '12:00',
  dinner: '18:00',
  bedtime: '22:00',
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  presetTimes: defaultPresetTimes,
  isOnboarded: false,

  setUser: (user) => set({ user }),

  setPresetTimes: (times) => set({ presetTimes: times }),

  setOnboarded: (value) => set({ isOnboarded: value }),
}))
