"use client"

import { useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft, Trophy, Play, Calendar, Eye, Edit, Users,
  CheckCircle, Clock, AlertTriangle, Settings, Zap,
  Target, BarChart3, RefreshCw
} from 'lucide-react'
import { Loading } from '@/components/ui/Loading'
import { usePlayoffBracket, useFaseNacional } from '@/hooks/useSuperliga'

export default function AdminPlayoffsPage() {
  const [activeTab, setActiveTab] = useState<'conferencias' | 'nacional'>('conferencias')

  const temporada = '2025'

  const { data: bracket, isLoading: loadingBracket, refetch: refetchBracket } = usePlayoffBracket(temporada)
  const { data: faseNacional, isLoading: loadingNacional, refetch: refetchNacional } = useFaseNacional(temporada)

  const isLoading = loadingBracket || loadingNacional

  if (isLoading) return <Loading />

  const hasPlayoffs = bracket && Array.isArray(bracket) && bracket.length > 0
  const hasFaseNacional = faseNacional && Array.isArray(faseNacional) && faseNacional.length > 0

  const conferencias = [
    {
      id: 'SUDESTE',
      nome: 'Sudeste',
      icon: '🏭',
      color: 'red',
      description: '12 times, 3 regionais'
    },
    {
      id: 'SUL',
      nome: 'Sul',
      icon: '🧊',
      color: 'cyan',
      description: '8 times, 2 regionais'
    },
    {
      id: 'NORDESTE',
      nome: 'Nordeste',
      icon: '🌵',
      color: 'orange',
      description: '6 times, 1 regional'
    },
    {
      id: 'CENTRO_NORTE',
      nome: 'Centro-Norte',
      icon: '🌲',
      color: 'green',
      description: '6 times, 2 regionais'
    }
  ]

  const gerarPlayoffs = async () => {
    try {
      // Chamada para gerar playoffs
      // await SuperligaService.gerarPlayoffs(temporada)
      alert('Playoffs gerados com sucesso!')
      refetchBracket()
    } catch (error) {
      console.error('Erro ao gerar playoffs:', error)
      alert('Erro ao gerar playoffs')
    }
  }

  const gerarFaseNacional = async () => {
    try {
      // Chamada para gerar fase nacional
      // await SuperligaService.gerarFaseNacional(temporada)
      alert('Fase nacional gerada com sucesso!')
      refetchNacional()
    } catch (error) {
      console.error('Erro ao gerar fase nacional:', error)
      alert('Erro ao gerar fase nacional')
    }
  }

  const simularResultados = async () => {
    try {
      // Chamada para simular resultados
      // await SuperligaService.simularPlayoffs(temporada)
      alert('Resultados simulados com sucesso!')
      refetchBracket()
      refetchNacional()
    } catch (error) {
      console.error('Erro ao simular resultados:', error)
      alert('Erro ao simular resultados')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/admin/superliga"
          className="p-2 rounded-lg bg-[#272731] border border-gray-700 hover:border-gray-600 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </Link>

        <div className="flex-1">
          <h1 className="text-2xl font-bold text-white">Playoffs da Superliga</h1>
          <p className="text-gray-400">
            Gerencie os playoffs das conferências e a fase nacional
          </p>
        </div>

        <div className="flex gap-3">
          {!hasPlayoffs && (
            <button
              onClick={gerarPlayoffs}
              className="flex items-center gap-2 bg-[#63E300] text-black px-4 py-2 rounded-md font-semibold hover:bg-[#50B800] transition-colors"
            >
              <Zap className="w-4 h-4" />
              Gerar Playoffs
            </button>
          )}

          {hasPlayoffs && !hasFaseNacional && (
            <button
              onClick={gerarFaseNacional}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-blue-700 transition-colors"
            >
              <Trophy className="w-4 h-4" />
              Gerar Fase Nacional
            </button>
          )}

          {hasPlayoffs && (
            <button
              onClick={simularResultados}
              className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-purple-700 transition-colors"
            >
              <Play className="w-4 h-4" />
              Simular Resultados
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-[#272731] rounded-lg border border-gray-700">
        <div className="flex border-b border-gray-700">
          <button
            onClick={() => setActiveTab('conferencias')}
            className={`px-6 py-3 text-sm font-medium transition-colors ${activeTab === 'conferencias'
                ? 'bg-[#1C1C24] text-[#63E300] border-b-2 border-[#63E300]'
                : 'text-gray-400 hover:text-gray-300'
              }`}
          >
            Playoffs das Conferências
          </button>
          <button
            onClick={() => setActiveTab('nacional')}
            className={`px-6 py-3 text-sm font-medium transition-colors ${activeTab === 'nacional'
                ? 'bg-[#1C1C24] text-[#63E300] border-b-2 border-[#63E300]'
                : 'text-gray-400 hover:text-gray-300'
              }`}
          >
            Fase Nacional
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'conferencias' ? (
            <div className="space-y-6">
              {!hasPlayoffs ? (
                /* Estado: Playoffs não gerados */
                <div className="text-center py-12">
                  <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-8">
                    <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-yellow-400 mb-2">
                      Playoffs não gerados
                    </h3>
                    <p className="text-gray-300 mb-6">
                      Para gerar os playoffs, a temporada regular deve estar concluída.
                      Verifique se todos os jogos foram finalizados.
                    </p>

                    <div className="flex items-center justify-center gap-4">
                      <button
                        onClick={gerarPlayoffs}
                        className="flex items-center gap-2 bg-[#63E300] text-black px-6 py-3 rounded-md font-semibold hover:bg-[#50B800] transition-colors"
                      >
                        <Zap className="w-5 h-5" />
                        Gerar Playoffs Agora
                      </button>

                      <Link
                        href="/admin/superliga/temporada-regular"
                        className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        <Calendar className="w-4 h-4" />
                        Ver Temporada Regular
                      </Link>
                    </div>
                  </div>
                </div>
              ) : (
                /* Estado: Playoffs gerados */
                <div className="space-y-6">
                  {/* Status dos Playoffs */}
                  <div className="bg-[#1C1C24] rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-white mb-1">
                          Status dos Playoffs das Conferências
                        </h3>
                        <p className="text-gray-400">
                          Acompanhe o progresso de cada conferência
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-400" />
                        <span className="text-green-400 font-semibold">Playoffs Ativos</span>
                      </div>
                    </div>
                  </div>

                  {/* Grid das Conferências */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {conferencias.map(conferencia => (
                      <div key={conferencia.id} className="bg-[#1C1C24] rounded-lg border border-gray-700 p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="text-2xl">{conferencia.icon}</div>
                          <div>
                            <h4 className="text-lg font-bold text-white">
                              Conferência {conferencia.nome}
                            </h4>
                            <p className="text-sm text-gray-400">
                              {conferencia.description}
                            </p>
                          </div>
                        </div>

                        {/* Fases dos Playoffs */}
                        <div className="space-y-3 mb-4">
                          <div className="flex items-center justify-between p-2 bg-[#272731] rounded">
                            <span className="text-sm text-gray-300">Wild Card</span>
                            <CheckCircle className="w-4 h-4 text-green-400" />
                          </div>

                          <div className="flex items-center justify-between p-2 bg-[#272731] rounded">
                            <span className="text-sm text-gray-300">Semifinal</span>
                            <Clock className="w-4 h-4 text-yellow-400" />
                          </div>

                          <div className="flex items-center justify-between p-2 bg-[#272731] rounded">
                            <span className="text-sm text-gray-300">Final</span>
                            <Clock className="w-4 h-4 text-gray-400" />
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Link
                            href={`/superliga/${temporada}/wild-card`}
                            className="flex-1 flex items-center justify-center gap-2 bg-[#272731] text-gray-300 px-3 py-2 rounded text-sm hover:bg-gray-600 transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                            Visualizar
                          </Link>

                          <button
                            className="flex items-center justify-center gap-2 bg-[#63E300]/20 text-[#63E300] px-3 py-2 rounded text-sm hover:bg-[#63E300]/30 transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                            Gerenciar
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Ações Globais */}
                  <div className="bg-[#1C1C24] rounded-lg p-4">
                    <h4 className="text-lg font-bold text-white mb-3">Ações dos Playoffs</h4>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <button
                        onClick={simularResultados}
                        className="flex items-center justify-center gap-2 bg-purple-600 text-white px-4 py-3 rounded-md font-semibold hover:bg-purple-700 transition-colors"
                      >
                        <Play className="w-5 h-5" />
                        Simular Todos os Resultados
                      </button>

                      <Link
                        href="/admin/jogos"
                        className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-3 rounded-md font-semibold hover:bg-blue-700 transition-colors"
                      >
                        <Calendar className="w-5 h-5" />
                        Gerenciar Jogos
                      </Link>

                      <button
                        onClick={() => refetchBracket()}
                        className="flex items-center justify-center gap-2 bg-[#272731] text-white px-4 py-3 rounded-md font-semibold hover:bg-gray-600 transition-colors border border-gray-600"
                      >
                        <RefreshCw className="w-5 h-5" />
                        Atualizar
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Tab: Fase Nacional */
            <div className="space-y-6">
              {!hasFaseNacional ? (
                /* Estado: Fase Nacional não gerada */
                <div className="text-center py-12">
                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-8">
                    <Trophy className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-blue-400 mb-2">
                      Fase Nacional não gerada
                    </h3>
                    <p className="text-gray-300 mb-6">
                      Para gerar a fase nacional, todas as finais de conferência devem estar concluídas.
                      Verifique se os campeões de cada conferência foram definidos.
                    </p>

                    <div className="flex items-center justify-center gap-4">
                      <button
                        onClick={gerarFaseNacional}
                        className="flex items-center gap-2 bg-[#63E300] text-black px-6 py-3 rounded-md font-semibold hover:bg-[#50B800] transition-colors"
                      >
                        <Trophy className="w-5 h-5" />
                        Gerar Fase Nacional
                      </button>

                      <button
                        onClick={() => setActiveTab('conferencias')}
                        className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        Ver Playoffs das Conferências
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                /* Estado: Fase Nacional gerada */
                <div className="space-y-6">
                  {/* Status da Fase Nacional */}
                  <div className="bg-[#1C1C24] rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-white mb-1">
                          Fase Nacional - Superliga {temporada}
                        </h3>
                        <p className="text-gray-400">
                          Semifinais e Grande Final Nacional
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-400" />
                        <span className="text-green-400 font-semibold">Fase Nacional Ativa</span>
                      </div>
                    </div>
                  </div>

                  {/* Semifinais Nacionais */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-[#1C1C24] rounded-lg border border-gray-700 p-6">
                      <h4 className="text-lg font-bold text-white mb-4">
                        Semifinal Nacional 2
                      </h4>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-[#272731] rounded">
                          <span className="text-gray-300">🌵 Campeão Nordeste</span>
                          <span className="text-gray-400">vs</span>
                          <span className="text-gray-300">🌲 Campeão Centro-Norte</span>
                        </div>

                        <div className="text-center text-sm text-gray-400">
                          Data: A definir
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Grande Final Nacional */}
                  <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-lg p-6">
                    <div className="text-center">
                      <Trophy className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                      <h3 className="text-2xl font-bold text-yellow-400 mb-2">
                        Grande Final Nacional
                      </h3>
                      <p className="text-gray-300 mb-4">
                        O jogo decisivo da Superliga de Futebol Americano {temporada}
                      </p>

                      <div className="flex items-center justify-center gap-4 p-4 bg-[#1C1C24] rounded-lg">
                        <span className="text-gray-300">Vencedor Semifinal 1</span>
                        <span className="text-yellow-400 font-bold">VS</span>
                        <span className="text-gray-300">Vencedor Semifinal 2</span>
                      </div>

                      <div className="mt-4 text-sm text-gray-400">
                        Data: A definir após as semifinais
                      </div>
                    </div>
                  </div>

                  {/* Ações da Fase Nacional */}
                  <div className="bg-[#1C1C24] rounded-lg p-4">
                    <h4 className="text-lg font-bold text-white mb-3">Ações da Fase Nacional</h4>

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
                        className="flex items-center justify-center gap-2 bg-purple-600 text-white px-4 py-3 rounded-md font-semibold hover:bg-purple-700 transition-colors"
                      >
                        <Play className="w-5 h-5" />
                        Simular
                      </button>

                      <button
                        onClick={() => refetchNacional()}
                        className="flex items-center justify-center gap-2 bg-[#272731] text-white px-4 py-3 rounded-md font-semibold hover:bg-gray-600 transition-colors border border-gray-600"
                      >
                        <RefreshCw className="w-5 h-5" />
                        Atualizar
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Estatísticas dos Playoffs */}
      {(hasPlayoffs || hasFaseNacional) && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-[#272731] rounded-lg border border-gray-700 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Trophy className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <div className="text-lg font-bold text-white">4</div>
                <div className="text-sm text-gray-400">Conferências</div>
              </div>
            </div>
          </div>

          <div className="bg-[#272731] rounded-lg border border-gray-700 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <Users className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <div className="text-lg font-bold text-white">16</div>
                <div className="text-sm text-gray-400">Times Classificados</div>
              </div>
            </div>
          </div>

          <div className="bg-[#272731] rounded-lg border border-gray-700 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <Calendar className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <div className="text-lg font-bold text-white">0</div>
                <div className="text-sm text-gray-400">Jogos Realizados</div>
              </div>
            </div>
          </div>

          <div className="bg-[#272731] rounded-lg border border-gray-700 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-500/20 rounded-lg">
                <Target className="w-5 h-5 text-yellow-400" />
              </div>
              <div>
                <div className="text-lg font-bold text-white">Wild Card</div>
                <div className="text-sm text-gray-400">Fase Atual</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Guia de Estrutura dos Playoffs */}
      <div className="bg-[#272731] rounded-lg border border-gray-700 p-6">
        <h3 className="text-lg font-bold text-white mb-4">Estrutura dos Playoffs</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-[#63E300] mb-3">Playoffs das Conferências</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span className="text-gray-300">Wild Card: Times 3º-6º de cada conferência</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-gray-300">Semifinais: 1º e 2º colocados + vencedores wild card</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                <span className="text-gray-300">Finais: Define os 4 campeões de conferência</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-[#63E300] mb-3">Fase Nacional</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span className="text-gray-300">Semifinal 1: Sul vs Sudeste</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span className="text-gray-300">Semifinal 2: Nordeste vs Centro-Norte</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                <span className="text-gray-300">Grande Final: Vencedores das semifinais</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
                      <h4 className="text-lg font-bold text-white mb-4">
                        Semifinal Nacional 2
                      </h4>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-[#272731] rounded">
                          <span className="text-gray-300">🌵 Campeão Nordeste</span>
                          <span className="text-gray-400">vs</span>
                          <span className="text-gray-300">🌲 Campeão Centro-Norte</span>
                        </div>
                        
                        <div className="text-center text-sm text-gray-400">
                          Data: A definir
                        </div>
                      </div>
                    </div >
                  </div >

  {/* Grande Final Nacional */ }
  < div className = "bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-lg p-6" >
    <div className="text-center">
      <Trophy className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
      <h3 className="text-2xl font-bold text-yellow-400 mb-2">
        Grande Final Nacional
      </h3>
      <p className="text-gray-300 mb-4">
        O jogo decisivo da Superliga de Futebol Americano {temporada}
      </p>

      <div className="flex items-center justify-center gap-4 p-4 bg-[#1C1C24] rounded-lg">
        <span className="text-gray-300">Vencedor Semifinal 1</span>
        <span className="text-yellow-400 font-bold">VS</span>
        <span className="text-gray-300">Vencedor Semifinal 2</span>
      </div>

      <div className="mt-4 text-sm text-gray-400">
        Data: A definir após as semifinais
      </div>
    </div>
                  </div >

  {/* Ações da Fase Nacional */ }
  < div className = "bg-[#1C1C24] rounded-lg p-4" >
                    <h4 className="text-lg font-bold text-white mb-3">Ações da Fase Nacional</h4>
                    
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
                        className="flex items-center justify-center gap-2 bg-purple-600 text-white px-4 py-3 rounded-md font-semibold hover:bg-purple-700 transition-colors"
                      >
                        <Play className="w-5 h-5" />
                        Simular
                      </button>
                      
                      <button
                        onClick={() => refetchNacional()}
                        className="flex items-center justify-center gap-2 bg-[#272731] text-white px-4 py-3 rounded-md font-semibold hover:bg-gray-600 transition-colors border border-gray-600"
                      >
                        <RefreshCw className="w-5 h-5" />
                        Atualizar
                      </button>
                    </div>
                  </div >
                </div >
              )}
            </div >
          )}
        </div >
      </div >

  {/* Estatísticas dos Playoffs */ }
{
  (hasPlayoffs || hasFaseNacional) && (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="bg-[#272731] rounded-lg border border-gray-700 p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/20 rounded-lg">
            <Trophy className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <div className="text-lg font-bold text-white">4</div>
            <div className="text-sm text-gray-400">Conferências</div>
          </div>
        </div>
      </div>

      <div className="bg-[#272731] rounded-lg border border-gray-700 p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-500/20 rounded-lg">
            <Users className="w-5 h-5 text-green-400" />
          </div>
          <div>
            <div className="text-lg font-bold text-white">16</div>
            <div className="text-sm text-gray-400">Times Classificados</div>
          </div>
        </div>
      </div>

      <div className="bg-[#272731] rounded-lg border border-gray-700 p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-500/20 rounded-lg">
            <Calendar className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <div className="text-lg font-bold text-white">0</div>
            <div className="text-sm text-gray-400">Jogos Realizados</div>
          </div>
        </div>
      </div>

      <div className="bg-[#272731] rounded-lg border border-gray-700 p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-yellow-500/20 rounded-lg">
            <Target className="w-5 h-5 text-yellow-400" />
          </div>
          <div>
            <div className="text-lg font-bold text-white">Wild Card</div>
            <div className="text-sm text-gray-400">Fase Atual</div>
          </div>
        </div>
      </div>
    </div>
  )
}

{/* Guia de Estrutura dos Playoffs */ }
<div className="bg-[#272731] rounded-lg border border-gray-700 p-6">
  <h3 className="text-lg font-bold text-white mb-4">Estrutura dos Playoffs</h3>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div>
      <h4 className="font-semibold text-[#63E300] mb-3">Playoffs das Conferências</h4>
      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
          <span className="text-gray-300">Wild Card: Times 3º-6º de cada conferência</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
          <span className="text-gray-300">Semifinais: 1º e 2º colocados + vencedores wild card</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
          <span className="text-gray-300">Finais: Define os 4 campeões de conferência</span>
        </div>
      </div>
    </div>

    <div>
      <h4 className="font-semibold text-[#63E300] mb-3">Fase Nacional</h4>
      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
          <span className="text-gray-300">Semifinal 1: Sul vs Sudeste</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
          <span className="text-gray-300">Semifinal 2: Nordeste vs Centro-Norte</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-red-400 rounded-full"></div>
          <span className="text-gray-300">Grande Final: Vencedores das semifinais</span>
        </div>
      </div>
    </div>
  </div>
</div>
    </div >
  )
}
                      <h4 className="text-lg font-bold text-white mb-4">
                        Semifinal Nacional 1
                      </h4>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-[#272731] rounded">
                          <span className="text-gray-300">🧊 Campeão Sul</span>
                          <span className="text-gray-400">vs</span>
                          <span className="text-gray-300">🏭 Campeão Sudeste</span>
                        </div>
                        
                        <div className="text-center text-sm text-gray-400">
                          Data: A definir
                        </div>
                      </div>
                    </div >

  <div className="bg-[#1C1C24] rounded-lg border border-gray-700 p-6">