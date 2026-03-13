'use client'

import Link from 'next/link'
import { use } from 'react'
import { ArrowLeft, Plus, AlertTriangle, Building2, Pill } from 'lucide-react'
import { usePillDetail } from '@/hooks/use-pill-search'
import { Skeleton } from '@/components/ui/skeleton'

// 의약품 상세 페이지
export default function PillDetailPage({
  params,
}: {
  params: Promise<{ itemSeq: string }>
}) {
  const { itemSeq } = use(params)
  const { data: pill, isLoading } = usePillDetail(itemSeq)

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">
      {/* 뒤로가기 버튼 */}
      <Link
        href="/pills/search"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700"
      >
        <ArrowLeft className="w-4 h-4" />
        검색 결과로 돌아가기
      </Link>

      {/* 로딩 상태 */}
      {isLoading && (
        <>
          <Skeleton className="h-28 rounded-xl" />
          <Skeleton className="h-24 rounded-xl" />
          <Skeleton className="h-24 rounded-xl" />
        </>
      )}

      {/* 데이터 없음 */}
      {!isLoading && !pill && (
        <div className="text-center py-10 text-gray-400">
          <p className="text-sm">의약품 정보를 찾을 수 없습니다.</p>
        </div>
      )}

      {/* 의약품 상세 */}
      {!isLoading && pill && (
        <>
          {/* 의약품 기본 정보 */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <Pill className="w-7 h-7 text-green-600" />
              </div>

              <div className="flex-1">
                <h1 className="text-lg font-bold text-gray-900">{pill.item_name}</h1>
                <div className="flex items-center gap-1.5 mt-1 text-sm text-gray-500">
                  <Building2 className="w-3.5 h-3.5" />
                  <span>{pill.entp_name}</span>
                </div>
                <div className="flex gap-2 mt-2.5">
                  <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full">
                    {pill.class_name}
                  </span>
                  <span className="text-xs bg-gray-50 text-gray-500 px-2 py-0.5 rounded-full">
                    {pill.etc_otc_name}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 효능/효과 */}
          {pill.efcy_qesitm && (
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h2 className="text-sm font-semibold text-gray-900 mb-2">효능/효과</h2>
              <p className="text-sm text-gray-600 leading-relaxed">{pill.efcy_qesitm}</p>
            </div>
          )}

          {/* 용법/용량 */}
          {pill.use_method_qesitm && (
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h2 className="text-sm font-semibold text-gray-900 mb-2">용법/용량</h2>
              <p className="text-sm text-gray-600 leading-relaxed">{pill.use_method_qesitm}</p>
            </div>
          )}

          {/* 주의사항 */}
          {pill.atpn_qesitm && (
            <div className="bg-amber-50 rounded-xl border border-amber-200 p-5">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <h2 className="text-sm font-semibold text-amber-900">주의사항</h2>
              </div>
              <p className="text-sm text-amber-700 leading-relaxed">{pill.atpn_qesitm}</p>
            </div>
          )}

          {/* 복약 일정 추가 버튼 */}
          <Link
            href="/schedules/new"
            className="flex items-center justify-center gap-2 w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium text-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            복약 일정에 추가
          </Link>
        </>
      )}
    </div>
  )
}
