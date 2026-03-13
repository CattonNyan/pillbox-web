import type { User, PresetTimes } from '@/types'

// 사용자 생성 - TODO: 실제 API 연동 예정
export async function createUser(_data: Omit<User, 'id'>): Promise<void> {
  console.log('TODO: createUser API 연동 예정')
}

// 사용자 프로필 조회 - 목업 데이터 반환
export async function getUserProfile(): Promise<User> {
  // TODO: 실제 API 연동 예정
  return {
    id: 'mock-user-1',
    name: '홍길동',
    birthDate: '1990-01-01',
    gender: 'male',
    hasHypertension: false,
    hasDiabetes: false,
    isPregnant: false,
  }
}

// 복약 시간 프리셋 업데이트 - TODO: 실제 API 연동 예정
export async function updatePresetTimes(_times: PresetTimes): Promise<void> {
  console.log('TODO: updatePresetTimes API 연동 예정')
}
