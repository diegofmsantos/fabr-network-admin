"use client"

import { useState } from 'react'
import Link from 'next/link'
import { 
  Trophy, Users, Calendar, BarChart3, Upload, Settings, 
  Play, CheckCircle, Clock, AlertTriangle, TrendingUp,
  FileSpreadsheet, Target, Zap
} from 'lucide-react'
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
            href={`/superliga/${selectedTemporada}`}
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
              <h3 className="text-xl font-bold text-white mb-1">
                {superliga.nome}
              </h3>
              <p className="text-gray-400">
                Status: <span className="text-[#63E300] font-semibold">{status?.fase || 'Configuração'}</span>
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-[#63E300]">{stats.totalJogos}</div>
                <div className="text-xs text-gray-400">Total Jogos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">{stats.jogosFinalizados}</div>
                <div className="text-xs text-gray-400">Finalizados</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">{stats.jogosAgendados}</div>
                <div className="text-xs text-gray-400">Agendados</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Alertas e Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#272731] rounded-lg border border-gray-700 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Calendar className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <div className="text-lg font-bold text-white">{stats.totalJogos}</div>
              <div className="text-sm text-gray-400">Total de Jogos</div>
            </div>
          </div>
        </div>

        <div className="bg-[#272731] rounded-lg border border-gray-700 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <div className="text-lg font-bold text-white">{stats.jogosFinalizados}</div>
              <div className="text-sm text-gray-400">Finalizados</div>
            </div>
          </div>
        </div>

        <div className="bg-[#272731] rounded-lg border border-gray-700 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-500/20 rounded-lg">
              <Clock className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <div className="text-lg font-bold text-white">{stats.jogosAgendados}</div>
              <div className="text-sm text-gray-400">Agendados</div>
            </div>
          </div>
        </div>

        <div className="bg-[#272731] rounded-lg border border-gray-700 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-500/20 rounded-lg">
              <Play className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <div className="text-lg font-bold text-white">{stats.jogosAoVivo}</div>
              <div className="text-sm text-gray-400">Ao Vivo</div>
            </div>
          </div>
        </div>
      </div>

      {/* Ações Rápidas */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4">Ações Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <Link
              key={index}
              href={action.href}
              className="group bg-[#272731] rounded-lg border border-gray-700 p-6 hover:border-gray-600 transition-all hover:transform hover:scale-105"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-2 ${action.color}/20 rounded-lg`}>
                  <action.icon className={`w-5 h-5 text-white`} />
                </div>
                {action.priority === 'primary' && (
                  <Zap className="w-4 h-4 text-[#63E300]" />
                )}
              </div>
              
              <h3 className="font-semibold text-white group-hover:text-[#63E300] transition-colors mb-1">
                {action.title}
              </h3>
              <p className="text-sm text-gray-400">
                {action.description}
              </p>
            </Link>
          ))}
        </div>
      </div>

      {/* Status de Importações */}
      <div className="bg-[#272731] rounded-lg border border-gray-700 p-6">
        <h3 className="text-lg font-bold text-white mb-4">Status do Sistema</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center justify-between p-3 bg-[#1C1C24] rounded-lg">
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-blue-400" />
              <span className="text-gray-300">Times Cadastrados</span>
            </div>
            <span className="font-bold text-white">32</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-[#1C1C24] rounded-lg">
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-green-400" />
              <span className="text-gray-300">Jogadores Ativos</span>
            </div>
            <span className="font-bold text-white">1568</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-[#1C1C24] rounded-lg">
            <div className="flex items-center gap-3">
              <Trophy className="w-5 h-5 text-yellow-400" />
              <span className="text-gray-300">Superliga</span>
            </div>
            <span className="font-bold text-[#63E300]">
              {superliga ? 'Ativa' : 'Não Criada'}
            </span>
          </div>
        </div>
      </div>

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
    </div>
  )
}