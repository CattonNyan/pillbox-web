import type { PillHistory } from '@/types'

// 복약 이력 조회 파라미터 타입
interface GetPillHistoriesParams {
  isActive?: boolean
  page?: number
  limit?: number
}

// 복약 이력 목업 데이터
const mockHistories: PillHistory[] = [
  {
    id: '1',
    pillName: '아스피린 100mg',
    itemSeq: '200001001',
    startDate: '2024-01-01',
    endDate: null,
    times: ['morning', 'dinner'],
    isActive: true,
  },
  {
    id: '2',
    pillName: '메트포르민 500mg',
    itemSeq: '200001002',
    startDate: '2024-01-15',
    endDate: null,
    times: ['morning'],
    isActive: true,
  },
  {
    id: '3',
    pillName: '오메프라졸 20mg',
    itemSeq: '200001003',
    startDate: '2024-02-01',
    endDate: '2024-03-01',
    times: ['lunch'],
    isActive: false,
  },
]

// 복약 이력 목록 조회 - 목업 데이터 반환
export async function getPillHistories(_params?: GetPillHistoriesParams): Promise<PillHistory[]> {
  // TODO: 실제 API 연동 예정
  return mockHistories
}

// 복약 이력 생성 - TODO: 실제 API 연동 예정
export async function createPillHistory(_data: Omit<PillHistory, 'id'>): Promise<void> {
  console.log('TODO: createPillHistory API 연동 예정')
}

// 복약 완료 체크 - TODO: 실제 API 연동 예정
export async function checkPillTaken(_historyId: string, _date: string): Promise<void> {
  console.log('TODO: checkPillTaken API 연동 예정')
}
