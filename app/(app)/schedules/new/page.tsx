'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, X, ChevronRight, CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react'
import { usePillAddStore } from '@/store/pill-add-store'
import { useCreatePillHistory } from '@/hooks/use-pill-histories'
import { useValidation } from '@/hooks/use-validation'
import { usePillSearch } from '@/hooks/use-pill-search'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'

// 복약 시간대 옵션
const timeOptions = [
  { value: 'morning', label: '아침' },
  { value: 'lunch', label: '점심' },
  { value: 'dinner', label: '저녁' },
  { value: 'bedtime', label: '자기 전' },
]

// 복약 일정 추가 페이지 (멀티스텝)
export default function NewSchedulePage() {
  const router = useRouter()
  const {
    step,
    selectedPills,
    startDate,
    endDate,
    selectedTimes,
    setStep,
    addPill,
    removePill,
    setStartDate,
    setEndDate,
    toggleTime,
    reset,
  } = usePillAddStore()

  const [searchQuery, setSearchQuery] = useState('')
  const createPillHistory = useCreatePillHistory()
  const validation = useValidation()

  // Supabase pill_information 검색
  const { data: searchResults = [], isLoading: isSearching } = usePillSearch(searchQuery)

  // 검색 결과에서 이미 선택된 약 제외
  const filteredPills = searchResults.filter(
    (pill) => !selectedPills.some((s) => s.itemSeq === pill.item_seq)
  )

  // 병용금기 검사 핸들러
  const handleValidate = () => {
    if (selectedPills.length === 0) return
    validation.mutate(selectedPills.map((p) => p.itemSeq))
  }

  // 등록 핸들러
  const handleSubmit = async () => {
    if (selectedPills.length === 0 || !startDate || selectedTimes.length === 0) return

    for (const pill of selectedPills) {
      await createPillHistory.mutateAsync({
        pillName: pill.itemName,
        itemSeq: pill.itemSeq,
        startDate,
        endDate: endDate || null,
        times: selectedTimes,
        isActive: true,
      })
    }

    reset()
    router.push('/dashboard')
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* 단계 표시 */}
      <div className="flex items-center gap-2 mb-6">
        <div className="flex gap-1.5">
          <div className={cn('w-2 h-2 rounded-full', step === 1 ? 'bg-green-600' : 'bg-gray-300')} />
          <div className={cn('w-2 h-2 rounded-full', step === 2 ? 'bg-green-600' : 'bg-gray-300')} />
        </div>
        <span className="text-sm text-gray-500">
          {step === 1 ? '약 선택' : '일정 설정'}
        </span>
      </div>

      {/* STEP 1: 약 선택 */}
      {step === 1 && (
        <div className="space-y-4">
          <h1 className="text-xl font-bold text-gray-900">약 선택</h1>

          {/* 선택된 약 태그 */}
          {selectedPills.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selectedPills.map((pill) => (
                <span
                  key={pill.itemSeq}
                  className="flex items-center gap-1.5 bg-green-50 text-green-700 text-xs font-medium px-3 py-1.5 rounded-full"
                >
                  {pill.itemName}
                  <button
                    onClick={() => removePill(pill.itemSeq)}
                    className="hover:text-green-900"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* 검색 입력창 */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="약 이름 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* 검색 결과 목록 */}
          <div className="space-y-2">
            {isSearching && (
              <>
                <Skeleton className="h-16 rounded-xl" />
                <Skeleton className="h-16 rounded-xl" />
              </>
            )}
            {!isSearching && filteredPills.map((pill) => (
              <button
                key={pill.item_seq}
                onClick={() => addPill({
                  itemSeq: pill.item_seq,
                  itemName: pill.item_name,
                  entpName: pill.entp_name,
                  className: pill.class_name,
                  etcOtcName: pill.etc_otc_name,
                  itemImage: pill.item_image,
                  efcyQesitm: pill.efcy_qesitm,
                  useMethodQesitm: pill.use_method_qesitm,
                  atpnQesitm: pill.atpn_qesitm,
                })}
                className="w-full flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:border-green-300 hover:bg-green-50 transition-colors text-left"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">{pill.item_name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{pill.entp_name}</p>
                </div>
                <span className="text-xs text-green-600 font-medium">추가</span>
              </button>
            ))}
            {!isSearching && searchQuery && filteredPills.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-4">검색 결과가 없습니다.</p>
            )}
          </div>

          {/* 다음 버튼 */}
          <button
            onClick={() => setStep(2)}
            disabled={selectedPills.length === 0}
            className={cn(
              'w-full flex items-center justify-center gap-2 py-3 rounded-xl font-medium text-sm transition-colors',
              selectedPills.length > 0
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            )}
          >
            다음
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* STEP 2: 일정 설정 */}
      {step === 2 && (
        <div className="space-y-5">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setStep(1)}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              ← 이전
            </button>
            <h1 className="text-xl font-bold text-gray-900">일정 설정</h1>
          </div>

          {/* 선택된 약 목록 */}
          <div className="bg-green-50 rounded-xl p-4">
            <p className="text-xs font-medium text-green-700 mb-2">선택된 약</p>
            <div className="flex flex-wrap gap-2">
              {selectedPills.map((pill) => (
                <span
                  key={pill.itemSeq}
                  className="text-xs text-green-800 bg-white px-2.5 py-1 rounded-full border border-green-200"
                >
                  {pill.itemName}
                </span>
              ))}
            </div>
          </div>

          {/* 복약 기간 */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
            <h2 className="text-sm font-semibold text-gray-900">복약 기간</h2>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1.5">시작일</label>
                <input
                  type="date"
                  value={startDate}
                  defaultValue={format(new Date(), 'yyyy-MM-dd')}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1.5">종료일 (선택)</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
          </div>

          {/* 복약 시간 선택 */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="text-sm font-semibold text-gray-900 mb-3">복약 시간</h2>
            <div className="grid grid-cols-2 gap-2">
              {timeOptions.map((option) => {
                const isSelected = selectedTimes.includes(option.value)
                return (
                  <button
                    key={option.value}
                    onClick={() => toggleTime(option.value)}
                    className={cn(
                      'py-2.5 rounded-lg text-sm font-medium transition-colors border',
                      isSelected
                        ? 'bg-green-600 text-white border-green-600'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-green-300'
                    )}
                  >
                    {option.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* 병용금기 검사 */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="text-sm font-semibold text-gray-900 mb-3">병용금기 검사</h2>
            <button
              onClick={handleValidate}
              disabled={validation.isPending}
              className="w-full flex items-center justify-center gap-2 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              {validation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  검사 중...
                </>
              ) : (
                '병용금기 검사하기'
              )}
            </button>

            {/* 검사 결과 */}
            {validation.data && (
              <div
                className={cn(
                  'mt-3 p-3 rounded-lg border',
                  validation.data.isValid
                    ? 'bg-green-50 border-green-200'
                    : 'bg-red-50 border-red-200'
                )}
              >
                {validation.data.isValid ? (
                  <div className="flex items-center gap-2 text-green-700">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="text-sm font-medium">병용금기 없음</span>
                  </div>
                ) : (
                  <div className="flex items-start gap-2 text-red-700">
                    <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium">주의가 필요합니다</p>
                      {validation.data.warnings.map((w, i) => (
                        <p key={i} className="text-xs mt-1">
                          {w.description}
                        </p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 등록 버튼 */}
          <button
            onClick={handleSubmit}
            disabled={selectedTimes.length === 0 || !startDate || createPillHistory.isPending}
            className={cn(
              'w-full py-3 rounded-xl font-medium text-sm transition-colors',
              selectedTimes.length > 0 && startDate && !createPillHistory.isPending
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            )}
          >
            {createPillHistory.isPending ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                등록 중...
              </span>
            ) : (
              '등록'
            )}
          </button>
        </div>
      )}
    </div>
  )
}
