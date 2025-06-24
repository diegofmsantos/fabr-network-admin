"use client"

import React, { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Trophy, Settings, Play, CheckCircle, Clock, AlertTriangle, Users, Calendar, BarChart3, Target, Zap, Download } from 'lucide-react'
import { Loading } from '@/components/ui/Loading'
import { useGerarJogosTemporadaRegular, useGerarPlayoffs, useStatusSuperliga, useValidarEstrutura } from '@/hooks/useSuperliga'
import { useCampeonato } from '@/hooks/useCampeonatos'

export default function SuperligaDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('visao-geral')
  
  const superligaId = parseInt(params.id as string)

  const { data: superliga, isLoading } = useCampeonato(superligaId)
  const { data: status } = useStatusSuperliga(superligaId)
  const { data: validacao } = useValidarEstrutura(superligaId)
  
  const { mutate: gerarJogos, isPending: gerandoJogos } = useGerarJogosTemporadaRegular()
  const { mutate: gerarPlayoffs, isPending: gerandoPlayoffs } = useGerarPlayoffs()

  if (isLoading) {
    return <Loading />
  }

  if (!superliga) {
    return (
      <div className="min-h-screen bg-[#1C1C24] p-6 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Superliga não encontrada</h2>
          <Link href="/admin/superliga" className="text-[#63E300] hover:underline">
            Voltar para lista de Superligas
          </Link>
        </div>
      </div>
    )
  }

  const tabs = [
    { id: 'visao-geral', label: 'Visão Geral', icon: BarChart3 },
    { id: 'conferencias', label: 'Conferências', icon: Users },
    { id: 'temporada-regular', label: 'Temporada Regular', icon: Calendar },
    { id: 'playoffs', label: 'Playoffs', icon: Trophy },
    { id: 'configuracoes', label: 'Configurações', icon: Settings },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'NAO_INICIADO': return 'text-gray-400'
      case 'EM_ANDAMENTO': return 'text-blue-400'
      case 'FINALIZADO': return 'text-green-400'
      default: return 'text-gray-400'
    }
  }

  const getFaseColor = (fase: string) => {
    switch (fase) {
      case 'CONFIGURACAO': return 'bg-yellow-500'
      case 'TEMPORADA_REGULAR': return 'bg-blue-500'
      case 'PLAYOFFS': return 'bg-purple-500'
      case 'FINALIZADO': return 'bg-green-500'
      default: return 'bg-gray-500'
    }
  }

  const handleGerarJogos = () => {
    gerarJogos(superligaId)
  }

  const handleGerarPlayoffs = () => {
    gerarPlayoffs(superligaId)
  }

  const renderVisaoGeral = () => (
    <div className="space-y-6">
      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#272731] rounded-lg border border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Status</p>
              <p className={`text-lg font-semibold ${getStatusColor(superliga.status)}`}>
                {superliga.status === 'NAO_INICIADO' ? 'Não Iniciado' :
                 superliga.status === 'EM_ANDAMENTO' ? 'Em Andamento' : 'Finalizado'}
              </p>
            </div>
            <div className={`p-3 rounded-lg ${getFaseColor(status?.fase || 'CONFIGURACAO')} bg-opacity-20`}>
              {superliga.status === 'NAO_INICIADO' ? <Clock className="w-6 h-6" /> :
               superliga.status === 'EM_ANDAMENTO' ? <Play className="w-6 h-6" /> :
               <CheckCircle className="w-6 h-6" />}
            </div>
          </div>
        </div>

        <div className="bg-[#272731] rounded-lg border border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Fase Atual</p>
              <p className="text-lg font-semibold text-white">
                {status?.fase === 'CONFIGURACAO' ? 'Configuração' :
                 status?.fase === 'TEMPORADA_REGULAR' ? 'Temporada Regular' :
                 status?.fase === 'PLAYOFFS' ? 'Playoffs' : 'Finalizado'}
              </p>
            </div>
            <div className="p-3 bg-purple-500 bg-opacity-20 rounded-lg">
              <Target className="w-6 h-6 text-purple-400" />
            </div>
          </div>
        </div>

        <div className="bg-[#272731] rounded-lg border border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total de Jogos</p>
              <p className="text-lg font-semibold text-white">
                {status?.estatisticas?.jogosTotal || 0}
              </p>
              <p className="text-xs text-gray-500">
                {status?.estatisticas?.jogosFinalizados || 0} finalizados
              </p>
            </div>
            <div className="p-3 bg-green-500 bg-opacity-20 rounded-lg">
              <Calendar className="w-6 h-6 text-green-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Próximo Passo */}
      {status?.proximoPasso && (
        <div className="bg-[#272731] rounded-lg border border-gray-700 p-6">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-[#63E300] bg-opacity-20 rounded-lg">
              <Zap className="w-5 h-5 text-[#63E300]" />
            </div>
            <div className="flex-1">
              <h3 className="text-white font-semibold mb-2">Próximo Passo</h3>
              <p className="text-gray-400 mb-4">{status.proximoPasso}</p>
              
              {status.podeAvancar && (
                <div className="flex gap-3">
                  {status.fase === 'CONFIGURACAO' && (
                    <button
                      onClick={handleGerarJogos}
                      disabled={gerandoJogos}
                      className="bg-[#63E300] text-black px-4 py-2 rounded-md font-medium hover:bg-[#50B800] transition-colors disabled:opacity-50"
                    >
                      {gerandoJogos ? 'Gerando...' : 'Gerar Jogos da Temporada Regular'}
                    </button>
                  )}
                  
                  {status.fase === 'TEMPORADA_REGULAR' && status.estatisticas?.jogosFinalizados === status.estatisticas?.jogosTotal && (
                    <button
                      onClick={handleGerarPlayoffs}
                      disabled={gerandoPlayoffs}
                      className="bg-purple-600 text-white px-4 py-2 rounded-md font-medium hover:bg-purple-700 transition-colors disabled:opacity-50"
                    >
                      {gerandoPlayoffs ? 'Gerando...' : 'Gerar Playoffs'}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Validação da Estrutura */}
      {validacao && (
        <div className="bg-[#272731] rounded-lg border border-gray-700 p-6">
          <h3 className="text-white font-semibold mb-4">Validação da Estrutura</h3>
          
          {validacao.valida ? (
            <div className="flex items-center gap-2 text-green-400">
              <CheckCircle className="w-5 h-5" />
              <span>Estrutura da Superliga está correta!</span>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-red-400 mb-3">
                <AlertTriangle className="w-5 h-5" />
                <span>Problemas encontrados na estrutura:</span>
              </div>
              {validacao.erros.map((erro, index) => (
                <div key={index} className="text-red-300 text-sm pl-7">
                  • {erro}
                </div>
              ))}
            </div>
          )}

          {validacao.avisos.length > 0 && (
            <div className="mt-4 space-y-1">
              {validacao.avisos.map((aviso, index) => (
                <div key={index} className="text-green-300 text-sm">
                  ✓ {aviso}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Conferências Overview */}
      <div className="bg-[#272731] rounded-lg border border-gray-700 p-6">
        <h3 className="text-white font-semibold mb-4">Conferências</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-[#1C1C24] rounded-lg p-4 text-center">
            <div className="text-2xl mb-2">🏭</div>
            <div className="text-white font-medium">Sudeste</div>
            <div className="text-gray-400 text-sm">12 times</div>
            <div className="text-gray-400 text-sm">3 regionais</div>
          </div>
          
          <div className="bg-[#1C1C24] rounded-lg p-4 text-center">
            <div className="text-2xl mb-2">🧊</div>
            <div className="text-white font-medium">Sul</div>
            <div className="text-gray-400 text-sm">8 times</div>
            <div className="text-gray-400 text-sm">2 regionais</div>
          </div>
          
          <div className="bg-[#1C1C24] rounded-lg p-4 text-center">
            <div className="text-2xl mb-2">🌵</div>
            <div className="text-white font-medium">Nordeste</div>
            <div className="text-gray-400 text-sm">6 times</div>
            <div className="text-gray-400 text-sm">1 regional</div>
          </div>
          
          <div className="bg-[#1C1C24] rounded-lg p-4 text-center">
            <div className="text-2xl mb-2">🌲</div>
            <div className="text-white font-medium">Centro-Norte</div>
            <div className="text-gray-400 text-sm">6 times</div>
            <div className="text-gray-400 text-sm">2 regionais</div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderConferencias = () => (
    <div className="text-center py-12">
      <Users className="w-16 h-16 text-gray-500 mx-auto mb-4" />
      <h3 className="text-xl font-bold text-white mb-2">Gerenciamento de Conferências</h3>
      <p className="text-gray-400 mb-6">Visualize e gerencie as 4 conferências da Superliga</p>
      <button className="bg-[#63E300] text-black px-6 py-2 rounded-md font-medium hover:bg-[#50B800] transition-colors">
        Em desenvolvimento
      </button>
    </div>
  )

  const renderTemporadaRegular = () => (
    <div className="text-center py-12">
      <Calendar className="w-16 h-16 text-gray-500 mx-auto mb-4" />
      <h3 className="text-xl font-bold text-white mb-2">Temporada Regular</h3>
      <p className="text-gray-400 mb-6">Gerencie os jogos da temporada regular (4 jogos por time)</p>
      <button className="bg-[#63E300] text-black px-6 py-2 rounded-md font-medium hover:bg-[#50B800] transition-colors">
        Em desenvolvimento
      </button>
    </div>
  )

  const renderPlayoffs = () => (
    <div className="text-center py-12">
      <Trophy className="w-16 h-16 text-gray-500 mx-auto mb-4" />
      <h3 className="text-xl font-bold text-white mb-2">Playoffs</h3>
      <p className="text-gray-400 mb-6">Visualize e gerencie o chaveamento dos playoffs</p>
      <button className="bg-[#63E300] text-black px-6 py-2 rounded-md font-medium hover:bg-[#50B800] transition-colors">
        Em desenvolvimento
      </button>
    </div>
  )

  const renderConfiguracoes = () => (
    <div className="space-y-6">
      <div className="bg-[#272731] rounded-lg border border-gray-700 p-6">
        <h3 className="text-white font-semibold mb-4">Informações Básicas</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Nome</label>
            <p className="text-white">{superliga.nome}</p>
          </div>
          
          <div>
            <label className="block text-sm text-gray-400 mb-1">Temporada</label>
            <p className="text-white">{superliga.temporada}</p>
          </div>
          
          <div>
            <label className="block text-sm text-gray-400 mb-1">Data de Início</label>
            <p className="text-white">
              {new Date(superliga.dataInicio).toLocaleDateString('pt-BR')}
            </p>
          </div>
          
          <div>
            <label className="block text-sm text-gray-400 mb-1">Status</label>
            <p className={getStatusColor(superliga.status)}>
              {superliga.status === 'NAO_INICIADO' ? 'Não Iniciado' :
               superliga.status === 'EM_ANDAMENTO' ? 'Em Andamento' : 'Finalizado'}
            </p>
          </div>
        </div>

        {superliga.descricao && (
          <div className="mt-4">
            <label className="block text-sm text-gray-400 mb-1">Descrição</label>
            <p className="text-white">{superliga.descricao}</p>
          </div>
        )}
      </div>

      <div className="bg-[#272731] rounded-lg border border-gray-700 p-6">
        <h3 className="text-white font-semibold mb-4">Ações</h3>
        
        <div className="space-y-3">
          <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
            Editar Informações Básicas
          </button>
          
          <button className="w-full bg-yellow-600 text-white py-2 px-4 rounded-md hover:bg-yellow-700 transition-colors">
            Resetar Playoffs
          </button>
          
          <button className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors flex items-center justify-center gap-2">
            <Download className="w-4 h-4" />
            Exportar Relatório
          </button>
          
          <button className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors">
            Deletar Superliga
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#1C1C24] p-6">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/admin/superliga"
          className="flex items-center gap-2 text-[#63E300] hover:text-[#50B800] mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para Superligas
        </Link>

        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-[#63E300] bg-opacity-20 rounded-lg">
            <Trophy className="w-8 h-8 text-[#63E300]" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-[#63E300] italic tracking-[-2px]">
              {superliga.nome}
            </h1>
            <p className="text-gray-400">Temporada {superliga.temporada}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-700">
          <nav className="-mb-px flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors
                    ${activeTab === tab.id
                      ? 'border-[#63E300] text-[#63E300]'
                      : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600'
                    }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Conteúdo das Tabs */}
      <div className="max-w-6xl mx-auto">
        {activeTab === 'visao-geral' && renderVisaoGeral()}
        {activeTab === 'conferencias' && renderConferencias()}
        {activeTab === 'temporada-regular' && renderTemporadaRegular()}
        {activeTab === 'playoffs' && renderPlayoffs()}
        {activeTab === 'configuracoes' && renderConfiguracoes()}
      </div>
    </div>
  )
}