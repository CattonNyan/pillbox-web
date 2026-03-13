'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Search, ClipboardList, Calendar } from 'lucide-react'
import { cn } from '@/lib/utils'

// 하단 네비게이션 항목 타입
interface NavItem {
  href: string
  label: string
  icon: React.ReactNode
}

// 모바일 하단 네비게이션 항목 목록
const navItems: NavItem[] = [
  {
    href: '/dashboard',
    label: '홈',
    icon: <LayoutDashboard className="w-5 h-5" />,
  },
  {
    href: '/pills/search',
    label: '검색',
    icon: <Search className="w-5 h-5" />,
  },
  {
    href: '/schedules/new',
    label: '일정',
    icon: <ClipboardList className="w-5 h-5" />,
  },
  {
    href: '/calendar',
    label: '달력',
    icon: <Calendar className="w-5 h-5" />,
  },
]

// 모바일 하단 네비게이션 컴포넌트 (데스크탑에서는 숨김)
export default function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="flex md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 safe-area-pb">
      {navItems.map((item) => {
        const isActive = pathname === item.href
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex-1 flex flex-col items-center justify-center py-2 gap-0.5 text-xs font-medium transition-colors',
              isActive ? 'text-green-600' : 'text-gray-400 hover:text-gray-600'
            )}
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
