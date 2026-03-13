'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, Upload, ImageIcon } from 'lucide-react'
import { usePillSearch } from '@/hooks/use-pill-search'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

// 검색 탭 타입
type SearchTab = 'text' | 'image'

// 의약품 검색 페이지
export default function PillSearchPage() {
  const [activeTab, setActiveTab] = useState<SearchTab>('text')
  const [searchQuery, setSearchQuery] = useState('')

  const { data: pills = [], isLoading } = usePillSearch(searchQuery)

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">
      {/* 페이지 헤더 */}
      <h1 className="text-xl font-bold text-gray-900">의약품 검색</h1>

      {/* 검색 입력창 */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="의약품명 검색..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      {/* 검색 탭 */}
      <div className="flex gap-2">
        <button
          onClick={() => setActiveTab('text')}
          className={cn(
            'flex-1 py-2 rounded-lg text-sm font-medium transition-colors',
            activeTab === 'text'
              ? 'bg-green-600 text-white'
              : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
          )}
        >
          텍스트 검색
        </button>
        <button
          onClick={() => setActiveTab('image')}
          className={cn(
            'flex-1 py-2 rounded-lg text-sm font-medium transition-colors',
            activeTab === 'image'
              ? 'bg-green-600 text-white'
              : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
          )}
        >
          이미지 검색
        </button>
      </div>

      {/* 텍스트 검색 결과 */}
      {activeTab === 'text' && (
        <div className="space-y-3">
          {isLoading && (
            <>
              <Skeleton className="h-20 rounded-xl" />
              <Skeleton className="h-20 rounded-xl" />
              <Skeleton className="h-20 rounded-xl" />
            </>
          )}

          {!isLoading && pills.length > 0 && (
            <>
              <p className="text-xs text-gray-400">{pills.length}개 결과</p>
              {pills.map((pill) => (
                <Link key={pill.item_seq} href={`/pills/${pill.item_seq}`}>
                  <div className="bg-white rounded-xl border border-gray-200 p-4 hover:border-green-300 hover:shadow-sm transition-all">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-sm font-semibold text-gray-900">{pill.item_name}</h3>
                        <p className="text-xs text-gray-500 mt-0.5">{pill.entp_name}</p>
                        <div className="flex gap-2 mt-2">
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
                </Link>
              ))}
            </>
          )}

          {!isLoading && searchQuery && pills.length === 0 && (
            <div className="text-center py-10 text-gray-400">
              <Search className="w-10 h-10 mx-auto mb-2 opacity-40" />
              <p className="text-sm">검색 결과가 없습니다</p>
            </div>
          )}

          {!searchQuery && (
            <div className="text-center py-10 text-gray-400">
              <Search className="w-10 h-10 mx-auto mb-2 opacity-40" />
              <p className="text-sm">의약품명을 입력하여 검색하세요</p>
            </div>
          )}
        </div>
      )}

      {/* 이미지 검색 영역 */}
      {activeTab === 'image' && (
        <div className="space-y-4">
          {/* 이미지 드롭존 */}
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-10 flex flex-col items-center justify-center gap-3 bg-white hover:border-green-400 transition-colors cursor-pointer">
            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center">
              <ImageIcon className="w-6 h-6 text-gray-400" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-gray-700">이미지를 업로드하세요</p>
              <p className="text-xs text-gray-400 mt-1">알약 사진을 찍거나 파일을 선택하세요</p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg transition-colors">
              <Upload className="w-4 h-4" />
              파일 선택
            </button>
          </div>

          {/* 안내 문구 */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-xs text-blue-700">
              AI 이미지 인식으로 알약을 자동 식별합니다. (ResNet50 기반, 5,087개 클래스)
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
