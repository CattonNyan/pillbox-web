'use client'

import { useMutation } from '@tanstack/react-query'
import { validateDrugCombination } from '@/lib/api/validation'
import type { ValidationResult } from '@/types'

export function useValidation() {
  return useMutation<ValidationResult, Error, string[]>({
    mutationFn: (itemSeqs: string[]) => validateDrugCombination(itemSeqs),
  })
}
