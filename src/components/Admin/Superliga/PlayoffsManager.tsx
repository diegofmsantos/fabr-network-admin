"use client"

import React, { useState } from 'react'
import { Trophy, Crown, Target, Play, CheckCircle, Clock, AlertTriangle, Zap, Eye, Edit, Download, RefreshCw } from 'lucide-react'
import { Loading } from '@/components/ui/Loading'
import Image from 'next/image'
import { ImageService } from '@/utils/services/ImageService'
import { usePlayoffBracket } from '@/hooks/useSuperliga'

interface PlayoffsManagerProps {
  superligaId: number
  temporada: string
}

interface JogoPlayoff {
  id: number
  fase: string
  status: string
  nome?: string
  dataJogo?: string
  placarTime1?: number
  placarTime2?: number
  timeClassificado1?: {
    id: number
    nome: string
    sigla: string
    logo?: string
  }
  timeClassificado2?: {
    id: number
    nome: string
    sigla: string
    logo?: string
  }
}

interface BracketData {
  [key: string]: JogoPlayoff[] | JogoPlayoff | any
}

export const PlayoffsManager: React.FC<PlayoffsManagerProps> = ({
  superligaId,
  temporada
}) => {
  const [selectedConferencia, setSelectedConferencia] = useState<string>('SUDESTE')
  const [showModal, setShowModal] = useState(false)
  const [selectedJogo, setSelectedJogo] = useState<JogoPlayoff | null>(null)

  const { data: rawBracket, isLoading, error } = usePlayoffBracket(temporada)

  const bracket: BracketData | null = rawBracket && typeof rawBracket === 'object' ? rawBracket as BracketData : null

  const conferencias = [
    {
      tipo: 'SUDESTE',
      nome: 'Sudeste',
      icone: '🏭',
      cor: 'bg-red-500',
      descricao: '12 times • 3 regionais'
    },
    {
      tipo: 'SUL',
      nome: 'Sul',
      icone: '🧊',
      cor: 'bg-cyan-500',
      descricao: '8 times • 2 regionais'
    },
    {
      tipo: 'NORDESTE',
      nome: 'Nordeste',
      icone: '🌵',
      cor: 'bg-orange-500',
      descricao: '6 times • 1 regional'
    },
    {
      tipo: 'CENTRO NORTE',
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
      case 'AO VIVO': return <Play className="w-4 h-4" />
      case 'FINALIZADO': return <CheckCircle className="w-4 h-4" />
      default: return <AlertTriangle className="w-4 h-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'AGUARDANDO': return 'bg-gray-500'
      case 'AGENDADO': return 'bg-blue-500'
      case 'AO VIVO': return 'bg-red-500'
      case 'FINALIZADO': return 'bg-green-500'
      default: return 'bg-gray-500'
    }
  }

  const getFaseNome = (fase: string) => {
    switch (fase) {
      case 'WILD CARD': return 'Wild Card'
      case 'SEMIFINAL CONFERENCIA': return 'Semifinal'
      case 'FINAL CONFERENCIA': return 'Final'
      case 'SEMIFINAL NACIONAL': return 'Semifinal Nacional'
      case 'FINAL NACIONAL': return 'Final Nacional'
      default: return fase
    }
  }

  const JogoPlayoffCard = ({ jogo, size = 'normal' }: { jogo: JogoPlayoff, size?: 'small' | 'normal' | 'large' }) => {
    const isSmall = size === 'small'
    const cardPadding = isSmall ? 'p-3' : 'p-4'

    return (
      <div 
        className={`bg-[#272731] rounded-lg border border-gray-700 ${cardPadding} hover:border-[#63E300] transition-colors cursor-pointer`}
        onClick={() => { setSelectedJogo(jogo); setShowModal(true) }}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className={`${isSmall ? 'text-xs' : 'text-sm'} text-gray-400`}>
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
              <Eye className={`w-4 h-4`} />
            </button>
            {jogo.status !== 'FINALIZADO' && (
              <button className="p-1 text-gray-400 hover:text-white transition-colors">
                <Edit className={`w-4 h-4`} />
              </button>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between p-2 bg-[#1C1C24] rounded">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              {jogo.timeClassificado1 ? (
                <>
                  <Image
                    src={jogo.timeClassificado1.logo || '/placeholder-team.png'}
                    alt={jogo.timeClassificado1.nome}
                    width={isSmall ? 20 : 24}
                    height={isSmall ? 20 : 24}
                    className="rounded"
                    onError={(e) => ImageService.handleTeamLogoError(e, jogo.timeClassificado1?.nome || '')}
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

            {jogo.status === 'FINALIZADO' && jogo.placarTime1 !== undefined && (
              <span className={`font-bold ${isSmall ? 'text-sm' : 'text-lg'} ${
                (jogo.placarTime1 || 0) > (jogo.placarTime2 || 0) ? 'text-green-400' : 'text-gray-400'
              }`}>
                {jogo.placarTime1}
              </span>
            )}
          </div>

          <div className="flex items-center justify-between p-2 bg-[#1C1C24] rounded">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              {jogo.timeClassificado2 ? (
                <>
                  <Image
                    src={jogo.timeClassificado2.logo || '/placeholder-team.png'}
                    alt={jogo.timeClassificado2.nome}
                    width={isSmall ? 20 : 24}
                    height={isSmall ? 20 : 24}
                    className="rounded"
                    onError={(e) => ImageService.handleTeamLogoError(e, jogo.timeClassificado2?.nome || '')}
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

            {jogo.status === 'FINALIZADO' && jogo.placarTime2 !== undefined && (
              <span className={`font-bold ${isSmall ? 'text-sm' : 'text-lg'} ${
                (jogo.placarTime2 || 0) > (jogo.placarTime1 || 0) ? 'text-green-400' : 'text-gray-400'
              }`}>
                {jogo.placarTime2}
              </span>
            )}
          </div>
        </div>

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

  const ConferenciaBracket = ({ conferencia, jogos }: { conferencia: any, jogos: JogoPlayoff[] }) => {
    const wildCards = jogos.filter(j => j.fase === 'WILD CARD')
    const semifinais = jogos.filter(j => j.fase === 'SEMIFINAL CONFERENCIA')
    const final = jogos.find(j => j.fase === 'FINAL CONFERENCIA')

    return (
      <div className="space-y-6">
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

  const FaseNacionalView = () => {
    const semifinais: JogoPlayoff[] = []
    let final: JogoPlayoff | undefined

    if (bracket && typeof bracket === 'object') {
      Object.values(bracket).forEach((item: any) => {
        if (Array.isArray(item)) {
          item.forEach((jogo: any) => {
            if (jogo.fase === 'SEMIFINAL NACIONAL') {
              semifinais.push(jogo)
            } else if (jogo.fase === 'FINAL NACIONAL') {
              final = jogo
            }
          })
        } else if (item && typeof item === 'object' && item.fase) {
          if (item.fase === 'SEMIFINAL NACIONAL') {
            semifinais.push(item)
          } else if (item.fase === 'FINAL NACIONAL') {
            final = item
          }
        }
      })
    }

    return (
      <div className="space-y-8">
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
          </div>
        )}
      </div>
    )
  }

  const getJogosConferencia = (bracket: BracketData | null, conferencia: string): JogoPlayoff[] => {
    if (!bracket || typeof bracket !== 'object') return []

    const jogos: JogoPlayoff[] = []
    
    Object.entries(bracket).forEach(([key, value]) => {
      if (key.toLowerCase().includes(conferencia.toLowerCase()) || 
          (typeof value === 'object' && value !== null && 'conferencia' in value && value.conferencia === conferencia)) {
        
        if (Array.isArray(value)) {
          jogos.push(...value)
        } else if (value && typeof value === 'object' && 'jogos' in value && Array.isArray(value.jogos)) {
          jogos.push(...value.jogos)
        }
      }
    })

    return jogos
  }

  if (isLoading) {
    return <Loading />
  }

  if (error) {
    return (
      <div className="bg-[#272731] rounded-lg border border-red-700 p-12 text-center">
        <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">Erro ao carregar playoffs</h3>
        <p className="text-red-400">{error.message}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="bg-[#272731] rounded-lg border border-gray-700 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Playoffs da Superliga {temporada}
            </h2>
            <p className="text-gray-400">
              {!bracket 
                ? 'Os playoffs são gerados automaticamente quando a temporada regular é finalizada'
                : 'Playoffs gerados automaticamente após finalização da temporada regular'
              }
            </p>
          </div>

        </div>
      </div>

      {!bracket ? (
        <div className="bg-[#272731] rounded-lg border border-gray-700 p-12 text-center">
          <Trophy className="w-16 h-16 text-gray-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Playoffs serão gerados automaticamente</h3>
          <div className="text-gray-400 space-y-2">
            <p>Os playoffs são criados automaticamente quando:</p>
            <ul className="list-disc list-inside space-y-1 mt-4">
              <li>Todos os jogos da temporada regular forem finalizados</li>
              <li>Você importar a última planilha de resultados</li>
              <li>O sistema detectar que a temporada regular está completa</li>
            </ul>
            <div className="mt-6 p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
              <p className="text-blue-300 text-sm">
                💡 <strong>Dica:</strong> Continue importando as planilhas de resultados na ordem. 
                Quando o último jogo da temporada regular for importado, os playoffs de todas as 
                4 conferências serão gerados automaticamente.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <>
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

          {selectedConferencia === 'NACIONAL' ? (
            <FaseNacionalView />
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
                jogos={getJogosConferencia(bracket, selectedConferencia)}
              />
            </div>
          )}
        </>
      )}

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