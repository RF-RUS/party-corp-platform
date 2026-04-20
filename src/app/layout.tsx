import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Party Corp - E-commerce Optimization',
  description: 'AI-powered e-commerce growth platform for Shopify and WooCommerce stores',
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