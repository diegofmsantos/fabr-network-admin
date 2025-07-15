"use client"

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Trophy, Play, Eye, Edit, Users, Zap, Target, BarChart3, RefreshCw, Plus, Award } from 'lucide-react'
import { Loading } from '@/components/ui/Loading'
import { usePlayoffBracket, useFaseNacional, useStatusSuperliga } from '@/hooks/useSuperliga'

export default function AdminPlayoffsPage() {
  const [activeTab, setActiveTab] = useState<'conferencias' | 'nacional'>('conferencias')
  const [selectedConferencia, setSelectedConferencia] = useState<string>('all')

  const temporada = '2025'

  const { data: bracket, isLoading: loadingBracket, refetch: refetchBracket } = usePlayoffBracket(temporada)
  const { data: faseNacional, isLoading: loadingNacional, refetch: refetchNacional } = useFaseNacional(temporada)
  const { data: status, isLoading: loadingStatus } = useStatusSuperliga(temporada)

  const isLoading = loadingBracket || loadingNacional || loadingStatus

  if (isLoading) return <Loading />

  const hasPlayoffs = bracket && Array.isArray(bracket) && bracket.length > 0
  const hasFaseNacional = faseNacional && Array.isArray(faseNacional) && faseNacional.length > 0
  const superligaStatus = status as any

  const conferencias = [
    {
      id: 'SUDESTE',
      nome: 'Sudeste',
      icon: '🏭',
      color: 'red',
      description: '12 times, 3 regionais',
      status: hasPlayoffs ? 'Gerado' : 'Pendente'
    },
    {
      id: 'SUL',
      nome: 'Sul',
      icon: '🧊',
      color: 'cyan',
      description: '8 times, 2 regionais',
      status: hasPlayoffs ? 'Gerado' : 'Pendente'
    },
    {
      id: 'NORDESTE',
      nome: 'Nordeste',
      icon: '🌵',
      color: 'orange',
      description: '6 times, 1 regional',
      status: hasPlayoffs ? 'Gerado' : 'Pendente'
    },
    {
      id: 'CENTRO_NORTE',
      nome: 'Centro-Norte',
      icon: '🌲',
      color: 'green',
      description: '6 times, 2 regionais',
      status: hasPlayoffs ? 'Gerado' : 'Pendente'
    }
  ]

  const gerarPlayoffs = async () => {
    try {
      alert('Playoffs gerados com sucesso!')
      refetchBracket()
    } catch (error) {
      console.error('Erro ao gerar playoffs:', error)
      alert('Erro ao gerar playoffs')
    }
  }

  const gerarFaseNacional = async () => {
    try {
      alert('Fase nacional gerada com sucesso!')
      refetchNacional()
    } catch (error) {
      console.error('Erro ao gerar fase nacional:', error)
      alert('Erro ao gerar fase nacional')
    }
  }

  const simularResultados = async () => {
    try {
      alert('Resultados simulados com sucesso!')
      refetchBracket()
      refetchNacional()
    } catch (error) {
      console.error('Erro ao simular:', error)
      alert('Erro ao simular resultados')
    }
  }

  const resetarPlayoffs = async () => {
    if (confirm('Tem certeza que deseja resetar todos os playoffs? Esta ação não pode ser desfeita.')) {
      try {
        alert('Playoffs resetados com sucesso!')
        refetchBracket()
        refetchNacional()
      } catch (error) {
        console.error('Erro ao resetar:', error)
        alert('Erro ao resetar playoffs')
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/admin/superliga"
          className="p-2 rounded-lg bg-[#272731] border border-gray-700 hover:border-gray-600 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </Link>

        <div className="flex-1">
          <h1 className="text-2xl font-bold text-white">Playoffs da Superliga {temporada}</h1>
          <p className="text-gray-400">Gerencie os playoffs das conferências e a fase nacional</p>
        </div>

        <div className="flex gap-3">
          {!hasPlayoffs && (
            <button
              onClick={gerarPlayoffs}
              className="flex items-center gap-2 bg-[#63E300] text-black px-4 py-2 rounded-md font-semibold hover:bg-[#50B800] transition-colors"
            >
              <Plus className="w-4 h-4" />
              Gerar Playoffs
            </button>
          )}

          <Link
            href={`/superliga/${temporada}/wild-card`}
            className="flex items-center gap-2 bg-[#1C1C24] text-white px-4 py-2 rounded-md border border-gray-700 hover:border-gray-600 transition-colors"
          >
            <Eye className="w-4 h-4" />
            Ver Site Público
          </Link>
        </div>
      </div>

      <div className="bg-[#272731] rounded-lg border border-gray-700 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Trophy className="w-8 h-8 text-yellow-400" />
            <div>
              <h3 className="text-lg font-bold text-white">Status dos Playoffs</h3>
              <p className="text-gray-400">
                Status atual: <span className="text-[#63E300] font-medium">
                  {superligaStatus?.status === 'PLAYOFFS' ? 'Em andamento' : 'Aguardando temporada regular'}
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-white">{hasPlayoffs ? '16' : '0'}</p>
              <p className="text-sm text-gray-400">Times classificados</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-white">{hasFaseNacional ? '4' : '0'}</p>
              <p className="text-sm text-gray-400">Campeões de conferência</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#272731] rounded-lg border border-gray-700">
        <div className="border-b border-gray-700">
          <nav className="flex">
            {[
              { id: 'conferencias', label: 'Playoffs das Conferências', icon: Users },
              { id: 'nacional', label: 'Fase Nacional', icon: Award }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.id
                    ? 'border-[#63E300] text-[#63E300]'
                    : 'border-transparent text-gray-400 hover:text-white'
                  }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'conferencias' && (
            <div className="space-y-6">
              {!hasPlayoffs ? (
                <div className="text-center py-12">
                  <Trophy className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">Playoffs não gerados</h3>
                  <p className="text-gray-400 mb-6">
                    A temporada regular deve estar concluída para gerar os playoffs
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md mx-auto">
                    <button
                      onClick={gerarPlayoffs}
                      disabled={superligaStatus?.status !== 'EM_ANDAMENTO'}
                      className={`flex items-center justify-center gap-2 px-6 py-3 rounded-md font-semibold transition-colors ${superligaStatus?.status === 'EM_ANDAMENTO'
                          ? 'bg-[#63E300] text-black hover:bg-[#50B800]'
                          : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                        }`}
                    >
                      <Plus className="w-5 h-5" />
                      Gerar Playoffs
                    </button>

                    <button
                      onClick={simularResultados}
                      className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-blue-700 transition-colors"
                    >
                      <Zap className="w-5 h-5" />
                      Simular Resultados
                    </button>
                  </div>

                  <div className="mt-8">
                    <h4 className="text-lg font-bold text-white mb-4">Estrutura dos Playoffs</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {conferencias.map((conf) => (
                        <div key={conf.id} className="bg-[#1C1C24] rounded-lg p-4 border border-gray-700">
                          <div className="flex items-center gap-2 mb-3">
                            <span className="text-2xl">{conf.icon}</span>
                            <div>
                              <h5 className="font-bold text-white">Conferência {conf.nome}</h5>
                              <p className="text-xs text-gray-400">{conf.description}</p>
                            </div>
                          </div>

                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-400">Wild Card:</span>
                              <span className="text-white">2 jogos</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Semifinal:</span>
                              <span className="text-white">2 jogos</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Final:</span>
                              <span className="text-white">1 jogo</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <label className="text-sm text-gray-400">Filtrar por conferência:</label>
                    <select
                      value={selectedConferencia}
                      onChange={(e) => setSelectedConferencia(e.target.value)}
                      className="px-4 py-2 bg-[#1C1C24] text-white rounded-md border border-gray-700 focus:border-[#63E300] focus:outline-none"
                    >
                      <option value="all">Todas as conferências</option>
                      {conferencias.map((conf) => (
                        <option key={conf.id} value={conf.id}>
                          {conf.icon} {conf.nome}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {conferencias
                      .filter(conf => selectedConferencia === 'all' || conf.id === selectedConferencia)
                      .map((conf) => (
                        <div key={conf.id} className="bg-[#1C1C24] rounded-lg border border-gray-700">
                          <div className="p-4 border-b border-gray-700">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <span className="text-2xl">{conf.icon}</span>
                                <div>
                                  <h4 className="text-lg font-bold text-white">Conferência {conf.nome}</h4>
                                  <p className="text-sm text-gray-400">{conf.description}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className={`px-2 py-1 rounded text-xs font-medium ${conf.status === 'Gerado'
                                    ? 'bg-green-500/20 text-green-400'
                                    : 'bg-yellow-500/20 text-yellow-400'
                                  }`}>
                                  {conf.status}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="p-4 space-y-4">
                            <div>
                              <h5 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                                <Target className="w-4 h-4" />
                                Wild Card
                              </h5>
                              <div className="space-y-2">
                                <div className="flex items-center justify-between p-3 bg-[#272731] rounded-md">
                                  <div className="flex items-center gap-2">
                                    <span className="text-white text-sm">WC1: Time A vs Time B</span>
                                    <div className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded">AGENDADO</div>
                                  </div>
                                  <button className="text-gray-400 hover:text-white">
                                    <Edit className="w-4 h-4" />
                                  </button>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-[#272731] rounded-md">
                                  <div className="flex items-center gap-2">
                                    <span className="text-white text-sm">WC2: Time C vs Time D</span>
                                    <div className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded">AGENDADO</div>
                                  </div>
                                  <button className="text-gray-400 hover:text-white">
                                    <Edit className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            </div>

                            <div>
                              <h5 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                                <Trophy className="w-4 h-4" />
                                Semifinal
                              </h5>
                              <div className="space-y-2">
                                <div className="flex items-center justify-between p-3 bg-[#272731] rounded-md">
                                  <div className="flex items-center gap-2">
                                    <span className="text-white text-sm">SF1: 1º Lugar vs Vencedor WC</span>
                                    <div className="px-2 py-1 bg-gray-500/20 text-gray-400 text-xs rounded">AGUARDANDO</div>
                                  </div>
                                  <button className="text-gray-400 hover:text-white">
                                    <Edit className="w-4 h-4" />
                                  </button>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-[#272731] rounded-md">
                                  <div className="flex items-center gap-2">
                                    <span className="text-white text-sm">SF2: 2º Lugar vs Vencedor WC</span>
                                    <div className="px-2 py-1 bg-gray-500/20 text-gray-400 text-xs rounded">AGUARDANDO</div>
                                  </div>
                                  <button className="text-gray-400 hover:text-white">
                                    <Edit className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            </div>

                            <div>
                              <h5 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                                <Award className="w-4 h-4" />
                                Final da Conferência
                              </h5>
                              <div className="flex items-center justify-between p-3 bg-[#272731] rounded-md">
                                <div className="flex items-center gap-2">
                                  <span className="text-white text-sm">Final: Vencedor SF1 vs Vencedor SF2</span>
                                  <div className="px-2 py-1 bg-gray-500/20 text-gray-400 text-xs rounded">AGUARDANDO</div>
                                </div>
                                <button className="text-gray-400 hover:text-white">
                                  <Edit className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>

                          <div className="p-4 border-t border-gray-700">
                            <div className="flex gap-2">
                              <Link
                                href={`/superliga/${temporada}/semifinal-conferencia`}
                                className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                              >
                                <Eye className="w-4 h-4" />
                                Visualizar
                              </Link>
                              <button className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-green-700 transition-colors">
                                <Play className="w-4 h-4" />
                                Simular
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>

                  <div className="bg-[#1C1C24] rounded-lg p-6">
                    <h4 className="text-white font-semibold mb-4">Ações dos Playoffs</h4>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <button
                        onClick={simularResultados}
                        className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-3 rounded-md font-semibold hover:bg-blue-700 transition-colors"
                      >
                        <Zap className="w-5 h-5" />
                        Simular Todos
                      </button>

                      <button
                        onClick={() => refetchBracket()}
                        className="flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-3 rounded-md font-semibold hover:bg-green-700 transition-colors"
                      >
                        <RefreshCw className="w-5 h-5" />
                        Atualizar
                      </button>

                      <button className="flex items-center justify-center gap-2 bg-purple-600 text-white px-4 py-3 rounded-md font-semibold hover:bg-purple-700 transition-colors">
                        <BarChart3 className="w-5 h-5" />
                        Relatórios
                      </button>

                      <button
                        onClick={resetarPlayoffs}
                        className="flex items-center justify-center gap-2 bg-red-600 text-white px-4 py-3 rounded-md font-semibold hover:bg-red-700 transition-colors"
                      >
                        <RefreshCw className="w-5 h-5" />
                        Resetar
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'nacional' && (
            <div className="space-y-6">
              {!hasFaseNacional ? (
                <div className="text-center py-12">
                  <Award className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">Fase Nacional não gerada</h3>
                  <p className="text-gray-400 mb-6">
                    As finais de conferência devem estar concluídas para gerar a fase nacional
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md mx-auto">
                    <button
                      onClick={gerarFaseNacional}
                      disabled={!hasPlayoffs}
                      className={`flex items-center justify-center gap-2 px-6 py-3 rounded-md font-semibold transition-colors ${hasPlayoffs
                          ? 'bg-[#63E300] text-black hover:bg-[#50B800]'
                          : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                        }`}
                    >
                      <Plus className="w-5 h-5" />
                      Gerar Fase Nacional
                    </button>

                    <button
                      onClick={simularResultados}
                      className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-blue-700 transition-colors"
                    >
                      <Zap className="w-5 h-5" />
                      Simular
                    </button>
                  </div>

                  <div className="mt-8 max-w-4xl mx-auto">
                    <h4 className="text-lg font-bold text-white mb-6">Estrutura da Fase Nacional</h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                      <div className="bg-[#1C1C24] rounded-lg p-6 border border-gray-700">
                        <h5 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                          <Trophy className="w-5 h-5" />
                          Semifinal Nacional 1
                        </h5>
                        <div className="space-y-3">
                          <div className="flex items-center justify-center gap-4 p-4 bg-[#272731] rounded-lg">
                            <div className="text-center">
                              <span className="text-gray-300">🧊 Campeão Sul</span>
                            </div>
                            <span className="text-gray-400 font-bold">VS</span>
                            <div className="text-center">
                              <span className="text-gray-300">🏭 Campeão Sudeste</span>
                            </div>
                          </div>
                          <div className="text-center text-sm text-gray-400">
                            Data: A definir após finais de conferência
                          </div>
                        </div>
                      </div>

                      <div className="bg-[#1C1C24] rounded-lg p-6 border border-gray-700">
                        <h5 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                          <Trophy className="w-5 h-5" />
                          Semifinal Nacional 2
                        </h5>
                        <div className="space-y-3">
                          <div className="flex items-center justify-center gap-4 p-4 bg-[#272731] rounded-lg">
                            <div className="text-center">
                              <span className="text-gray-300">🌵 Campeão Nordeste</span>
                            </div>
                            <span className="text-gray-400 font-bold">VS</span>
                            <div className="text-center">
                              <span className="text-gray-300">🌲 Campeão Centro-Norte</span>
                            </div>
                          </div>
                          <div className="text-center text-sm text-gray-400">
                            Data: A definir após finais de conferência
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-lg p-6">
                      <div className="text-center">
                        <Trophy className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                        <h5 className="text-2xl font-bold text-yellow-400 mb-2">
                          Grande Final Nacional
                        </h5>
                        <p className="text-gray-300 mb-4">
                          O jogo decisivo da Superliga de Futebol Americano {temporada}
                        </p>

                        <div className="flex items-center justify-center gap-4 p-4 bg-[#1C1C24] rounded-lg">
                          <span className="text-gray-300">Vencedor Semifinal 1</span>
                          <span className="text-yellow-400 font-bold">VS</span>
                          <span className="text-gray-300">Vencedor Semifinal 2</span>
                        </div>

                        <div className="mt-4 text-sm text-gray-400">
                          Data: A definir após as semifinais nacionais
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-[#1C1C24] rounded-lg border border-gray-700">
                      <div className="p-4 border-b border-gray-700">
                        <h4 className="text-lg font-bold text-white flex items-center gap-2">
                          <Trophy className="w-5 h-5 text-blue-400" />
                          Semifinal Nacional 1
                        </h4>
                      </div>
                      <div className="p-4">
                        <div className="flex items-center justify-between p-4 bg-[#272731] rounded-lg mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center">
                              <span className="text-xs font-bold">🧊</span>
                            </div>
                            <div>
                              <p className="text-white font-medium">Time Sul</p>
                              <p className="text-sm text-gray-400">Campeão Sul</p>
                            </div>
                          </div>
                          <div className="text-center">
                            <p className="text-2xl font-bold text-white">21</p>
                            <div className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded">FINALIZADO</div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-[#272731] rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                              <span className="text-xs font-bold">🏭</span>
                            </div>
                            <div>
                              <p className="text-white font-medium">Time Sudeste</p>
                              <p className="text-sm text-gray-400">Campeão Sudeste</p>
                            </div>
                          </div>
                          <div className="text-center">
                            <p className="text-2xl font-bold text-gray-400">14</p>
                          </div>
                        </div>

                        <div className="mt-4 flex gap-2">
                          <Link
                            href={`/superliga/${temporada}/semifinal-nacional`}
                            className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                            Ver Detalhes
                          </Link>
                          <button className="flex items-center justify-center gap-2 bg-gray-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 transition-colors">
                            <Edit className="w-4 h-4" />
                            Editar
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="bg-[#1C1C24] rounded-lg border border-gray-700">
                      <div className="p-4 border-b border-gray-700">
                        <h4 className="text-lg font-bold text-white flex items-center gap-2">
                          <Trophy className="w-5 h-5 text-orange-400" />
                          Semifinal Nacional 2
                        </h4>
                      </div>
                      <div className="p-4">
                        <div className="flex items-center justify-between p-4 bg-[#272731] rounded-lg mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                              <span className="text-xs font-bold">🌵</span>
                            </div>
                            <div>
                              <p className="text-white font-medium">Time Nordeste</p>
                              <p className="text-sm text-gray-400">Campeão Nordeste</p>
                            </div>
                          </div>
                          <div className="text-center">
                            <p className="text-2xl font-bold text-white">28</p>
                            <div className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded">FINALIZADO</div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-[#272731] rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                              <span className="text-xs font-bold">🌲</span>
                            </div>
                            <div>
                              <p className="text-white font-medium">Time Centro-Norte</p>
                              <p className="text-sm text-gray-400">Campeão Centro-Norte</p>
                            </div>
                          </div>
                          <div className="text-center">
                            <p className="text-2xl font-bold text-gray-400">17</p>
                          </div>
                        </div>

                        <div className="mt-4 flex gap-2">
                          <Link
                            href={`/superliga/${temporada}/semifinal-nacional`}
                            className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                            Ver Detalhes
                          </Link>
                          <button className="flex items-center justify-center gap-2 bg-gray-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 transition-colors">
                            <Edit className="w-4 h-4" />
                            Editar
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-lg p-6">
                    <div className="text-center">
                      <Trophy className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                      <h3 className="text-2xl font-bold text-yellow-400 mb-2">
                        Grande Final Nacional
                      </h3>
                      <p className="text-gray-300 mb-6">
                        O jogo decisivo da Superliga de Futebol Americano {temporada}
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center mb-6">
                        <div className="flex items-center justify-center gap-3 p-4 bg-[#1C1C24] rounded-lg">
                          <div className="w-10 h-10 bg-cyan-500 rounded-full flex items-center justify-center">
                            <span className="font-bold">🧊</span>
                          </div>
                          <div>
                            <p className="text-white font-bold">Time Sul</p>
                            <p className="text-sm text-gray-400">Vencedor SF1</p>
                          </div>
                        </div>

                        <div className="text-center">
                          <div className="text-yellow-400 font-bold text-xl mb-2">VS</div>
                          <div className="px-3 py-1 bg-blue-500/20 text-blue-400 text-sm rounded">AGENDADO</div>
                        </div>

                        <div className="flex items-center justify-center gap-3 p-4 bg-[#1C1C24] rounded-lg">
                          <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                            <span className="font-bold">🌵</span>
                          </div>
                          <div>
                            <p className="text-white font-bold">Time Nordeste</p>
                            <p className="text-sm text-gray-400">Vencedor SF2</p>
                          </div>
                        </div>
                      </div>

                      <div className="text-center mb-6">
                        <p className="text-gray-400 mb-2">Data e horário:</p>
                        <p className="text-white font-medium">15 de dezembro de 2025, 16:00</p>
                        <p className="text-gray-400 text-sm">Local: Arena Nacional</p>
                      </div>

                      <div className="flex justify-center gap-4">
                        <Link
                          href={`/superliga/${temporada}/final-nacional`}
                          className="flex items-center gap-2 bg-[#63E300] text-black px-6 py-3 rounded-md font-semibold hover:bg-[#50B800] transition-colors"
                        >
                          <Eye className="w-5 h-5" />
                          Ver Final Nacional
                        </Link>
                        <button className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-blue-700 transition-colors">
                          <Edit className="w-5 h-5" />
                          Editar Resultado
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#1C1C24] rounded-lg p-6">
                    <h4 className="text-white font-semibold mb-4">Ações da Fase Nacional</h4>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <Link
                        href={`/superliga/${temporada}/semifinal-nacional`}
                        className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-3 rounded-md font-semibold hover:bg-blue-700 transition-colors"
                      >
                        <Eye className="w-5 h-5" />
                        Ver Semifinais
                      </Link>

                      <Link
                        href={`/superliga/${temporada}/final-nacional`}
                        className="flex items-center justify-center gap-2 bg-yellow-600 text-white px-4 py-3 rounded-md font-semibold hover:bg-yellow-700 transition-colors"
                      >
                        <Trophy className="w-5 h-5" />
                        Ver Final
                      </Link>

                      <button
                        onClick={simularResultados}
                        className="flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-3 rounded-md font-semibold hover:bg-green-700 transition-colors"
                      >
                        <Zap className="w-5 h-5" />
                        Simular
                      </button>

                      <button className="flex items-center justify-center gap-2 bg-purple-600 text-white px-4 py-3 rounded-md font-semibold hover:bg-purple-700 transition-colors">
                        <BarChart3 className="w-5 h-5" />
                        Relatórios
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}