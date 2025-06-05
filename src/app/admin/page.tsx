"use client"

import { useState } from 'react'
import { Loading } from '@/components/ui/Loading'
import { QuickStats } from '@/components/Admin/Dashboard/QuickStats'
import { ActionableAlerts } from '@/components/Admin/Dashboard/ActionableAlerts'
import { SystemHealth } from '@/components/Admin/Dashboard/SystemHealth'
import { useAdminStats } from '@/hooks/useAdminStats'
import { QuickActions } from '@/components/Admin/QuickActions'
import { RecentActivity } from '@/components/Admin/RecentActivity'
import { ChartCard } from '@/components/Admin/ChartCard'

export default function AdminDashboard() {
  const [selectedTemporada, setSelectedTemporada] = useState('2025')
  const { data: stats, isLoading, error } = useAdminStats(selectedTemporada)

  if (isLoading) return <Loading />
  
  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-[#63E300] mb-4">Erro ao carregar dashboard</div>
        <button 
          onClick={() => window.location.reload()}
          className="bg-[#63E300] text-white px-4 py-2 rounded"
        >
          Tentar novamente
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header com Filtros */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#63E300]">Dashboard Administrativo</h1>
          <p className="mt-1 text-sm text-gray-300">
            Visão geral dos campeonatos e estatísticas
          </p>
        </div>
        
        <div className="mt-4 sm:mt-0">
          <select
            value={selectedTemporada}
            onChange={(e) => setSelectedTemporada(e.target.value)}
            className="rounded-md p-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="2025">Temporada 2025</option>
            <option value="2024">Temporada 2024</option>
          </select>
        </div>
      </div>

      {/* Stats Cards Principais */}
      <QuickStats />

      {/* Alertas Críticos */}
      <ActionableAlerts />

      {/* Grid Principal */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Ações Rápidas */}
        <div className="lg:col-span-1">
          <QuickActions />
        </div>
        
        {/* Status do Sistema */}
        <div className="lg:col-span-1">
          <SystemHealth />
        </div>

        {/* Atividades Recentes */}
        <div className="lg:col-span-1">
          <RecentActivity activities={stats?.recentActivities || []} />
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ChartCard
          title="Campeonatos por Status"
          data={stats?.campeonatosPorStatus || []}
          type="pie"
        />
        <ChartCard
          title="Jogos por Mês"
          data={stats?.jogosPorMes || []}
          type="line"
        />
      </div>
    </div>
  )
}