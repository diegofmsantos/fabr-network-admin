"use client"

import { useState } from 'react'
import Link from 'next/link'
import { Trophy, Plus, Settings, Eye, Calendar, Users, Target, Clock, AlertTriangle, ArrowRight } from 'lucide-react'
import { Loading } from '@/components/ui/Loading'
import { useSuperliga, useStatusSuperliga, useJogosSuperliga } from '@/hooks/useSuperliga'

export default function AdminSuperligaPage() {
  const [selectedTemporada] = useState('2025')

  const { data: superliga, isLoading: loadingSuperliga, refetch } = useSuperliga(selectedTemporada)
  const { data: status, isLoading: loadingStatus } = useStatusSuperliga(selectedTemporada)
  const { data: jogos = [], isLoading: loadingJogos } = useJogosSuperliga(selectedTemporada)

  const isLoading = loadingSuperliga || loadingStatus || loadingJogos

  if (isLoading) return <Loading />

  const superligaExists = !!superliga

  // 🔧 CORREÇÃO: Verificação segura se jogos é um array
  const jogosArray = Array.isArray(jogos) ? jogos : []

  const stats = {
    totalJogos: jogosArray.length,
    jogosFinalizados: jogosArray.filter(j => j.status === 'FINALIZADO').length,
    jogosAgendados: jogosArray.filter(j => j.status === 'AGENDADO').length,
    proximoJogo: jogosArray.find(j => j.status === 'AGENDADO' && new Date(j.dataJogo) > new Date()),
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
      title: 'Gerenciar Jogos',
      description: 'Inserir resultados e gerenciar agenda',
      href: '/admin/jogos',
      icon: Calendar,
      color: 'blue',
      enabled: true
    },
    {
      title: 'Importar Dados',
      description: 'Upload de planilhas e estatísticas',
      href: '/admin/importar',
      icon: Users,
      color: 'purple',
      enabled: true
    }
  ]

  const createSuperliga = async () => {
    try {
      alert('Funcionalidade de criar Superliga será implementada')
      refetch()
    } catch (error) {
      console.error('Erro ao criar Superliga:', error)
    }
  }

  return (
    <div className="space-y-6">
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

      {superligaExists ? (
        <div className="space-y-6">
          {/* Status Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[#272731] border border-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total de Jogos</p>
                  <p className="text-2xl font-bold text-white">{stats.totalJogos}</p>
                </div>
                <Calendar className="w-8 h-8 text-blue-500" />
              </div>
            </div>

            <div className="bg-[#272731] border border-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Jogos Finalizados</p>
                  <p className="text-2xl font-bold text-white">{stats.jogosFinalizados}</p>
                </div>
                <Trophy className="w-8 h-8 text-green-500" />
              </div>
            </div>

            <div className="bg-[#272731] border border-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Próximos Jogos</p>
                  <p className="text-2xl font-bold text-white">{stats.jogosAgendados}</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-500" />
              </div>
            </div>
          </div>

          {/* Management Sections */}
          <div>
            <h2 className="text-xl font-bold text-white mb-4">Gerenciamento</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {managementSections.map((section) => (
                <Link
                  key={section.id}
                  href={section.enabled ? section.href : '#'}
                  className={`p-6 rounded-lg border transition-colors ${
                    section.enabled
                      ? 'bg-[#272731] border-gray-700 hover:border-gray-600'
                      : 'bg-[#1C1C24] border-gray-800 opacity-50 cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <section.icon className={`w-8 h-8 ${
                      section.color === 'blue' ? 'text-blue-500' :
                      section.color === 'yellow' ? 'text-yellow-500' :
                      section.color === 'gray' ? 'text-gray-500' : 'text-gray-500'
                    }`} />
                    {section.enabled && <ArrowRight className="w-5 h-5 text-gray-400" />}
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{section.title}</h3>
                  <p className="text-gray-400 text-sm mb-3">{section.description}</p>
                  <p className="text-sm font-medium text-[#63E300]">{section.stats}</p>
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <h2 className="text-xl font-bold text-white mb-4">Ações Rápidas</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quickActions.map((action, index) => (
                <Link
                  key={index}
                  href={action.href}
                  className="p-4 bg-[#272731] border border-gray-700 rounded-lg hover:border-gray-600 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <action.icon className={`w-6 h-6 ${
                      action.color === 'blue' ? 'text-blue-500' :
                      action.color === 'purple' ? 'text-purple-500' : 'text-gray-500'
                    }`} />
                    <div>
                      <h3 className="font-semibold text-white">{action.title}</h3>
                      <p className="text-sm text-gray-400">{action.description}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Superliga não existe */
        <div className="text-center py-12">
          <Trophy className="w-16 h-16 text-gray-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Superliga {selectedTemporada} não encontrada</h3>
          <p className="text-gray-400 mb-6">
            A Superliga para a temporada {selectedTemporada} ainda não foi criada.
            Crie uma nova Superliga para começar a gerenciar os dados.
          </p>
          <div className="space-y-3">
            <Link
              href="/admin/superliga/criar"
              className="inline-flex items-center gap-2 bg-[#63E300] text-black px-6 py-3 rounded-md font-semibold hover:bg-[#50B800] transition-colors"
            >
              <Plus className="w-5 h-5" />
              Criar Superliga {selectedTemporada}
            </Link>
            <div className="text-sm text-gray-500">
              <p>Passos necessários antes de criar:</p>
              <ol className="mt-2 space-y-1 text-left max-w-md mx-auto">
                <li>1. Importe os times (se ainda não fez)</li>
                <li>2. Importe os jogadores</li>
                <li>3. Configure as conferências</li>
              </ol>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}