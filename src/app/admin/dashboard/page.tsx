"use client"

import { useState } from 'react'
import { Loading } from '@/components/ui/Loading'
import { useAdminStats } from '@/hooks/useAdminStats'
import { QuickStats } from '@/components/Admin/Dashboard/QuickStats'
import { ActionableAlerts } from '@/components/Admin/Dashboard/ActionableAlerts'
import { SystemHealth } from '@/components/Admin/Dashboard/SystemHealth'
import { ChartCard } from '@/components/Admin/ChartCard'
import { ActivityTimeline } from '@/components/Admin/ActivityTimeline'

export default function Dashboard() {
  const [selectedTemporada, setSelectedTemporada] = useState('2025')
  const [selectedPeriod, setSelectedPeriod] = useState('30d')
  
  const { data: stats, isLoading, error } = useAdminStats({
    temporada: selectedTemporada,
    period: selectedPeriod
  })

  if (isLoading) return <Loading />
  if (error) {
    return (
      <div className="text-center text-red-600">
        Erro ao carregar dados: {error.message}
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header com Filtros */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#63E300]">Dashboard Executivo</h1>
          <p className="mt-2 text-sm text-gray-300">
            Acompanhe as métricas e performance dos campeonatos em tempo real
          </p>
        </div>
        
        <div className="mt-4 sm:mt-0 flex space-x-4">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="rounded-md p-2 border-gray-300 text-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="7d">Últimos 7 dias</option>
            <option value="30d">Últimos 30 dias</option>
            <option value="90d">Últimos 90 dias</option>
            <option value="1y">Último ano</option>
          </select>
          
          <select
            value={selectedTemporada}
            onChange={(e) => setSelectedTemporada(e.target.value)}
            className="rounded-md p-2 border-gray-300 text-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="2025">Temporada 2025</option>
            <option value="2024">Temporada 2024</option>
          </select>
        </div>
      </div>

      {/* Stats Principais */}
      <QuickStats />

      {/* Sistema de Alertas */}
      <ActionableAlerts />

      {/* Grid de Componentes */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        {/* Status do Sistema */}
        <div className="lg:col-span-1">
          <SystemHealth />
        </div>

        {/* Gráficos */}
        <div className="lg:col-span-3 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard
            title="Evolução de Campeonatos"
            subtitle="Criação ao longo do tempo"
            data={stats?.evolucaoCampeonatos || []}
            type="area"
            height={300}
          />
          
          <ChartCard
            title="Status dos Jogos"
            subtitle="Distribuição atual"
            data={stats?.statusJogos || []}
            type="donut"
            height={300}
          />
        </div>
      </div>

      {/* Gráficos Secundários */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <ChartCard
          title="Performance por Tipo"
          data={stats?.performancePorTipo || []}
          type="bar"
          height={250}
        />
        
        <ChartCard
          title="Participação Regional"
          data={stats?.participacaoRegional || []}
          type="pie"
          height={250}
        />
        
        <ChartCard
          title="Tendência Mensal"
          data={stats?.tendenciaMensal || []}
          type="line"
          height={250}
        />
      </div>

      {/* Timeline e Métricas Detalhadas */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Atividades Recentes */}
        <div className="lg:col-span-1">
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Atividades Recentes
            </h3>
            <ActivityTimeline activities={stats?.atividadesRecentes || []} />
          </div>
        </div>

        {/* Métricas Detalhadas */}
        <div className="lg:col-span-2">
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-6">
              Métricas Detalhadas
            </h3>
            
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-600">Média de Jogos/Campeonato</span>
                  <span className="text-lg font-bold text-gray-900">{stats?.mediaJogosPorCampeonato || 0}</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-600">Tempo Médio de Duração</span>
                  <span className="text-lg font-bold text-gray-900">{stats?.tempoMedioDuracao || '0'} dias</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-600">Taxa de Adiamentos</span>
                  <span className="text-lg font-bold text-gray-900">{stats?.taxaAdiamentos || 0}%</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-600">Grupos por Campeonato</span>
                  <span className="text-lg font-bold text-gray-900">{stats?.mediaGruposPorCampeonato || 0}</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-600">Participação Média</span>
                  <span className="text-lg font-bold text-gray-900">{stats?.participacaoMedia || 0} times</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-600">Pontuação Média</span>
                  <span className="text-lg font-bold text-gray-900">{stats?.pontuacaoMedia || 0}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Performers */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-6">Top Performers</h3>
        
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-3">Campeonatos Mais Ativos</h4>
            <div className="space-y-3">
              {stats?.topCampeonatos?.map((campeonato: any, index: number) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{campeonato.nome}</div>
                    <div className="text-xs text-gray-500">{campeonato.jogos} jogos</div>
                  </div>
                  <div className="text-sm font-bold text-blue-600">#{index + 1}</div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-3">Times Mais Participativos</h4>
            <div className="space-y-3">
              {stats?.topTimes?.map((time: any, index: number) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{time.nome}</div>
                    <div className="text-xs text-gray-500">{time.campeonatos} campeonatos</div>
                  </div>
                  <div className="text-sm font-bold text-green-600">#{index + 1}</div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-3">Regiões Mais Ativas</h4>
            <div className="space-y-3">
              {stats?.topRegioes?.map((regiao: any, index: number) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{regiao.nome}</div>
                    <div className="text-xs text-gray-500">{regiao.times} times</div>
                  </div>
                  <div className="text-sm font-bold text-purple-600">#{index + 1}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}