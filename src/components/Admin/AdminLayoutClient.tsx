"use client"

import { AdminSidebar } from '@/components/Admin/AdminSidebar'
import { AdminErrorBoundary } from '@/components/Admin/ErrorBoundary'
import { HeaderGeneral } from '../HeaderGeneral'
import { TemporadaSelector } from '@/components/Admin/TemporadaSelector'
import { DivisaoSelector } from '@/components/Admin/DivisaoSelector'

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
              <div className="mb-6 flex items-center justify-between gap-4">
                <span className="text-sm text-gray-400">
                  Temporada ativa do painel
                </span>
                <div className="flex items-center gap-2">
                  <DivisaoSelector />
                  <TemporadaSelector />
                </div>
              </div>

              {children}
            </div>
          </main>
        </div>

      </div>
    </AdminErrorBoundary>
  )
}