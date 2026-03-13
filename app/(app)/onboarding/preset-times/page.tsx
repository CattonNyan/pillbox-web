'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { Clock } from 'lucide-react'
import { useUserStore } from '@/store/user-store'

// 시간 형식 유효성 검사 (HH:mm)
const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/

// 프리셋 시간 폼 유효성 검사 스키마
const presetTimesSchema = z.object({
  morning: z.string().regex(timeRegex, '올바른 시간 형식을 입력해주세요 (HH:mm)'),
  lunch: z.string().regex(timeRegex, '올바른 시간 형식을 입력해주세요 (HH:mm)'),
  dinner: z.string().regex(timeRegex, '올바른 시간 형식을 입력해주세요 (HH:mm)'),
  bedtime: z.string().regex(timeRegex, '올바른 시간 형식을 입력해주세요 (HH:mm)'),
})

type PresetTimesFormValues = z.infer<typeof presetTimesSchema>

// 복약 시간 설정 항목
const timeFields = [
  { key: 'morning' as const, label: '아침', emoji: '🌅' },
  { key: 'lunch' as const, label: '점심', emoji: '☀️' },
  { key: 'dinner' as const, label: '저녁', emoji: '🌙' },
  { key: 'bedtime' as const, label: '자기 전', emoji: '🌛' },
]

// 온보딩 복약 시간 프리셋 설정 페이지
export default function OnboardingPresetTimesPage() {
  const router = useRouter()
  const { setPresetTimes, setOnboarded } = useUserStore()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PresetTimesFormValues>({
    resolver: zodResolver(presetTimesSchema),
    defaultValues: {
      morning: '08:00',
      lunch: '12:00',
      dinner: '18:00',
      bedtime: '22:00',
    },
  })

  // 폼 제출 핸들러
  const onSubmit = (data: PresetTimesFormValues) => {
    setPresetTimes(data)
    setOnboarded(true)
    router.push('/dashboard')
  }

  return (
    <div className="max-w-md mx-auto px-4 py-8">
      {/* 단계 표시 */}
      <div className="flex items-center gap-2 mb-6">
        <span className="text-xs font-medium text-green-600 bg-green-50 px-2.5 py-1 rounded-full">
          2 / 2
        </span>
        <span className="text-sm text-gray-500">복약 시간 설정</span>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-1">
          <Clock className="w-5 h-5 text-green-600" />
          <h1 className="text-lg font-bold text-gray-900">복약 시간 설정</h1>
        </div>
        <p className="text-sm text-gray-500 mb-6">
          각 복약 시간대의 기본 시간을 설정해주세요
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {timeFields.map((field) => (
            <div key={field.key}>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                <span className="mr-1">{field.emoji}</span>
                {field.label}
              </label>
              <input
                {...register(field.key)}
                type="time"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              {errors[field.key] && (
                <p className="text-xs text-red-500 mt-1">{errors[field.key]?.message}</p>
              )}
            </div>
          ))}

          {/* 완료 버튼 */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 mt-2 bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white rounded-lg font-medium text-sm transition-colors"
          >
            완료
          </button>
        </form>
      </div>
    </div>
  )
}
