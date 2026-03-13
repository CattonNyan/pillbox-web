'use client'

import { useState } from 'react'
import { Pill, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

// 로그인 페이지
export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)

  const handleGoogleLogin = async () => {
    setIsLoading(true)
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/api/auth/callback`,
        },
      })
      if (error) throw error
    } catch {
      toast.error('로그인에 실패했습니다. 다시 시도해주세요.')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* 로그인 카드 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          {/* 로고 영역 */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-green-600 rounded-2xl flex items-center justify-center mb-4">
              <Pill className="w-9 h-9 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">PillBox</h1>
            <p className="text-sm text-gray-500 mt-1">의약품 안전 복용 관리 서비스</p>
          </div>

          {/* 로그인 버튼 영역 */}
          <div className="space-y-3">
            {/* Google 로그인 버튼 */}
            <button
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
              ) : (
                <span className="w-5 h-5 flex items-center justify-center font-bold text-blue-500 text-lg leading-none">
                  G
                </span>
              )}
              Google로 로그인
            </button>
          </div>
        </div>

        {/* 하단 안내 문구 */}
        <p className="text-center text-xs text-gray-400 mt-4">
          식품의약품안전처 공공 API 기반 서비스
        </p>
      </div>
    </div>
  )
}
