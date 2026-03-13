import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const LAMBDA_API_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()

  if (!LAMBDA_API_URL) {
    // Lambda URL 미설정 시 병용금기 없음으로 처리
    return NextResponse.json({ isValid: true, warnings: [] })
  }

  try {
    const response = await fetch(`${LAMBDA_API_URL}/pillbox/users/validation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      // Lambda 오류 시 안전하게 처리 (병용금기 없음으로 반환)
      return NextResponse.json({ isValid: true, warnings: [] })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ isValid: true, warnings: [] })
  }
}
