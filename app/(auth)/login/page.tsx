'use client'

import Link from 'next/link'
import { Pill } from 'lucide-react'

// 로그인 페이지
export default function LoginPage() {
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
            <button className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
              {/* Google 아이콘 (텍스트로 대체) */}
              <span className="w-5 h-5 flex items-center justify-center font-bold text-blue-500 text-lg leading-none">
                G
              </span>
              Google로 로그인
            </button>
          </div>

          {/* 구분선 */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs text-gray-400 bg-white px-2">
              또는
            </div>
          </div>

          {/* 개발용 바로가기 */}
          <Link
            href="/dashboard"
            className="w-full flex items-center justify-center px-4 py-2.5 text-sm font-medium text-green-600 border border-green-200 rounded-lg hover:bg-green-50 transition-colors"
          >
            개발용 바로가기
          </Link>
        </div>

        {/* 하단 안내 문구 */}
        <p className="text-center text-xs text-gray-400 mt-4">
          식품의약품안전처 공공 API 기반 서비스
        </p>
      </div>
    </div>
  )
}
