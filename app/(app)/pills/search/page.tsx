'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, Upload, Image } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { PillInfo } from '@/types'

// 검색 탭 타입
type SearchTab = 'text' | 'image'

// 목업 의약품 데이터
const mockPills: PillInfo[] = [
  {
    itemSeq: '200001001',
    itemName: '타이레놀 500mg',
    entpName: '한국얀센(주)',
    className: '해열.진통.소염제',
    etcOtcName: '일반의약품',
    itemImage: null,
    efcyQesitm: '발열, 두통, 치통, 근육통, 생리통에 효과적입니다.',
    useMethodQesitm: '1회 1~2정, 1일 3~4회 복용하세요.',
    atpnQesitm: '간질환, 신장질환 환자는 복용 전 의사와 상담하세요.',
  },
  {
    itemSeq: '200001002',
    itemName: '아스피린 100mg',
    entpName: '바이엘코리아(주)',
    className: '혈액응고저지제',
    etcOtcName: '전문의약품',
    itemImage: null,
    efcyQesitm: '혈전 생성 억제, 심근경색 예방에 사용됩니다.',
    useMethodQesitm: '1일 1회 1정 복용하세요.',
    atpnQesitm: '위장장애가 있는 경우 식후 복용을 권장합니다.',
  },
  {
    itemSeq: '200001003',
    itemName: '오메프라졸 20mg',
    entpName: '한미약품(주)',
    className: '소화성궤양용제',
    etcOtcName: '전문의약품',
    itemImage: null,
    efcyQesitm: '위산 억제, 위궤양 및 역류성 식도염 치료에 사용됩니다.',
    useMethodQesitm: '1일 1회 식전 30분에 복용하세요.',
    atpnQesitm: '장기 복용 시 의사와 상담하세요.',
  },
  {
    itemSeq: '200001004',
    itemName: '메트포르민 500mg',
    entpName: '동아에스티(주)',
    className: '당뇨병용제',
    etcOtcName: '전문의약품',
    itemImage: null,
    efcyQesitm: '제2형 당뇨병 치료에 사용됩니다.',
    useMethodQesitm: '1회 1정, 1일 2~3회 식후 복용하세요.',
    atpnQesitm: '신기능 저하 환자는 복용 금지입니다.',
  },
]

// 의약품 검색 페이지
export default function PillSearchPage() {
  const [activeTab, setActiveTab] = useState<SearchTab>('text')
  const [searchQuery, setSearchQuery] = useState('')

  // 검색어로 필터링
  const filteredPills = mockPills.filter(
    (pill) =>
      pill.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pill.entpName.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">
      {/* 페이지 헤더 */}
      <h1 className="text-xl font-bold text-gray-900">의약품 검색</h1>

      {/* 검색 입력창 */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="의약품명 또는 제조사 검색..."
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
          {filteredPills.length > 0 ? (
            <>
              <p className="text-xs text-gray-400">{filteredPills.length}개 결과</p>
              {filteredPills.map((pill) => (
                <Link key={pill.itemSeq} href={`/pills/${pill.itemSeq}`}>
                  <div className="bg-white rounded-xl border border-gray-200 p-4 hover:border-green-300 hover:shadow-sm transition-all">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-sm font-semibold text-gray-900">{pill.itemName}</h3>
                        <p className="text-xs text-gray-500 mt-0.5">{pill.entpName}</p>
                        <div className="flex gap-2 mt-2">
                          <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full">
                            {pill.className}
                          </span>
                          <span className="text-xs bg-gray-50 text-gray-500 px-2 py-0.5 rounded-full">
                            {pill.etcOtcName}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </>
          ) : (
            <div className="text-center py-10 text-gray-400">
              <Search className="w-10 h-10 mx-auto mb-2 opacity-40" />
              <p className="text-sm">검색 결과가 없습니다</p>
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
              <Image className="w-6 h-6 text-gray-400" />
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
