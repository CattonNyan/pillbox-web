'use client'

import { Pill, User } from 'lucide-react'
import Link from 'next/link'

// 앱 헤더 컴포넌트
export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-40">
      {/* 로고 영역 */}
      <Link href="/dashboard" className="flex items-center gap-2">
        <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
          <Pill className="w-5 h-5 text-white" />
        </div>
        <span className="text-lg font-bold text-gray-900">PillBox</span>
      </Link>

      {/* 프로필 아이콘 */}
      <button className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors">
        <User className="w-5 h-5 text-gray-600" />
      </button>
    </header>
  )
}
