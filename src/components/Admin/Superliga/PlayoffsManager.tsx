// src/components/Admin/Superliga/PlayoffsManager.tsx
"use client"

import React, { useState } from 'react'
import { Trophy, Crown, Target, Play, CheckCircle, Clock, AlertTriangle, Zap, Eye, Edit, RotateCcw, Download } from 'lucide-react'

import { Loading } from '@/components/ui/Loading'
import Image from 'next/image'
import { ImageService } from '@/utils/services/ImageService'
import { useAtualizarResultadoPlayoff, useGerarFinalNacional, useGerarPlayoffs, useGerarSemifinaisNacionais, usePlayoffBracket, useResetarPlayoffs, useSimularPlayoffs } from '@/hooks/useSuperliga'

interface PlayoffsManagerProps {
  superligaId: number
  temporada: string
}

export const PlayoffsManager: React.FC<PlayoffsManagerProps> = ({ 
  superligaId, 
  temporada 
}) => {
  const [selectedConferencia, setSelectedConferencia] = useState<string>('SUDESTE')
  const [showModal, setShowModal] = useState(false)
  const [selectedJogo, setSelectedJogo] = useState<any>(null)

  const { data: bracket, isLoading } = usePlayoffBracket(superligaId)
  const { mutate: gerarPlayoffs, isPending: gerandoPlayoffs } = useGerarPlayoffs()
  const { mutate: atualizarResultado } = useAtualizarResultadoPlayoff()
  const { mutate: gerarSemifinais, isPending: gerandoSemifinais } = useGerarSemifinaisNacionais()
  const { mutate: gerarFinal, isPending: gerandoFinal } = useGerarFinalNacional()
  const { mutate: resetarPlayoffs, isPending: resetando } = useResetarPlayoffs()
  const { mutate: simularPlayoffs, isPending: simulando } = useSimularPlayoffs()

  const conferencias = [
    { 
      tipo: 'SUDESTE', 
      nome: 'Sudeste', 
      icone: '🏭', 
      cor: 'bg-orange-500',
      descricao: '12 times • 3 regionais'
    },
    { 
      tipo: 'SUL', 
      nome: 'Sul', 
      icone: '🧊', 
      cor: 'bg-blue-500',
      descricao: '8 times • 2 regionais'
    },
    { 
      tipo: 'NORDESTE', 
      nome: 'Nordeste', 
      icone: '🌵', 
      cor: 'bg-yellow-500',
      descricao: '6 times • 1 regional'
    },
    { 
      tipo: 'CENTRO_NORTE', 
      nome: 'Centro-Norte', 
      icone: '🌲', 
      cor: 'bg-green-500',
      descricao: '6 times • 2 regionais'
    }
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'AGUARDANDO': return <Clock className="w-4 h-4" />
      case 'AGENDADO': return <Target className="w-4 h-4" />
      case 'AO_VIVO': return <Play className="w-4 h-4" />
      case 'FINALIZADO': return <CheckCircle className="w-4 h-4" />
      default: return <AlertTriangle className="w-4 h-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'AGUARDANDO': return 'bg-gray-500'
      case 'AGENDADO': return 'bg-blue-500'
      case 'AO_VIVO': return 'bg-red-500'
      case 'FINALIZADO': return 'bg-green-500'
      default: return 'bg-gray-500'
    }
  }

  const getFaseNome = (fase: string) => {
    switch (fase) {
      case 'WILD_CARD': return 'Wild Card'
      case 'SEMIFINAL_CONF': return 'Semifinal'
      case 'FINAL_CONF': return 'Final'
      case 'SEMIFINAL_NACIONAL': return 'Semifinal Nacional'
      case 'FINAL_NACIONAL': return 'Final Nacional'
      default: return fase
    }
  }

  const JogoPlayoffCard = ({ jogo, size = 'normal' }: { jogo: any, size?: 'small' | 'normal' | 'large' }) => {
    const isSmall = size === 'small'
    const isLarge = size === 'large'
    
    return (
      <div className={`bg-[#272731] rounded-lg border border-gray-700 p-${isSmall ? '3' : '4'} hover:border-[#63E300] transition-colors cursor-pointer`}
           onClick={() => { setSelectedJogo(jogo); setShowModal(true) }}>
        
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className={`text-${isSmall ? 'xs' : 'sm'} text-gray-400`}>
              {getFaseNome(jogo.fase)}
            </span>
            <span className={`px-2 py-1 rounded-full text-xs text-white flex items-center gap-1 ${getStatusColor(jogo.status)}`}>
              {getStatusIcon(jogo.status)}
              {jogo.status === 'AGUARDANDO' ? 'Aguardando' :
               jogo.status === 'AGENDADO' ? 'Agendado' :
               jogo.status === 'FINALIZADO' ? 'Finalizado' : jogo.status}
            </span>
          </div>
          
          <div className="flex items-center gap-1">
            <button className="p-1 text-gray-400 hover:text-white transition-colors">
              <Eye className={`w-${isSmall ? '3' : '4'} h-${isSmall ? '3' : '4'}`} />
            </button>
            {jogo.status !== 'FINALIZADO' && (
              <button className="p-1 text-gray-400 hover:text-white transition-colors">
                <Edit className={`w-${isSmall ? '3' : '4'} h-${isSmall ? '3' : '4'}`} />
              </button>
            )}
          </div>
        </div>

        {/* Times */}
        <div className="space-y-2">
          {/* Time 1 */}
          <div className="flex items-center justify-between p-2 bg-[#1C1C24] rounded">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              {jogo.timeClassificado1 ? (
                <>
                  <Image
                    src={ImageService.getTeamLogo(jogo.timeClassificado1.nome)}
                    alt={`Logo ${jogo.timeClassificado1.nome}`}
                    width={isSmall ? 20 : 24}
                    height={isSmall ? 20 : 24}
                    className="rounded"
                    onError={(e) => ImageService.handleTeamLogoError(e, jogo.timeClassificado1.nome)}
                  />
                  <span className={`text-white font-medium ${isSmall ? 'text-sm' : ''} truncate`}>
                    {jogo.timeClassificado1.sigla || jogo.timeClassificado1.nome}
                  </span>
                </>
              ) : (
                <span className={`text-gray-500 ${isSmall ? 'text-sm' : ''}`}>
                  Aguardando classificação
                </span>
              )}
            </div>
            
            {jogo.status === 'FINALIZADO' && jogo.placarTime1 !== null && (
              <span className={`font-bold ${isSmall ? 'text-sm' : 'text-lg'} ${
                jogo.placarTime1 > jogo.placarTime2 ? 'text-green-400' : 'text-gray-400'
              }`}>
                {jogo.placarTime1}
              </span>
            )}
          </div>

          {/* VS */}
          <div className="text-center">
            <span className="text-gray-500 font-bold text-xs">VS</span>
          </div>

          {/* Time 2 */}
          <div className="flex items-center justify-between p-2 bg-[#1C1C24] rounded">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              {jogo.timeClassificado2 ? (
                <>
                  <Image
                    src={ImageService.getTeamLogo(jogo.timeClassificado2.nome)}
                    alt={`Logo ${jogo.timeClassificado2.nome}`}
                    width={isSmall ? 20 : 24}
                    height={isSmall ? 20 : 24}
                    className="rounded"
                    onError={(e) => ImageService.handleTeamLogoError(e, jogo.timeClassificado2.nome)}
                  />
                  <span className={`text-white font-medium ${isSmall ? 'text-sm' : ''} truncate`}>
                    {jogo.timeClassificado2.sigla || jogo.timeClassificado2.nome}
                  </span>
                </>
              ) : (
                <span className={`text-gray-500 ${isSmall ? 'text-sm' : ''}`}>
                  Aguardando classificação
                </span>
              )}
            </div>
            
            {jogo.status === 'FINALIZADO' && jogo.placarTime2 !== null && (
              <span className={`font-bold ${isSmall ? 'text-sm' : 'text-lg'} ${
                jogo.placarTime2 > jogo.placarTime1 ? 'text-green-400' : 'text-gray-400'
              }`}>
                {jogo.placarTime2}
              </span>
            )}
          </div>
        </div>

        {/* Data */}
        {jogo.dataJogo && (
          <div className="mt-3 text-center">
            <span className={`text-gray-400 ${isSmall ? 'text-xs' : 'text-sm'}`}>
              {new Date(jogo.dataJogo).toLocaleDateString('pt-BR')}
            </span>
          </div>
        )}
      </div>
    )
  }

  const ConferenciaBracket = ({ conferencia, jogos }: { conferencia: any, jogos: any[] }) => {
    const wildCards = jogos.filter(j => j.fase === 'WILD_CARD')
    const semifinais = jogos.filter(j => j.fase === 'SEMIFINAL_CONF')
    const final = jogos.find(j => j.fase === 'FINAL_CONF')

    return (
      <div className="space-y-6">
        {/* Wild Cards */}
        {wildCards.length > 0 && (
          <div>
            <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Wild Card
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {wildCards.map(jogo => (
                <JogoPlayoffCard key={jogo.id} jogo={jogo} size="small" />
              ))}
            </div>
          </div>
        )}

        {/* Semifinais */}
        {semifinais.length > 0 && (
          <div>
            <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
              <Target className="w-4 h-4" />
              Semifinais de Conferência
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {semifinais.map(jogo => (
                <JogoPlayoffCard key={jogo.id} jogo={jogo} />
              ))}
            </div>
          </div>
        )}

        {/* Final */}
        {final && (
          <div>
            <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              Final de Conferência
            </h4>
            <div className="max-w-md mx-auto">
              <JogoPlayoffCard jogo={final} size="large" />
            </div>
          </div>
        )}

        {jogos.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Trophy className="w-12 h-12 mx-auto mb-3" />
            <p>Playoffs desta conferência ainda não foram gerados</p>
          </div>
        )}
      </div>
    )
  }

  const FaseNacional = () => {
    const semifinais = bracket?.semifinalNacional1 ? [bracket.semifinalNacional1] : []
    if (bracket?.semifinalNacional2) semifinais.push(bracket.semifinalNacional2)
    
    const final = bracket?.finalNacional

    return (
      <div className="space-y-8">
        {/* Semifinais Nacionais */}
        {semifinais.length > 0 && (
          <div>
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
              <Crown className="w-6 h-6 text-yellow-500" />
              Semifinais Nacionais
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {semifinais.map((jogo, index) => (
                <JogoPlayoffCard key={jogo.id || index} jogo={jogo} size="large" />
              ))}
            </div>
          </div>
        )}

        {/* Final Nacional */}
        {final && (
          <div>
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
              <Trophy className="w-6 h-6 text-[#63E300]" />
              Grande Decisão Nacional
            </h3>
            <div className="max-w-lg mx-auto">
              <div className="bg-gradient-to-r from-[#63E300] to-green-400 p-1 rounded-lg">
                <div className="bg-[#1C1C24] rounded-lg p-1">
                  <JogoPlayoffCard jogo={final} size="large" />
                </div>
              </div>
            </div>
          </div>
        )}

        {semifinais.length === 0 && !final && (
          <div className="text-center py-12 text-gray-500">
            <Crown className="w-16 h-16 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Fase Nacional</h3>
            <p className="mb-4">Aguardando conclusão das finais de conferência</p>
            <button
              onClick={() => gerarSemifinais(superligaId)}
              disabled={gerandoSemifinais}
              className="bg-[#63E300] text-black px-6 py-2 rounded-md font-medium hover:bg-[#50B800] transition-colors disabled:opacity-50"
            >
              {gerandoSemifinais ? 'Gerando...' : 'Gerar Semifinais Nacionais'}
            </button>
          </div>
        )}
      </div>
    )
  }

  if (isLoading) {
    return <Loading />
  }

  return (
    <div className="space-y-6">
      {/* Controles */}
      <div className="bg-[#272731] rounded-lg border border-gray-700 p-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h3 className="text-white font-semibold">Playoffs da Superliga</h3>
            <p className="text-gray-400 text-sm">
              Gerencie o chaveamento dos playoffs das 4 conferências
            </p>
          </div>

          <div className="flex items-center gap-3">
            {!bracket && (
              <button
                onClick={() => gerarPlayoffs(superligaId)}
                disabled={gerandoPlayoffs}
                className="bg-[#63E300] text-black px-4 py-2 rounded-md font-medium hover:bg-[#50B800] transition-colors disabled:opacity-50"
              >
                {gerandoPlayoffs ? 'Gerando...' : 'Gerar Playoffs'}
              </button>
            )}

            {bracket && (
              <>
                <button
                  onClick={() => simularPlayoffs(superligaId)}
                  disabled={simulando}
                  className="flex items-center gap-2 px-3 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors disabled:opacity-50"
                >
                  <Zap className="w-4 h-4" />
                  {simulando ? 'Simulando...' : 'Simular'}
                </button>

                <button
                  onClick={() => resetarPlayoffs(superligaId)}
                  disabled={resetando}
                  className="flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  <RotateCcw className="w-4 h-4" />
                  {resetando ? 'Resetando...' : 'Resetar'}
                </button>

                <button className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
                  <Download className="w-4 h-4" />
                  Exportar
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {!bracket ? (
        <div className="bg-[#272731] rounded-lg border border-gray-700 p-12 text-center">
          <Trophy className="w-16 h-16 text-gray-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Playoffs não gerados</h3>
          <p className="text-gray-400 mb-6">
            Gere os playoffs para começar o chaveamento das 4 conferências
          </p>
          <button
            onClick={() => gerarPlayoffs(superligaId)}
            disabled={gerandoPlayoffs}
            className="bg-[#63E300] text-black px-6 py-2 rounded-md font-medium hover:bg-[#50B800] transition-colors disabled:opacity-50"
          >
            {gerandoPlayoffs ? 'Gerando Playoffs...' : 'Gerar Playoffs da Superliga'}
          </button>
        </div>
      ) : (
        <>
          {/* Navegação */}
          <div className="bg-[#272731] rounded-lg border border-gray-700 p-4">
            <div className="flex flex-wrap gap-2">
              {conferencias.map((conf) => (
                <button
                  key={conf.tipo}
                  onClick={() => setSelectedConferencia(conf.tipo)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                    selectedConferencia === conf.tipo
                      ? 'bg-[#63E300] text-black'
                      : 'bg-[#1C1C24] text-gray-300 hover:bg-[#2A2A35]'
                  }`}
                >
                  <span className="text-lg">{conf.icone}</span>
                  <span className="font-medium">{conf.nome}</span>
                </button>
              ))}
              
              <button
                onClick={() => setSelectedConferencia('NACIONAL')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                  selectedConferencia === 'NACIONAL'
                    ? 'bg-[#63E300] text-black'
                    : 'bg-[#1C1C24] text-gray-300 hover:bg-[#2A2A35]'
                }`}
              >
                <Crown className="w-5 h-5" />
                <span className="font-medium">Nacional</span>
              </button>
            </div>
          </div>

          {/* Conteúdo */}
          {selectedConferencia === 'NACIONAL' ? (
            <FaseNacional />
          ) : (
            <div className="bg-[#272731] rounded-lg border border-gray-700 p-6">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-2xl">
                  {conferencias.find(c => c.tipo === selectedConferencia)?.icone}
                </span>
                <div>
                  <h3 className="text-xl font-bold text-white">
                    Playoffs {conferencias.find(c => c.tipo === selectedConferencia)?.nome}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    {conferencias.find(c => c.tipo === selectedConferencia)?.descricao}
                  </p>
                </div>
              </div>

              <ConferenciaBracket 
                conferencia={conferencias.find(c => c.tipo === selectedConferencia)}
                jogos={bracket[`playoffs${selectedConferencia.charAt(0) + selectedConferencia.slice(1).toLowerCase()}` as keyof typeof bracket] || []}
              />
            </div>
          )}
        </>
      )}

      {/* Modal de Jogo */}
      {showModal && selectedJogo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#272731] rounded-lg border border-gray-700 p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold">
                {getFaseNome(selectedJogo.fase)}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <JogoPlayoffCard jogo={selectedJogo} />
              
              <div className="flex gap-2">
                <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
                  Editar Resultado
                </button>
                <button className="flex-1 bg-[#63E300] text-black py-2 px-4 rounded-md hover:bg-[#50B800] transition-colors">
                  Ver Detalhes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}