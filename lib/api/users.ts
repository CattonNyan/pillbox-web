import { createClient } from '@/lib/supabase/client'
import type { Tables } from '@/lib/supabase/database.types'
import type { User, PresetTimes } from '@/types'

type ProfileRow = Tables<'profiles'>
type PresetRow = Pick<Tables<'profiles'>, 'preset_morning' | 'preset_lunch' | 'preset_dinner' | 'preset_bedtime'>

// Supabase profiles 행 → 앱 User 타입 변환
function mapProfileToUser(profile: {
  id: string
  name: string
  birth_date: string
  gender: 'male' | 'female'
  has_hypertension: boolean
  has_diabetes: boolean
  is_pregnant: boolean
}): User {
  return {
    id: profile.id,
    name: profile.name,
    birthDate: profile.birth_date,
    gender: profile.gender,
    hasHypertension: profile.has_hypertension,
    hasDiabetes: profile.has_diabetes,
    isPregnant: profile.is_pregnant,
  }
}

// 현재 사용자 프로필 조회
export async function getUserProfile(): Promise<User | null> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (error || !data) return null
  return mapProfileToUser(data as unknown as ProfileRow)
}

// 사용자 프로필 upsert (온보딩 1단계)
export async function upsertUserProfile(data: Omit<User, 'id'>): Promise<void> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.from('profiles') as any).upsert({
    id: user.id,
    name: data.name,
    birth_date: data.birthDate,
    gender: data.gender,
    has_hypertension: data.hasHypertension,
    has_diabetes: data.hasDiabetes,
    is_pregnant: data.isPregnant,
    updated_at: new Date().toISOString(),
  })

  if (error) throw error
}

// 복약 시간 프리셋 업데이트 + 온보딩 완료 처리
export async function updatePresetTimes(
  times: PresetTimes,
  markOnboarded = false
): Promise<void> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.from('profiles') as any).upsert({
    id: user.id,
    preset_morning: times.morning,
    preset_lunch: times.lunch,
    preset_dinner: times.dinner,
    preset_bedtime: times.bedtime,
    ...(markOnboarded ? { is_onboarded: true } : {}),
    updated_at: new Date().toISOString(),
  })

  if (error) throw error
}

// 프리셋 시간 조회
export async function getPresetTimes(): Promise<PresetTimes> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { morning: '08:00', lunch: '12:00', dinner: '18:00', bedtime: '22:00' }

  const { data } = await supabase
    .from('profiles')
    .select('preset_morning, preset_lunch, preset_dinner, preset_bedtime')
    .eq('id', user.id)
    .single()

  if (!data) return { morning: '08:00', lunch: '12:00', dinner: '18:00', bedtime: '22:00' }

  const row = data as unknown as PresetRow
  return {
    morning: row.preset_morning,
    lunch: row.preset_lunch,
    dinner: row.preset_dinner,
    bedtime: row.preset_bedtime,
  }
}
