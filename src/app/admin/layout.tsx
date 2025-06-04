import { Metadata } from 'next'
import { AdminLayoutClient } from '@/components/Admin/AdminLayoutClient'

export const metadata: Metadata = {
  title: {
    default: 'Admin - FABR Network',
    template: '%s | Admin - FABR Network'
  },
  description: 'Painel administrativo do FABR Network',
}

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <AdminLayoutClient>
      {children}
    </AdminLayoutClient>
  )
}