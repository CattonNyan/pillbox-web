import type { ValidationResult } from '@/types'

// 약물 병용 금기 검사 - 목업 결과 반환
export async function validateDrugCombination(_itemSeqs: string[]): Promise<ValidationResult> {
  // TODO: 실제 API 연동 예정 (POST /pillbox/users/validation)
  return {
    isValid: true,
    warnings: [],
  }
}
