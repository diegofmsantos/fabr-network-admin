"use client"

import React, { useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Trophy, Crown, Star, Calendar, Play, Edit3, CheckCircle, Clock, Zap, Eye, Award, BarChart3 } from 'lucide-react'
import { Loading } from '@/components/ui/Loading'
import { useFaseNacional, useGerarFaseNacional, useSuperliga } from '@/hooks/useSuperliga'

// Tipagens corretas baseadas no backend
interface JogoNacional {
  id: number
  nome: string
  fase: string
  rodada: number
  timeClassificado1?: { 
    id: number
    nome: string
    sigla: string
    logo: string
  }
  timeClassificado2?: { 
    id: number
    nome: string
    sigla: string
    logo: string
  }
  timeVencedor?: { 
    id: number
    nome: string
    sigla: string
    logo: string
  }
  dataJogo?: string
  status: string
  placarTime1?: number
  placarTime2?: number
  observacoes?: string
}

interface SuperligaData {
  id: number
  nome: string
  temporada: string
  status: string
}

export default function FaseNacionalPage() {
  const params = useParams()
  const superligaId = params.id as string
  const [editingJogo, setEditingJogo] = useState<number | null>(null)

  const { data: superliga, isLoading: loadingSuperliga } = useSuperliga(superligaId)
  const { data: faseNacional, isLoading: loadingFase, refetch } = useFaseNacional(superligaId)
  const { mutate: gerarFaseNacional, isPending: gerandoFase } = useGerarFaseNacional()

  const isLoading = loadingSuperliga || loadingFase

  if (isLoading) {
    return <Loading />
  }

  const superligaData = superliga as SuperligaData
  const jogosNacionais = faseNacional as JogoNacional[]

  const handleGerarFaseNacional = () => {
    gerarFaseNacional(superligaData.temporada, {
      onSuccess: () => {
        refetch()
      }
    })
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'FINALIZADO':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'AO_VIVO':
        return <Play className="w-5 h-5 text-red-500" />
      case 'AGENDADO':
        return <Clock className="w-5 h-5 text-yellow-500" />
      default:
        return <Calendar className="w-5 h-5 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'FINALIZADO': return 'bg-green-500/10 text-green-400 border-green-500/20'
      case 'AO_VIVO': return 'bg-red-500/10 text-red-400 border-red-500/20'
      case 'AGENDADO': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'FINALIZADO': return 'Finalizado'
      case 'AO_VIVO': return 'Ao Vivo'
      case 'AGENDADO': return 'Agendado'
      case 'AGUARDANDO': return 'Aguardando'
      default: return status
    }
  }

  const getFaseLabel = (fase: string) => {
    switch (fase) {
      case 'SEMIFINAL_NACIONAL': return 'Semifinal Nacional'
      case 'FINAL_NACIONAL': return 'Grande Decisão Nacional'
      default: return fase
    }
  }

  const renderJogoCard = (jogo: JogoNacional) => (
    <div key={jogo.id} className="bg-[#272731] rounded-lg border border-gray-700 p-6">
      {/* Header do Jogo */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {jogo.fase === 'FINAL_NACIONAL' ? (
            <Crown className="w-6 h-6 text-yellow-500" />
          ) : (
            <Trophy className="w-6 h-6 text-orange-500" />
          )}
          <div>
            <h3 className="text-white font-semibold">{getFaseLabel(jogo.fase)}</h3>
            <p className="text-gray-400 text-sm">{jogo.nome}</p>
          </div>
        </div>
        
        <div className={`px-3 py-1 rounded-full border text-sm font-medium ${getStatusColor(jogo.status)}`}>
          <div className="flex items-center gap-2">
            {getStatusIcon(jogo.status)}
            {getStatusLabel(jogo.status)}
          </div>
        </div>
      </div>

      {/* Times */}
      <div className="space-y-4">
        {/* Time 1 */}
        <div className="flex items-center justify-between p-4 bg-[#1C1C24] rounded-lg">
          <div className="flex items-center gap-3">
            {jogo.timeClassificado1 ? (
              <>
                <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-white">
                    {jogo.timeClassificado1.sigla}
                  </span>
                </div>
                <span className="text-white font-medium">{jogo.timeClassificado1.nome}</span>
              </>
            ) : (
              <span className="text-gray-400 italic">Aguardando classificação</span>
            )}
          </div>
          
          {jogo.status === 'FINALIZADO' && jogo.placarTime1 !== undefined && (
            <span className={`text-lg font-bold ${
              jogo.timeVencedor?.id === jogo.timeClassificado1?.id ? 'text-[#63E300]' : 'text-gray-400'
            }`}>
              {jogo.placarTime1}
            </span>
          )}
        </div>

        {/* VS */}
        <div className="text-center">
          <span className="text-gray-500 font-bold">VS</span>
        </div>

        {/* Time 2 */}
        <div className="flex items-center justify-between p-4 bg-[#1C1C24] rounded-lg">
          <div className="flex items-center gap-3">
            {jogo.timeClassificado2 ? (
              <>
                <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-white">
                    {jogo.timeClassificado2.sigla}
                  </span>
                </div>
                <span className="text-white font-medium">{jogo.timeClassificado2.nome}</span>
              </>
            ) : (
              <span className="text-gray-400 italic">Aguardando classificação</span>
            )}
          </div>
          
          {jogo.status === 'FINALIZADO' && jogo.placarTime2 !== undefined && (
            <span className={`text-lg font-bold ${
              jogo.timeVencedor?.id === jogo.timeClassificado2?.id ? 'text-[#63E300]' : 'text-gray-400'
            }`}>
              {jogo.placarTime2}
            </span>
          )}
        </div>
      </div>

      {/* Informações do Jogo */}
      {jogo.dataJogo && (
        <div className="mt-4 pt-4 border-t border-gray-700">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">
              Data: {new Date(jogo.dataJogo).toLocaleDateString('pt-BR')}
            </span>
            {jogo.status === 'FINALIZADO' && jogo.timeVencedor && (
              <div className="flex items-center gap-2 text-[#63E300]">
                <Star className="w-4 h-4" />
                <span className="font-medium">Vencedor: {jogo.timeVencedor.nome}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Ações */}
      <div className="mt-4 pt-4 border-t border-gray-700">
        <div className="flex gap-3">
          {jogo.status !== 'FINALIZADO' && jogo.timeClassificado1 && jogo.timeClassificado2 && (
            <button className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors">
              <Edit3 className="w-4 h-4" />
              Editar Resultado
            </button>
          )}
          
          <button className="flex items-center gap-2 text-gray-400 hover:text-gray-300 transition-colors">
            <Eye className="w-4 h-4" />
            Ver Detalhes
          </button>
        </div>
      </div>

      {jogo.observacoes && (
        <div className="mt-3 p-3 bg-[#1C1C24] rounded-lg">
          <p className="text-gray-300 text-sm">{jogo.observacoes}</p>
        </div>
      )}
    </div>
  )

  const semifinais = jogosNacionais?.filter(jogo => jogo.fase === 'SEMIFINAL_NACIONAL') || []
  const finalNacional = jogosNacionais?.find(jogo => jogo.fase === 'FINAL_NACIONAL')
  const campeaoNacional = finalNacional?.timeVencedor

  return (
    <div className="min-h-screen bg-[#1C1C24] p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link 
          href={`/admin/superliga/${superligaId}`}
          className="p-2 rounded-lg bg-[#272731] border border-gray-700 hover:border-gray-600 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </Link>
        
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Crown className="w-8 h-8 text-yellow-500" />
            Fase Nacional
          </h1>
          <p className="text-gray-400">{superligaData?.nome} - Temporada {superligaData?.temporada}</p>
        </div>
      </div>

      {/* Status da Fase Nacional */}
      <div className="bg-[#272731] rounded-lg border border-gray-700 p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-white font-semibold mb-2">Status da Fase Nacional</h2>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-orange-500" />
                <span className="text-gray-300">Semifinais: {semifinais.length}/2</span>
              </div>
              <div className="flex items-center gap-2">
                <Crown className="w-4 h-4 text-yellow-500" />
                <span className="text-gray-300">Final: {finalNacional ? '1/1' : '0/1'}</span>
              </div>
            </div>
          </div>

          {!jogosNacionais || jogosNacionais.length === 0 ? (
            <button
              onClick={handleGerarFaseNacional}
              disabled={gerandoFase}
              className="bg-[#63E300] text-black px-6 py-2 rounded-md font-medium hover:bg-[#50B800] transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {gerandoFase ? (
                <>
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  Gerando...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  Gerar Fase Nacional
                </>
              )}
            </button>
          ) : (
            <div className="text-right">
              <p className="text-[#63E300] font-medium">Fase Nacional Configurada</p>
              <p className="text-gray-400 text-sm">
                {semifinais.filter(j => j.status === 'FINALIZADO').length} semifinais finalizadas
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Campeão Nacional */}
      {campeaoNacional && (
        <div className="bg-gradient-to-r from-yellow-500/10 to-yellow-600/10 border border-yellow-500/20 rounded-lg p-6 mb-6">
          <div className="text-center">
            <Award className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Campeão Nacional</h2>
            <div className="flex items-center justify-center gap-4">
              <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center">
                <span className="text-lg font-bold text-white">{campeaoNacional.sigla}</span>
              </div>
              <span className="text-xl font-bold text-yellow-400">{campeaoNacional.nome}</span>
            </div>
          </div>
        </div>
      )}

      {/* Conteúdo Principal */}
      {!jogosNacionais || jogosNacionais.length === 0 ? (
        <div className="text-center py-12">
          <Crown className="w-16 h-16 text-gray-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Fase Nacional não configurada</h3>
          <p className="text-gray-400 mb-6">
            A fase nacional será gerada automaticamente quando todas as conferências tiverem seus campeões definidos.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Semifinais */}
          {semifinais.length > 0 && (
            <div>
              <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-orange-500" />
                Semifinais Nacionais
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {semifinais.map(renderJogoCard)}
              </div>
            </div>
          )}

          {/* Final Nacional */}
          {finalNacional && (
            <div>
              <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
                <Crown className="w-5 h-5 text-yellow-500" />
                Grande Decisão Nacional
              </h2>
              <div className="max-w-2xl mx-auto">
                {renderJogoCard(finalNacional)}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Ações Rápidas */}
      <div className="mt-8 bg-[#272731] rounded-lg border border-gray-700 p-6">
        <h3 className="text-white font-semibold mb-4">Ações Rápidas</h3>
        <div className="flex flex-wrap gap-3">
          <Link
            href={`/admin/superliga/${superligaId}/playoffs`}
            className="flex items-center gap-2 bg-[#1C1C24] text-white px-4 py-2 rounded-md border border-gray-700 hover:border-gray-600 transition-colors"
          >
            <Trophy className="w-4 h-4" />
            Ver Playoffs das Conferências
          </Link>

          <Link
            href={`/admin/superliga/${superligaId}/status`}
            className="flex items-center gap-2 bg-[#1C1C24] text-white px-4 py-2 rounded-md border border-gray-700 hover:border-gray-600 transition-colors"
          >
            <BarChart3 className="w-4 h-4" />
            Status da Superliga
          </Link>

          <Link
            href={`/superliga/${superligaData?.temporada}`}
            className="flex items-center gap-2 bg-[#1C1C24] text-white px-4 py-2 rounded-md border border-gray-700 hover:border-gray-600 transition-colors"
          >
            <Eye className="w-4 h-4" />
            Visualização Pública
          </Link>
        </div>
      </div>
    </div>
  )
}