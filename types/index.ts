// 사용자 정보 타입
export interface User {
  id: string
  name: string
  birthDate: string
  gender: 'male' | 'female'
  hasHypertension: boolean
  hasDiabetes: boolean
  isPregnant: boolean
}

// 의약품 정보 타입
export interface PillInfo {
  itemSeq: string
  itemName: string
  entpName: string
  className: string
  etcOtcName: string
  itemImage: string | null
  efcyQesitm: string | null
  useMethodQesitm: string | null
  atpnQesitm: string | null
}

// 복약 이력 타입
export interface PillHistory {
  id: string
  pillName: string
  itemSeq: string
  startDate: string
  endDate: string | null
  times: string[]
  isActive: boolean
}

// 오늘의 복약 일정 아이템 타입
export interface ScheduleItem {
  id: string
  pillName: string
  itemSeq: string
  time: 'morning' | 'lunch' | 'dinner' | 'bedtime'
  isChecked: boolean
}

// 복약 시간 프리셋 타입 (HH:mm 형식)
export interface PresetTimes {
  morning: string
  lunch: string
  dinner: string
  bedtime: string
}

// 약물 검증 결과 타입
export interface ValidationResult {
  isValid: boolean
  warnings: ValidationWarning[]
}

// 약물 검증 경고 타입
export interface ValidationWarning {
  type: string
  pillName1: string
  pillName2?: string
  description: string
}
