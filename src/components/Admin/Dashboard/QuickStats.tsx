"use client"

import React from 'react'
import { StatsCard } from '@/components/Admin/StatsCard'
import { Trophy, Calendar, Users, AlertTriangle } from 'lucide-react'
import { useAdminStats } from '@/hooks/useAdminStats'

export const QuickStats: React.FC = () => {
  const { data: stats, isLoading } = useAdminStats()

  const quickStats = [
    {
      title: 'Campeonatos Ativos',
      value: stats?.campeonatosAtivos || 0,
      icon: Trophy,
      color: 'blue' as const,
      change: stats?.crescimentoCampeonatos ? `${stats.crescimentoCampeonatos > 0 ? '+' : ''}${stats.crescimentoCampeonatos}% este mês` : undefined,
      changeType: (stats?.crescimentoCampeonatos || 0) >= 0 ? 'positive' as const : 'negative' as const
    },
    {
      title: 'Jogos Esta Semana',
      value: stats?.jogosEstaSemana || 0,
      icon: Calendar,
      color: 'green' as const,
      subtitle: 'próximos 7 dias'
    },
    {
      title: 'Times Participantes',
      value: stats?.timesParticipantes || 0,
      icon: Users,
      color: 'purple' as const,
      change: stats?.novosTimes ? `${stats.novosTimes} novos` : undefined,
      changeType: 'positive' as const
    },
    {
      title: 'Alertas Pendentes',
      value: stats?.alertas?.length || 0,
      icon: AlertTriangle,
      color: 'red' as const,
      changeType: 'negative' as const
    }
  ]

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {quickStats.map((stat, index) => (
        <StatsCard
          key={index}
          title={stat.title}
          value={stat.value}
          icon={stat.icon}
          color={stat.color}
          change={stat.change}
          changeType={stat.changeType}
          subtitle={stat.subtitle}
          loading={isLoading}
        />
      ))}
    </div>
  )
}