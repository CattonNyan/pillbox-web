'use client'

import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import Link from 'next/link'
import { Plus, CheckCircle2, Circle } from 'lucide-react'
import { useTodaySchedule, useToggleTaken } from '@/hooks/use-pill-histories'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import type { ScheduleItem } from '@/types'

// 복약 시간 한국어 레이블
const timeLabels: Record<ScheduleItem['time'], string> = {
  morning: '아침',
  lunch: '점심',
  dinner: '저녁',
  bedtime: '자기 전',
}

// 복약 시간 순서
const timeOrder: ScheduleItem['time'][] = ['morning', 'lunch', 'dinner', 'bedtime']

// 대시보드 페이지 - 오늘의 복약 현황
export default function DashboardPage() {
  const { data: schedules = [], isLoading } = useTodaySchedule()
  const toggleTaken = useToggleTaken()

  // 오늘 날짜 포맷
  const today = format(new Date(), 'M월 d일 (EEE)', { locale: ko })

  // 복약 완료 통계
  const checkedCount = schedules.filter((s) => s.isChecked).length
  const totalCount = schedules.length
  const progressPercent = totalCount > 0 ? Math.round((checkedCount / totalCount) * 100) : 0

  // 시간대별 그룹핑
  const groupedSchedules = timeOrder.reduce<Record<string, ScheduleItem[]>>(
    (acc, time) => {
      acc[time] = schedules.filter((s) => s.time === time)
      return acc
    },
    {} as Record<string, ScheduleItem[]>
  )

  const handleToggle = (item: ScheduleItem) => {
    toggleTaken.mutate({ scheduleItemId: item.id, taken: !item.isChecked })
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">
      {/* 헤더 */}
      <div>
        <p className="text-sm text-gray-500">{today}</p>
        <h1 className="text-xl font-bold text-gray-900 mt-0.5">오늘의 복약</h1>
      </div>

      {/* 복약 진행률 카드 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-gray-700">복약 완료</span>
          <span className="text-sm font-bold text-green-600">
            {checkedCount} / {totalCount}
          </span>
        </div>
        {/* 진행률 바 */}
        <div className="w-full bg-gray-100 rounded-full h-2.5">
          <div
            className="bg-green-600 h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <p className="text-xs text-gray-400 mt-2 text-right">{progressPercent}% 완료</p>
      </div>

      {/* 로딩 상태 */}
      {isLoading && (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-14 w-full rounded-xl" />
          ))}
        </div>
      )}

      {/* 복약 없음 */}
      {!isLoading && totalCount === 0 && (
        <div className="text-center py-10 text-gray-400">
          <p className="text-sm">오늘 복약 일정이 없습니다.</p>
        </div>
      )}

      {/* 시간대별 복약 목록 */}
      {!isLoading && timeOrder.map((time) => {
        const items = groupedSchedules[time]
        if (items.length === 0) return null

        return (
          <div key={time}>
            {/* 시간대 헤더 */}
            <h2 className="text-sm font-semibold text-gray-500 mb-2 px-1">
              {timeLabels[time]}
            </h2>

            {/* 약 목록 */}
            <div className="space-y-2">
              {items.map((item) => (
                <div
                  key={item.id}
                  className={cn(
                    'bg-white rounded-xl border border-gray-200 px-4 py-3 flex items-center gap-3 transition-colors',
                    item.isChecked && 'bg-green-50 border-green-200'
                  )}
                >
                  {/* 체크 버튼 */}
                  <button
                    onClick={() => handleToggle(item)}
                    disabled={toggleTaken.isPending}
                    className={cn(
                      'flex-shrink-0 transition-colors',
                      item.isChecked ? 'text-green-600' : 'text-gray-300 hover:text-gray-400'
                    )}
                  >
                    {item.isChecked ? (
                      <CheckCircle2 className="w-6 h-6" />
                    ) : (
                      <Circle className="w-6 h-6" />
                    )}
                  </button>

                  {/* 약 이름 */}
                  <span
                    className={cn(
                      'text-sm font-medium',
                      item.isChecked ? 'text-gray-400 line-through' : 'text-gray-900'
                    )}
                  >
                    {item.pillName}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )
      })}

      {/* 복약 일정 추가 버튼 */}
      <Link
        href="/schedules/new"
        className="flex items-center justify-center gap-2 w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium text-sm transition-colors"
      >
        <Plus className="w-4 h-4" />
        복약 일정 추가
      </Link>
    </div>
  )
}
