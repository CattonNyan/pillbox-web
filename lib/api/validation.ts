import type { ValidationResult } from '@/types'

// 약물 병용 금기 검사 - Next.js API Route 프록시로 위임
export async function validateDrugCombination(itemSeqs: string[]): Promise<ValidationResult> {
  const response = await fetch('/api/validation', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ itemSeqs }),
  })

  if (!response.ok) {
    return { isValid: true, warnings: [] }
  }

  return response.json()
}
