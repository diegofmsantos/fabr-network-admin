"use client"

import { AdminSidebar } from '@/components/Admin/AdminSidebar'
import { AdminErrorBoundary } from '@/components/Admin/ErrorBoundary'
import { NotificationContainer } from '@/components/Admin/NotificationContainer'
import { HeaderGeneral } from '../HeaderGeneral'

interface AdminLayoutClientProps {
  children: React.ReactNode
}

export const AdminLayoutClient: React.FC<AdminLayoutClientProps> = ({ children }) => {
  return (
    <AdminErrorBoundary>
      <HeaderGeneral label='CAMPEONATOS' />
      <div className="min-h-screen bg-[#272731]">
        <AdminSidebar />

        <div className="lg:pl-64">

          <main className="py-6">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </main>
        </div>

      </div>
    </AdminErrorBoundary>
  )
}