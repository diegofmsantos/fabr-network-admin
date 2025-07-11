// src/app/admin/page.tsx
"use client"

import { useState } from 'react'
import Link from 'next/link'
import { Trophy, Users, Calendar, Upload, Settings, Play, CheckCircle, Clock, AlertTriangle, TrendingUp, Target, Zap } from 'lucide-react'
import { Loading } from '@/components/ui/Loading'
import { useSuperliga, useStatusSuperliga } from '@/hooks/useSuperliga'
import { useJogos } from '@/hooks/useJogos'

export default function AdminDashboard() {
  const [selectedTemporada] = useState('2025')
  
  const { data: superliga, isLoading: loadingSuperliga } = useSuperliga(selectedTemporada)
  const { data: status, isLoading: loadingStatus } = useStatusSuperliga(selectedTemporada)
  const { data: jogos = [], isLoading: loadingJogos } = useJogos({ temporada: selectedTemporada })

  const isLoading = loadingSuperliga || loadingStatus || loadingJogos

  if (isLoading) return <Loading />

  // Calcular estatísticas
  const stats = {
    totalJogos: jogos.length,
    jogosFinalizados: jogos.filter(j => j.status === 'FINALIZADO').length,
    jogosAgendados: jogos.filter(j => j.status === 'AGENDADO').length,
    jogosAoVivo: jogos.filter(j => j.status === 'AO_VIVO').length,
  }

  const quickActions = [
    {
      title: 'Gerenciar Superliga',
      description: 'Configurar e acompanhar o campeonato',
      href: '/admin/superliga',
      icon: Trophy,
      color: 'bg-yellow-500',
      priority: superliga ? 'secondary' : 'primary'
    },
    {
      title: 'Importar Dados',
      description: 'Upload de planilhas (times, jogadores, agenda)',
      href: '/admin/importar',
      icon: Upload,
      color: 'bg-blue-500',
      priority: 'primary'
    },
    {
      title: 'Gerenciar Jogos',
      description: 'Inserir resultados e acompanhar agenda',
      href: '/admin/jogos',
      icon: Calendar,
      color: 'bg-green-500',
      priority: 'secondary'
    },
    {
      title: 'Times & Jogadores',
      description: 'Gerenciar cadastros de times e jogadores',
      href: '/admin/times',
      icon: Users,
      color: 'bg-purple-500',
      priority: 'secondary'
    }
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#63E300]">Dashboard Administrativo</h1>
          <p className="mt-2 text-sm text-gray-300">
            Gerencie a Superliga de Futebol Americano {selectedTemporada}
          </p>
        </div>
        
        <div className="mt-4 sm:mt-0 flex gap-3">
          <Link
            href="/admin/superliga/configuracoes"
            className="flex items-center gap-2 bg-[#1C1C24] text-white px-4 py-2 rounded-md border border-gray-700 hover:border-gray-600 transition-colors"
          >
            <Settings className="w-4 h-4" />
            Configurações
          </Link>
          
          <Link
            href="https://fabrnetwork.com.br/ "
            target='_blank'
            className="flex items-center gap-2 bg-[#63E300] text-black px-4 py-2 rounded-md font-semibold hover:bg-[#50B800] transition-colors"
          >
            <Target className="w-4 h-4" />
            Ver Site Público
          </Link>
        </div>
      </div>

      {/* Status da Superliga */}
      {superliga && (
        <div className="bg-gradient-to-r from-[#272731] to-[#1C1C24] rounded-lg border border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Status da Superliga {selectedTemporada}
              </h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-gray-300">Superliga Criada</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-400" />
                  <span className="text-sm text-gray-300">{stats.totalJogos} jogos cadastrados</span>
                </div>
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm text-gray-300">
                    Status: {status ? 'Ativa' : 'Não Criada'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Próximos Passos */}
      {!superliga && (
        <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-yellow-400 mt-1" />
            <div>
              <h3 className="text-lg font-bold text-yellow-400 mb-2">
                Configure a Superliga
              </h3>
              <p className="text-gray-300 mb-4">
                Para começar a usar o sistema, siga estes passos:
              </p>
              <ol className="list-decimal list-inside text-gray-300 space-y-1 mb-4">
                <li>Importe os times (planilha Excel)</li>
                <li>Importe os jogadores (planilha Excel)</li>
                <li>Crie a Superliga</li>
                <li>Importe a agenda de jogos</li>
              </ol>
              <Link
                href="/admin/importar"
                className="inline-flex items-center gap-2 bg-[#63E300] text-black px-4 py-2 rounded-md font-semibold hover:bg-[#50B800] transition-colors"
              >
                <Upload className="w-4 h-4" />
                Começar Importação
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Estatísticas Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#272731] rounded-lg border border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Total de Jogos</p>
              <p className="text-2xl font-bold text-white">{stats.totalJogos}</p>
            </div>
            <Calendar className="w-8 h-8 text-blue-400" />
          </div>
        </div>

        <div className="bg-[#272731] rounded-lg border border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Jogos Finalizados</p>
              <p className="text-2xl font-bold text-green-400">{stats.jogosFinalizados}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
        </div>

        <div className="bg-[#272731] rounded-lg border border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Jogos Agendados</p>
              <p className="text-2xl font-bold text-yellow-400">{stats.jogosAgendados}</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-400" />
          </div>
        </div>

        <div className="bg-[#272731] rounded-lg border border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Ao Vivo</p>
              <p className="text-2xl font-bold text-red-400">{stats.jogosAoVivo}</p>
            </div>
            <Play className="w-8 h-8 text-red-400" />
          </div>
        </div>
      </div>

      {/* Ações Rápidas */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4">Ações Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.title}
              href={action.href}
              className={`group p-6 rounded-lg border border-gray-700 hover:border-gray-600 transition-all duration-200 ${
                action.priority === 'primary' 
                  ? 'bg-gradient-to-br from-[#63E300]/10 to-[#50B800]/5 hover:from-[#63E300]/20 hover:to-[#50B800]/10' 
                  : 'bg-[#272731] hover:bg-[#2A2A35]'
              }`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-2 rounded-lg ${action.color}`}>
                  <action.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-semibold text-white group-hover:text-[#63E300] transition-colors">
                  {action.title}
                </h3>
              </div>
              <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                {action.description}
              </p>
              {action.priority === 'primary' && (
                <div className="mt-3">
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-[#63E300]">
                    Recomendado
                    <TrendingUp className="w-3 h-3" />
                  </span>
                </div>
              )}
            </Link>
          ))}
        </div>
      </div>

      {/* Progresso do Setup */}
      <div className="bg-[#272731] rounded-lg border border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Progresso da Configuração</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-[#1C1C24] rounded border border-gray-600">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span className="text-white">Importar Times</span>
            </div>
            <span className="text-sm text-green-400">Concluído</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-[#1C1C24] rounded border border-gray-600">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span className="text-white">Importar Jogadores</span>
            </div>
            <span className="text-sm text-green-400">Concluído</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-[#1C1C24] rounded border border-gray-600">
            <div className="flex items-center gap-3">
              {superliga ? (
                <CheckCircle className="w-5 h-5 text-green-400" />
              ) : (
                <Clock className="w-5 h-5 text-yellow-400" />
              )}
              <span className="text-white">Criar Superliga</span>
            </div>
            <span className={`text-sm ${superliga ? 'text-green-400' : 'text-yellow-400'}`}>
              {superliga ? 'Concluído' : 'Pendente'}
            </span>
          </div>

          <div className="flex items-center justify-between p-3 bg-[#1C1C24] rounded border border-gray-600">
            <div className="flex items-center gap-3">
              {stats.totalJogos > 0 ? (
                <CheckCircle className="w-5 h-5 text-green-400" />
              ) : (
                <Clock className="w-5 h-5 text-yellow-400" />
              )}
              <span className="text-white">Importar Agenda de Jogos</span>
            </div>
            <span className={`text-sm ${stats.totalJogos > 0 ? 'text-green-400' : 'text-yellow-400'}`}>
              {stats.totalJogos > 0 ? `${stats.totalJogos} jogos` : 'Pendente'}
            </span>
          </div>

          <div className="flex items-center justify-between p-3 bg-[#1C1C24] rounded border border-gray-600">
            <div className="flex items-center gap-3">
              {stats.jogosFinalizados > 0 ? (
                <CheckCircle className="w-5 h-5 text-green-400" />
              ) : (
                <Clock className="w-5 h-5 text-gray-500" />
              )}
              <span className="text-white">Resultados dos Jogos</span>
            </div>
            <span className={`text-sm ${stats.jogosFinalizados > 0 ? 'text-green-400' : 'text-gray-500'}`}>
              {stats.jogosFinalizados > 0 ? `${stats.jogosFinalizados} finalizados` : 'Aguardando'}
            </span>
          </div>
        </div>

        {/* Próximo Passo */}
        <div className="mt-6 pt-4 border-t border-gray-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium">Próximo Passo:</p>
              <p className="text-sm text-gray-400">
                {!superliga 
                  ? 'Criar a Superliga 2025'
                  : stats.totalJogos === 0 
                  ? 'Importar agenda de jogos'
                  : stats.jogosFinalizados === 0
                  ? 'Começar a inserir resultados dos jogos'
                  : 'Sistema configurado com sucesso!'
                }
              </p>
            </div>
            <Link
              href={
                !superliga 
                  ? '/admin/superliga/criar'
                  : stats.totalJogos === 0 
                  ? '/admin/importar'
                  : '/admin/importar'
              }
              className="flex items-center gap-2 bg-[#63E300] text-black px-4 py-2 rounded-md font-semibold hover:bg-[#50B800] transition-colors"
            >
              <Zap className="w-4 h-4" />
              {!superliga 
                ? 'Criar Superliga'
                : stats.totalJogos === 0 
                ? 'Importar Agenda'
                : 'Gerenciar Jogos'
              }
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}