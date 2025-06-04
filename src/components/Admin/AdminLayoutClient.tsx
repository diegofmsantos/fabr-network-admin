"use client"

import { AdminSidebar } from '@/components/Admin/AdminSidebar'
import { AdminHeader } from '@/components/Admin/AdminHeader'
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
      <AdminHeader />
      <div className="min-h-screen bg-[#272731]">
        {/* Sidebar */}
        <AdminSidebar />
        
        {/* Main Content */}
        <div className="lg:pl-64">
          {/* Header */}
          
          
          {/* Page Content */}
          <main className="py-6">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </main>
        </div>
        
        {/* Sistema de Notificações */}
        <NotificationContainer />
      </div>
    </AdminErrorBoundary>
  )
}