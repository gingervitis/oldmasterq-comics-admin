import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Old Master Q Comics Admin',
  description: 'Admin interface for managing Old Master Q comic strips',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
