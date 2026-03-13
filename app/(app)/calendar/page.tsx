'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useCalendarMonth } from '@/hooks/use-calendar'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

// 요일 레이블
const weekDays = ['일', '월', '화', '수', '목', '금', '토']

// 달력 페이지
export default function CalendarPage() {
  const today = new Date()
  const [currentYear, setCurrentYear] = useState(today.getFullYear())
  const [currentMonth, setCurrentMonth] = useState(today.getMonth() + 1) // 1-based
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  const { data: calendarData = new Map(), isLoading } = useCalendarMonth(currentYear, currentMonth)

  // 해당 월의 첫 번째 날 요일
  const firstDayOfMonth = new Date(currentYear, currentMonth - 1, 1).getDay()
  // 해당 월의 마지막 날
  const daysInMonth = new Date(currentYear, currentMonth, 0).getDate()

  // 이전 달 이동
  const goToPrevMonth = () => {
    if (currentMonth === 1) {
      setCurrentYear((y) => y - 1)
      setCurrentMonth(12)
    } else {
      setCurrentMonth((m) => m - 1)
    }
    setSelectedDate(null)
  }

  // 다음 달 이동
  const goToNextMonth = () => {
    if (currentMonth === 12) {
      setCurrentYear((y) => y + 1)
      setCurrentMonth(1)
    } else {
      setCurrentMonth((m) => m + 1)
    }
    setSelectedDate(null)
  }

  // 날짜 키 생성
  const getDateKey = (day: number) =>
    `${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`

  // 오늘 날짜 키
  const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`

  // 선택된 날짜 통계
  const selectedDayStats = selectedDate ? calendarData.get(selectedDate) : null

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">
      <h1 className="text-xl font-bold text-gray-900">복약 달력</h1>

      {/* 달력 카드 */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
        {/* 월 네비게이션 */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={goToPrevMonth}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h2 className="text-base font-semibold text-gray-900">
            {currentYear}년 {currentMonth}월
          </h2>
          <button
            onClick={goToNextMonth}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {isLoading ? (
          <Skeleton className="h-48 w-full rounded-lg" />
        ) : (
          <>
            {/* 요일 헤더 */}
            <div className="grid grid-cols-7 mb-2">
              {weekDays.map((day, idx) => (
                <div
                  key={day}
                  className={cn(
                    'text-center text-xs font-medium py-1',
                    idx === 0 ? 'text-red-400' : idx === 6 ? 'text-blue-400' : 'text-gray-400'
                  )}
                >
                  {day}
                </div>
              ))}
            </div>

            {/* 날짜 그리드 */}
            <div className="grid grid-cols-7">
              {/* 첫 주 빈 칸 */}
              {Array.from({ length: firstDayOfMonth }).map((_, idx) => (
                <div key={`empty-${idx}`} />
              ))}

              {/* 날짜 셀 */}
              {Array.from({ length: daysInMonth }).map((_, idx) => {
                const day = idx + 1
                const dateKey = getDateKey(day)
                const dayStats = calendarData.get(dateKey)
                const isToday = dateKey === todayKey
                const isSelected = dateKey === selectedDate
                const allTaken = dayStats && dayStats.taken >= dayStats.total
                const someTaken = dayStats && dayStats.taken > 0 && dayStats.taken < dayStats.total

                return (
                  <button
                    key={day}
                    onClick={() => setSelectedDate(dateKey === selectedDate ? null : dateKey)}
                    className={cn(
                      'flex flex-col items-center py-1.5 rounded-lg transition-colors',
                      isSelected && 'bg-green-50',
                      !isSelected && 'hover:bg-gray-50'
                    )}
                  >
                    <span
                      className={cn(
                        'text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full',
                        isToday && 'bg-green-600 text-white',
                        !isToday && isSelected && 'text-green-600',
                        !isToday && !isSelected && 'text-gray-700'
                      )}
                    >
                      {day}
                    </span>
                    {/* 상태 점 */}
                    {allTaken && <div className="w-1.5 h-1.5 rounded-full mt-0.5 bg-green-500" />}
                    {someTaken && <div className="w-1.5 h-1.5 rounded-full mt-0.5 bg-red-400" />}
                    {!dayStats && <div className="w-1.5 h-1.5 mt-0.5" />}
                  </button>
                )
              })}
            </div>
          </>
        )}

        {/* 범례 */}
        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-xs text-gray-500">모두 복약</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-red-400" />
            <span className="text-xs text-gray-500">일부 미복약</span>
          </div>
        </div>
      </div>

      {/* 선택된 날짜 통계 */}
      {selectedDate && (
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">
            {selectedDate.replace(/-/g, '. ')} 복약 현황
          </h3>

          {selectedDayStats ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">복약 완료</span>
                <span className={cn(
                  'text-sm font-bold',
                  selectedDayStats.taken >= selectedDayStats.total ? 'text-green-600' : 'text-red-500'
                )}>
                  {selectedDayStats.taken} / {selectedDayStats.total}
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div
                  className={cn(
                    'h-2 rounded-full transition-all',
                    selectedDayStats.taken >= selectedDayStats.total ? 'bg-green-500' : 'bg-red-400'
                  )}
                  style={{ width: `${Math.round((selectedDayStats.taken / selectedDayStats.total) * 100)}%` }}
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">
                {selectedDayStats.taken >= selectedDayStats.total
                  ? '모든 약을 복약했습니다.'
                  : `${selectedDayStats.total - selectedDayStats.taken}회 미복약`}
              </p>
            </div>
          ) : (
            <p className="text-sm text-gray-400">이 날은 복약 기록이 없습니다.</p>
          )}
        </div>
      )}
    </div>
  )
}
