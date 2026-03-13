'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Search, ClipboardList, Calendar, Pill } from 'lucide-react'
import { cn } from '@/lib/utils'

// 사이드바 네비게이션 항목 타입
interface NavItem {
  href: string
  label: string
  icon: React.ReactNode
}

// 네비게이션 항목 목록
const navItems: NavItem[] = [
  {
    href: '/dashboard',
    label: '대시보드',
    icon: <LayoutDashboard className="w-5 h-5" />,
  },
  {
    href: '/pills/search',
    label: '의약품 검색',
    icon: <Search className="w-5 h-5" />,
  },
  {
    href: '/schedules/new',
    label: '복약 일정',
    icon: <ClipboardList className="w-5 h-5" />,
  },
  {
    href: '/calendar',
    label: '달력',
    icon: <Calendar className="w-5 h-5" />,
  },
]

// 데스크탑 사이드바 컴포넌트 (모바일에서는 숨김)
export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 min-h-screen">
      {/* 로고 영역 */}
      <div className="px-6 py-5 border-b border-gray-200">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
            <Pill className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold text-gray-900">PillBox</span>
        </Link>
      </div>

      {/* 네비게이션 메뉴 */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-green-50 text-green-600'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              )}
            >
              <span className={cn(isActive ? 'text-green-600' : 'text-gray-400')}>
                {item.icon}
              </span>
              {item.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
