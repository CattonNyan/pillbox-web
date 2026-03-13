'use client'

import Link from 'next/link'
import { use } from 'react'
import { ArrowLeft, Plus, AlertTriangle, Building2, Pill } from 'lucide-react'
import type { PillInfo } from '@/types'

// 목업 의약품 상세 데이터
const mockPillDetails: Record<string, PillInfo> = {
  '200001001': {
    itemSeq: '200001001',
    itemName: '타이레놀 500mg',
    entpName: '한국얀센(주)',
    className: '해열.진통.소염제',
    etcOtcName: '일반의약품',
    itemImage: null,
    efcyQesitm:
      '발열, 두통, 치통, 근육통, 생리통, 관절통에 효과적입니다. 감기로 인한 발열에도 사용됩니다.',
    useMethodQesitm:
      '성인 및 15세 이상: 1회 1~2정, 1일 3~4회 필요 시 복용하세요. 4~6시간 간격을 두고 복용하며, 1일 최대 8정(4,000mg)을 초과하지 마세요.',
    atpnQesitm:
      '간질환, 신장질환, 알코올 의존 환자는 복용 전 의사와 상담하세요. 다른 해열진통제와 동시 복용을 피하세요.',
  },
  '200001002': {
    itemSeq: '200001002',
    itemName: '아스피린 100mg',
    entpName: '바이엘코리아(주)',
    className: '혈액응고저지제',
    etcOtcName: '전문의약품',
    itemImage: null,
    efcyQesitm:
      '혈전 생성 억제, 심근경색 및 뇌졸중 예방에 사용됩니다. 혈소판 응집 억제 작용을 합니다.',
    useMethodQesitm: '1일 1회 1정 복용하세요. 식사와 함께 또는 식후에 복용을 권장합니다.',
    atpnQesitm:
      '위장출혈 병력이 있는 환자는 주의하세요. 수술 전 7~10일 전에는 복용을 중단하세요. 임산부는 복용 전 반드시 의사와 상담하세요.',
  },
  '200001003': {
    itemSeq: '200001003',
    itemName: '오메프라졸 20mg',
    entpName: '한미약품(주)',
    className: '소화성궤양용제',
    etcOtcName: '전문의약품',
    itemImage: null,
    efcyQesitm:
      '위산 과다 분비 억제, 위궤양, 십이지장 궤양, 역류성 식도염 치료에 사용됩니다.',
    useMethodQesitm: '1일 1회 식전 30분에 복용하세요. 알약을 씹거나 분쇄하지 마세요.',
    atpnQesitm:
      '장기 복용 시 마그네슘 수치 저하 가능성이 있습니다. 정기적으로 의사와 상담하세요.',
  },
  '200001004': {
    itemSeq: '200001004',
    itemName: '메트포르민 500mg',
    entpName: '동아에스티(주)',
    className: '당뇨병용제',
    etcOtcName: '전문의약품',
    itemImage: null,
    efcyQesitm: '제2형 당뇨병 혈당 조절에 사용됩니다. 인슐린 감수성을 높입니다.',
    useMethodQesitm: '1회 1정, 1일 2~3회 식후 복용하세요. 위장 부작용 최소화를 위해 식사 중 복용을 권장합니다.',
    atpnQesitm:
      '신기능 저하(eGFR < 30) 환자는 복용 금지입니다. 조영제 검사 전 48시간 전에 복용을 중단하세요.',
  },
}

// 의약품 상세 페이지
export default function PillDetailPage({
  params,
}: {
  params: Promise<{ itemSeq: string }>
}) {
  const { itemSeq } = use(params)

  // 해당 의약품 정보 조회 (목업)
  const pill = mockPillDetails[itemSeq] ?? {
    itemSeq,
    itemName: `의약품 ${itemSeq}`,
    entpName: '제조사 정보 없음',
    className: '분류 없음',
    etcOtcName: '분류 없음',
    itemImage: null,
    efcyQesitm: '효능/효과 정보가 없습니다.',
    useMethodQesitm: '용법/용량 정보가 없습니다.',
    atpnQesitm: '주의사항 정보가 없습니다.',
  }

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

      {/* 의약품 기본 정보 */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-start gap-4">
          {/* 의약품 아이콘 */}
          <div className="w-14 h-14 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0">
            <Pill className="w-7 h-7 text-green-600" />
          </div>

          <div className="flex-1">
            <h1 className="text-lg font-bold text-gray-900">{pill.itemName}</h1>
            <div className="flex items-center gap-1.5 mt-1 text-sm text-gray-500">
              <Building2 className="w-3.5 h-3.5" />
              <span>{pill.entpName}</span>
            </div>
            <div className="flex gap-2 mt-2.5">
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

      {/* 효능/효과 */}
      {pill.efcyQesitm && (
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-2">효능/효과</h2>
          <p className="text-sm text-gray-600 leading-relaxed">{pill.efcyQesitm}</p>
        </div>
      )}

      {/* 용법/용량 */}
      {pill.useMethodQesitm && (
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-2">용법/용량</h2>
          <p className="text-sm text-gray-600 leading-relaxed">{pill.useMethodQesitm}</p>
        </div>
      )}

      {/* 주의사항 */}
      {pill.atpnQesitm && (
        <div className="bg-amber-50 rounded-xl border border-amber-200 p-5">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <h2 className="text-sm font-semibold text-amber-900">주의사항</h2>
          </div>
          <p className="text-sm text-amber-700 leading-relaxed">{pill.atpnQesitm}</p>
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
    </div>
  )
}
