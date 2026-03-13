'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { useUserStore } from '@/store/user-store'
import { upsertUserProfile } from '@/lib/api/users'
import { toast } from 'sonner'

// 프로필 폼 유효성 검사 스키마
const profileSchema = z.object({
  name: z.string().min(1, '이름을 입력해주세요').max(50, '이름이 너무 깁니다'),
  birthDate: z.string().min(1, '생년월일을 선택해주세요'),
  gender: z.enum(['male', 'female'], { required_error: '성별을 선택해주세요' }),
  hasHypertension: z.boolean(),
  hasDiabetes: z.boolean(),
  isPregnant: z.boolean(),
})

type ProfileFormValues = z.infer<typeof profileSchema>

// 온보딩 프로필 입력 페이지
export default function OnboardingProfilePage() {
  const router = useRouter()
  const { setUser } = useUserStore()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      hasHypertension: false,
      hasDiabetes: false,
      isPregnant: false,
    },
  })

  // 폼 제출 핸들러 - Supabase upsert
  const onSubmit = async (data: ProfileFormValues) => {
    try {
      await upsertUserProfile(data)
      setUser({ id: '', ...data })
      router.push('/onboarding/preset-times')
    } catch {
      toast.error('프로필 저장에 실패했습니다. 다시 시도해주세요.')
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 py-8">
      {/* 단계 표시 */}
      <div className="flex items-center gap-2 mb-6">
        <span className="text-xs font-medium text-green-600 bg-green-50 px-2.5 py-1 rounded-full">
          1 / 2
        </span>
        <span className="text-sm text-gray-500">프로필 설정</span>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h1 className="text-lg font-bold text-gray-900 mb-1">기본 정보 입력</h1>
        <p className="text-sm text-gray-500 mb-6">약물 안전 복용을 위한 기본 정보를 입력해주세요</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* 이름 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              이름
            </label>
            <input
              {...register('name')}
              type="text"
              placeholder="이름을 입력해주세요"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            {errors.name && (
              <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* 생년월일 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              생년월일
            </label>
            <input
              {...register('birthDate')}
              type="date"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            {errors.birthDate && (
              <p className="text-xs text-red-500 mt-1">{errors.birthDate.message}</p>
            )}
          </div>

          {/* 성별 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              성별
            </label>
            <div className="flex gap-3">
              <label className="flex-1 flex items-center justify-center gap-2 border border-gray-300 rounded-lg py-2.5 cursor-pointer has-[:checked]:border-green-500 has-[:checked]:bg-green-50 transition-colors">
                <input {...register('gender')} type="radio" value="male" className="hidden" />
                <span className="text-sm font-medium text-gray-700">남성</span>
              </label>
              <label className="flex-1 flex items-center justify-center gap-2 border border-gray-300 rounded-lg py-2.5 cursor-pointer has-[:checked]:border-green-500 has-[:checked]:bg-green-50 transition-colors">
                <input {...register('gender')} type="radio" value="female" className="hidden" />
                <span className="text-sm font-medium text-gray-700">여성</span>
              </label>
            </div>
            {errors.gender && (
              <p className="text-xs text-red-500 mt-1">{errors.gender.message}</p>
            )}
          </div>

          {/* 건강 상태 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              건강 상태 (해당 항목 선택)
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  {...register('hasHypertension')}
                  type="checkbox"
                  className="w-4 h-4 accent-green-600"
                />
                <span className="text-sm text-gray-700">고혈압</span>
              </label>
              <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  {...register('hasDiabetes')}
                  type="checkbox"
                  className="w-4 h-4 accent-green-600"
                />
                <span className="text-sm text-gray-700">당뇨</span>
              </label>
              <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  {...register('isPregnant')}
                  type="checkbox"
                  className="w-4 h-4 accent-green-600"
                />
                <span className="text-sm text-gray-700">임신</span>
              </label>
            </div>
          </div>

          {/* 다음 버튼 */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white rounded-lg font-medium text-sm transition-colors"
          >
            다음
          </button>
        </form>
      </div>
    </div>
  )
}
