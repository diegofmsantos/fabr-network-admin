// SUBSTITUIR COMPLETAMENTE o conteúdo de src/app/admin/page.tsx

"use client"

import { useState } from 'react'
import Link from 'next/link'
import {
  Trophy, Plus, Settings, Eye, Play, Calendar, Users,
  BarChart3, Target, CheckCircle, Clock, AlertTriangle,
  Zap, ArrowRight, RefreshCw
} from 'lucide-react'
import { Loading } from '@/components/ui/Loading'
import { useSuperliga, useStatusSuperliga } from '@/hooks/useSuperliga'
import { useJogos } from '@/hooks/useJogos'

export default function AdminDashboardPage() {
  const [selectedTemporada] = useState('2025')

  const { data: superliga, isLoading: loadingSuperliga, refetch } = useSuperliga(selectedTemporada)
  const { data: status, isLoading: loadingStatus } = useStatusSuperliga(selectedTemporada)
  const { data: jogos = [], isLoading: loadingJogos } = useJogos({ temporada: selectedTemporada })

  const isLoading = loadingSuperliga || loadingStatus || loadingJogos

  if (isLoading) return <Loading />

  // Verificar se já existe uma Superliga
  const superligaExists = !!superliga

  // ✅ STATUS DE DISTRIBUIÇÃO (SOMENTE PARA EXIBIÇÃO)
  const timesDistribuidos = (status as any)?.timesDistribuidos || 0
  const distribuicaoCompleta = timesDistribuidos >= 32

  // Calcular estatísticas
  const stats = {
    totalJogos: jogos.length,
    jogosFinalizados: jogos.filter(j => j.status === 'FINALIZADO').length,
    jogosAgendados: jogos.filter(j => j.status === 'AGENDADO').length,
    proximoJogo: jogos.find(j => j.status === 'AGENDADO' && new Date(j.dataJogo) > new Date()),
  }

  const managementSections = [
    {
      id: 'temporada-regular',
      title: 'Temporada Regular',
      description: 'Gerenciar jogos da temporada regular',
      href: '/admin/superliga/temporada-regular',
      icon: Calendar,
      color: 'blue',
      stats: `${stats.jogosFinalizados}/${stats.totalJogos} jogos`,
      enabled: superligaExists && stats.totalJogos > 0
    },
    {
      id: 'playoffs',
      title: 'Playoffs',
      description: 'Gerenciar playoffs e fase nacional',
      href: '/admin/superliga/playoffs',
      icon: Trophy,
      color: 'yellow',
      stats: (status as any)?.status === 'PLAYOFFS' ? 'Em andamento' : 'Aguardando',
      enabled: superligaExists && (status as any)?.status === 'PLAYOFFS'
    },
    {
      id: 'configuracoes',
      title: 'Configurações',
      description: 'Configurar estrutura e parâmetros',
      href: '/admin/superliga/configuracoes',
      icon: Settings,
      color: 'gray',
      stats: 'Configurar',
      enabled: true
    }
  ]

  const quickActions = [
    {
      title: 'Visualizar Site Público',
      description: 'Ver como o público visualiza a Superliga',
      href: `/superliga/${selectedTemporada}`,
      icon: Eye,
      color: 'green'
    },
    {
      title: 'Gerenciar Jogos',
      description: 'Inserir resultados e gerenciar agenda',
      href: '/admin/jogos',
      icon: Calendar,
      color: 'blue'
    },
    {
      title: 'Importar Dados',
      description: 'Upload de planilhas e estatísticas',
      href: '/admin/importar',
      icon: Users,
      color: 'purple'
    }
  ]

  const createSuperliga = async () => {
    try {
      // Funcionalidade de criar Superliga será implementada
      alert('Funcionalidade de criar Superliga será implementada')
      refetch()
    } catch (error) {
      console.error('Erro ao criar Superliga:', error)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Superliga de Futebol Americano</h1>
          <p className="mt-1 text-sm text-gray-400">
            Gerencie a estrutura e funcionamento da Superliga {selectedTemporada}
          </p>
        </div>

        <div className="mt-4 sm:mt-0 flex gap-3">
          {superligaExists && (
            <>
              <Link
                href="/admin/superliga/configuracoes"
                className="flex items-center gap-2 bg-[#1C1C24] text-white px-4 py-2 rounded-md border border-gray-700 hover:border-gray-600 transition-colors"
              >
                <Settings className="w-4 h-4" />
                Configurações
              </Link>

              <Link
                href={`/superliga/${selectedTemporada}`}
                className="flex items-center gap-2 bg-[#63E300] text-black px-4 py-2 rounded-md font-semibold hover:bg-[#50B800] transition-colors"
              >
                <Eye className="w-4 h-4" />
                Ver Site Público
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Status da Superliga */}
      {superligaExists ? (
        <div className="bg-gradient-to-r from-[#272731] to-[#1C1C24] rounded-lg border border-gray-700 p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white mb-2">
                Status da Superliga {selectedTemporada}
              </h3>
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-gray-300">Superliga Criada</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-400" />
                  <span className="text-sm text-gray-300">{stats.totalJogos} jogos cadastrados</span>
                </div>
                
                {/* ✅ STATUS DE DISTRIBUIÇÃO (SOMENTE INFORMATIVO) */}
                <div className="flex items-center gap-2">
                  {distribuicaoCompleta ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-sm text-green-300">
                        Times distribuídos ({timesDistribuidos}/32)
                      </span>
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4 text-blue-400" />
                      <span className="text-sm text-blue-300">
                        Distribuição automática ({timesDistribuidos}/32)
                      </span>
                    </>
                  )}
                </div>
              </div>

              {stats.proximoJogo && (
                <div className="mt-3 p-3 bg-blue-500/10 border border-blue-500/20 rounded-md">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-white font-medium">Próximo jogo: </span>
                    <span className="text-gray-300">
                      {stats.proximoJogo.timeCasa.nome} vs {stats.proximoJogo.timeVisitante.nome}
                    </span>
                    <span className="text-gray-400 ml-2">
                      {new Date(stats.proximoJogo.dataJogo).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-lg p-6">
          <div className="flex items-start gap-4">
            <AlertTriangle className="w-8 h-8 text-yellow-400 mt-1" />
            <div className="flex-1">
              <h3 className="text-xl font-bold text-yellow-400 mb-2">
                Superliga não encontrada
              </h3>
              <p className="text-gray-300 mb-4">
                A Superliga {selectedTemporada} ainda não foi criada.
                Certifique-se de que times e jogadores foram importados antes de criar.
              </p>

              <div className="flex items-center gap-4">
                <button
                  onClick={createSuperliga}
                  className="flex items-center gap-2 bg-[#63E300] text-black px-6 py-3 rounded-md font-semibold hover:bg-[#50B800] transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  Criar Superliga {selectedTemporada}
                </button>

                <Link
                  href="/admin/importar"
                  className="flex items-center gap-2 text-yellow-400 hover:text-yellow-300 transition-colors"
                >
                  <ArrowRight className="w-4 h-4" />
                  Importar dados primeiro
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Seções de Gerenciamento */}
      {superligaExists && (
        <div>
          <h2 className="text-xl font-bold text-white mb-4">Gerenciamento</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {managementSections.map((section) => (
              <Link
                key={section.id}
                href={section.enabled ? section.href : '#'}
                className={`group bg-[#272731] rounded-lg border border-gray-700 p-6 transition-all ${
                  section.enabled
                    ? 'hover:border-gray-600 hover:transform hover:scale-105'
                    : 'opacity-50 cursor-not-allowed'
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={`p-2 bg-${section.color}-500/20 rounded-lg`}>
                    <section.icon className={`w-6 h-6 text-${section.color}-400`} />
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-semibold transition-colors ${
                      section.enabled
                        ? 'text-white group-hover:text-[#63E300]'
                        : 'text-gray-400'
                    }`}>
                      {section.title}
                    </h3>
                    <p className="text-sm text-gray-400">
                      {section.stats}
                    </p>
                  </div>
                  {section.enabled && (
                    <ArrowRight className="w-5 h-5 text-gray-600 group-hover:text-[#63E300] transition-colors" />
                  )}
                </div>

                <p className="text-sm text-gray-400">
                  {section.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Ações Rápidas */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4">Ações Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map((action, index) => (
            <Link
              key={index}
              href={action.href}
              className="group bg-[#272731] rounded-lg border border-gray-700 p-6 hover:border-gray-600 transition-all hover:transform hover:scale-105"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-2 bg-${action.color}-500/20 rounded-lg`}>
                  <action.icon className={`w-6 h-6 text-${action.color}-400`} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white group-hover:text-[#63E300] transition-colors">
                    {action.title}
                  </h3>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-600 group-hover:text-[#63E300] transition-colors" />
              </div>

              <p className="text-sm text-gray-400">
                {action.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}