import type { Metadata } from 'next'
import './globals.css'

// 앱 메타데이터
export const metadata: Metadata = {
  title: 'PillBox - 의약품 안전 복용 관리',
  description: '의약품 안전 복용 관리 서비스',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  )
}
