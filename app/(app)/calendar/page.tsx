'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

// 날짜별 복약 상태 타입
type DayStatus = 'all-taken' | 'some-missed' | 'none'

// 날짜 정보 타입
interface DayInfo {
  date: number
  status: DayStatus
  pills: string[]
}

// 목업 달력 데이터 생성 (현재 달 기준)
function generateMockCalendarData(year: number, month: number): Map<string, DayInfo> {
  const data = new Map<string, DayInfo>()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  // 목업 복약 데이터 생성
  for (let day = 1; day <= daysInMonth; day++) {
    const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    const random = (day * 7) % 10

    if (random < 4) {
      data.set(dateKey, {
        date: day,
        status: 'all-taken',
        pills: ['아스피린 100mg', '메트포르민 500mg'],
      })
    } else if (random < 7) {
      data.set(dateKey, {
        date: day,
        status: 'some-missed',
        pills: ['오메프라졸 20mg'],
      })
    }
  }

  return data
}

// 요일 레이블
const weekDays = ['일', '월', '화', '수', '목', '금', '토']

// 달력 페이지
export default function CalendarPage() {
  const today = new Date()
  const [currentYear, setCurrentYear] = useState(today.getFullYear())
  const [currentMonth, setCurrentMonth] = useState(today.getMonth())
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  // 목업 달력 데이터
  const calendarData = generateMockCalendarData(currentYear, currentMonth)

  // 해당 월의 첫 번째 날 요일
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay()
  // 해당 월의 마지막 날
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()

  // 이전 달 이동
  const goToPrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentYear((y) => y - 1)
      setCurrentMonth(11)
    } else {
      setCurrentMonth((m) => m - 1)
    }
    setSelectedDate(null)
  }

  // 다음 달 이동
  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentYear((y) => y + 1)
      setCurrentMonth(0)
    } else {
      setCurrentMonth((m) => m + 1)
    }
    setSelectedDate(null)
  }

  // 날짜 키 생성
  const getDateKey = (day: number) =>
    `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`

  // 오늘 날짜 키
  const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`

  // 선택된 날짜 정보
  const selectedDayInfo = selectedDate ? calendarData.get(selectedDate) : null

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
            {currentYear}년 {currentMonth + 1}월
          </h2>
          <button
            onClick={goToNextMonth}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>

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
            const dayInfo = calendarData.get(dateKey)
            const isToday = dateKey === todayKey
            const isSelected = dateKey === selectedDate

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
                {/* 날짜 숫자 */}
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
                {dayInfo && (
                  <div
                    className={cn(
                      'w-1.5 h-1.5 rounded-full mt-0.5',
                      dayInfo.status === 'all-taken' ? 'bg-green-500' : 'bg-red-400'
                    )}
                  />
                )}
                {!dayInfo && <div className="w-1.5 h-1.5 mt-0.5" />}
              </button>
            )
          })}
        </div>

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

      {/* 선택된 날짜 약 목록 */}
      {selectedDate && (
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">
            {selectedDate.replace(/-/g, '. ')} 복약 현황
          </h3>

          {selectedDayInfo ? (
            <div className="space-y-2">
              {selectedDayInfo.pills.map((pill, idx) => (
                <div
                  key={idx}
                  className={cn(
                    'flex items-center gap-2 px-3 py-2 rounded-lg text-sm',
                    selectedDayInfo.status === 'all-taken'
                      ? 'bg-green-50 text-green-700'
                      : 'bg-red-50 text-red-700'
                  )}
                >
                  <div
                    className={cn(
                      'w-1.5 h-1.5 rounded-full flex-shrink-0',
                      selectedDayInfo.status === 'all-taken' ? 'bg-green-500' : 'bg-red-400'
                    )}
                  />
                  {pill}
                </div>
              ))}
              <p className="text-xs text-gray-400 mt-2">
                {selectedDayInfo.status === 'all-taken'
                  ? '모든 약을 복약했습니다.'
                  : '일부 약을 복약하지 않았습니다.'}
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
