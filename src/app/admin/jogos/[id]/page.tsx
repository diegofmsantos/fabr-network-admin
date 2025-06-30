"use client"

import React from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Calendar, MapPin, Users, Edit, Upload, Clock, CheckCircle, PlayCircle, AlertTriangle } from 'lucide-react'
import { Loading } from '@/components/ui/Loading'
import { useJogo, type Jogo } from '@/hooks/useJogos'

export default function DetalheJogoPage() {
  const params = useParams()
  const jogoId = parseInt(params.id as string)

  const { data: jogo, isLoading, error } = useJogo(jogoId)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'AGENDADO': return <Clock className="w-5 h-5 text-yellow-400" />
      case 'AO_VIVO': return <PlayCircle className="w-5 h-5 text-red-400" />
      case 'FINALIZADO': return <CheckCircle className="w-5 h-5 text-green-400" />
      case 'ADIADO': return <AlertTriangle className="w-5 h-5 text-orange-400" />
      default: return <Clock className="w-5 h-5 text-gray-400" />
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'AGENDADO': return 'Agendado'
      case 'AO_VIVO': return 'Ao Vivo'
      case 'FINALIZADO': return 'Finalizado'
      case 'ADIADO': return 'Adiado'
      default: return status
    }
  }

  const getFaseLabel = (fase: string) => {
    switch (fase) {
      case 'TEMPORADA_REGULAR': return 'Temporada Regular'
      case 'WILD_CARD': return 'Wild Card'
      case 'SEMIFINAL_CONFERENCIA': return 'Semifinal de Conferência'
      case 'FINAL_CONFERENCIA': return 'Final de Conferência'
      case 'SEMIFINAL_NACIONAL': return 'Semifinal Nacional'
      case 'FINAL_NACIONAL': return 'Final Nacional'
      default: return fase
    }
  }

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString)
    return {
      date: date.toLocaleDateString('pt-BR', { 
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      time: date.toLocaleTimeString('pt-BR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    }
  }

  if (isLoading) return <Loading />

  if (error || !jogo) {
    return (
      <div className="min-h-screen bg-[#1C1C24] p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-900/20 border border-red-500 rounded-lg p-6 text-center">
            <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-red-400 mb-2">Jogo não encontrado</h2>
            <p className="text-red-300 mb-4">
              {error?.message || 'O jogo solicitado não foi encontrado.'}
            </p>
            <Link
              href="/admin/jogos"
              className="inline-flex items-center bg-[#63E300] text-black px-4 py-2 rounded-md font-semibold hover:bg-[#50B800] transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar para Agenda
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const dateTime = formatDateTime(jogo.dataJogo)
  const jogoTyped = jogo as Jogo

  return (
    <div className="min-h-screen bg-[#1C1C24] p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link 
            href="/admin/jogos"
            className="p-2 rounded-lg bg-[#272731] border border-gray-700 hover:border-gray-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </Link>
          
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-white">Detalhes do Jogo</h1>
            <p className="text-gray-400">
              {jogoTyped.campeonato.nome} - Temporada {jogoTyped.campeonato.temporada}
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            {(jogoTyped.status === 'AGENDADO' || jogoTyped.status === 'AO_VIVO') && (
              <Link
                href={`/admin/jogos/${jogoTyped.id}/resultado`}
                className="inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-blue-700 transition-colors"
              >
                <Edit className="w-4 h-4 mr-2" />
                Inserir Resultado
              </Link>
            )}

            <Link
              href="/importar"
              className="inline-flex items-center bg-[#63E300] text-black px-4 py-2 rounded-md font-semibold hover:bg-[#50B800] transition-colors"
            >
              <Upload className="w-4 h-4 mr-2" />
              Importar Estatísticas
            </Link>
          </div>
        </div>

        {/* Status e Info Principal */}
        <div className="bg-[#272731] rounded-lg border border-gray-700 p-6 mb-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Confronto */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  {getStatusIcon(jogoTyped.status)}
                  <span className="text-lg font-semibold text-white">
                    {getStatusLabel(jogoTyped.status)}
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-400">{getFaseLabel(jogoTyped.fase)}</div>
                  <div className="text-sm text-gray-400">{jogoTyped.rodada}ª Rodada</div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                {/* Time Casa */}
                <div className="text-center flex-1">
                  <div className="text-2xl font-bold text-white mb-2">
                    {jogoTyped.timeCasa.nome}
                  </div>
                  <div className="text-gray-400 text-sm mb-2">
                    {jogoTyped.timeCasa.sigla}
                  </div>
                  {jogoTyped.status === 'FINALIZADO' && (
                    <div className="text-4xl font-bold text-[#63E300]">
                      {jogoTyped.placarCasa || 0}
                    </div>
                  )}
                </div>

                {/* VS */}
                <div className="text-center px-6">
                  <div className="text-2xl font-bold text-gray-400">VS</div>
                  {jogoTyped.status === 'FINALIZADO' && (
                    <div className="text-sm text-gray-400 mt-2">Final</div>
                  )}
                </div>

                {/* Time Visitante */}
                <div className="text-center flex-1">
                  <div className="text-2xl font-bold text-white mb-2">
                    {jogoTyped.timeVisitante.nome}
                  </div>
                  <div className="text-gray-400 text-sm mb-2">
                    {jogoTyped.timeVisitante.sigla}
                  </div>
                  {jogoTyped.status === 'FINALIZADO' && (
                    <div className="text-4xl font-bold text-[#63E300]">
                      {jogoTyped.placarVisitante || 0}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Informações do Jogo */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-[#63E300]" />
                <div>
                  <div className="text-white font-medium">{dateTime.date}</div>
                  <div className="text-gray-400 text-sm">{dateTime.time}</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-[#63E300]" />
                <div>
                  <div className="text-white font-medium">
                    {jogoTyped.local || 'Local a definir'}
                  </div>
                  <div className="text-gray-400 text-sm">Local do jogo</div>
                </div>
              </div>

              {jogoTyped.observacoes && (
                <div className="bg-[#1C1C24] rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-400 mb-2">Observações</h4>
                  <p className="text-white text-sm">{jogoTyped.observacoes}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Informações dos Times */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Time Casa */}
          <div className="bg-[#272731] rounded-lg border border-gray-700 p-6">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <div 
                className="w-4 h-4 rounded" 
                style={{ backgroundColor: jogo.timeCasa.cor || '#63E300' }}
              />
              {jogo.timeCasa.nome} (Casa)
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Sigla:</span>
                <span className="text-white">{jogo.timeCasa.sigla}</span>
              </div>
              {jogo.timeCasa.presidente && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Presidente:</span>
                  <span className="text-white">{jogo.timeCasa.presidente}</span>
                </div>
              )}
              {jogo.timeCasa.head_coach && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Head Coach:</span>
                  <span className="text-white">{jogo.timeCasa.head_coach}</span>
                </div>
              )}
              {jogo.timeCasa.estadio && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Estádio:</span>
                  <span className="text-white">{jogo.timeCasa.estadio}</span>
                </div>
              )}
            </div>
          </div>

          {/* Time Visitante */}
          <div className="bg-[#272731] rounded-lg border border-gray-700 p-6">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <div 
                className="w-4 h-4 rounded" 
                style={{ backgroundColor: jogo.timeVisitante.cor || '#63E300' }}
              />
              {jogo.timeVisitante.nome} (Visitante)
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Sigla:</span>
                <span className="text-white">{jogo.timeVisitante.sigla}</span>
              </div>
              {jogo.timeVisitante.presidente && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Presidente:</span>
                  <span className="text-white">{jogo.timeVisitante.presidente}</span>
                </div>
              )}
              {jogo.timeVisitante.head_coach && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Head Coach:</span>
                  <span className="text-white">{jogo.timeVisitante.head_coach}</span>
                </div>
              )}
              {jogo.timeVisitante.estadio && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Estádio:</span>
                  <span className="text-white">{jogo.timeVisitante.estadio}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Estatísticas do Jogo */}
        {jogo.status === 'FINALIZADO' && jogo.estatisticas && jogo.estatisticas.length > 0 && (
          <div className="bg-[#272731] rounded-lg border border-gray-700 p-6">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Users className="w-5 h-5" />
              Estatísticas do Jogo
            </h3>
            <div className="text-center text-gray-400">
              <p>Estatísticas detalhadas serão exibidas aqui quando implementadas</p>
              <p className="text-sm mt-2">
                {jogo.estatisticas.length} registros de estatísticas encontrados
              </p>
            </div>
          </div>
        )}

        {/* Actions */}
        {jogo.status !== 'FINALIZADO' && (
          <div className="bg-[#272731] rounded-lg border border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Próximos Passos</h3>
            <div className="flex flex-wrap gap-3">
              <Link
                href={`/admin/jogos/${jogo.id}/resultado`}
                className="inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-blue-700 transition-colors"
              >
                <Edit className="w-4 h-4 mr-2" />
                Inserir Resultado
              </Link>
              <Link
                href="/importar"
                className="inline-flex items-center bg-[#63E300] text-black px-4 py-2 rounded-md font-semibold hover:bg-[#50B800] transition-colors"
              >
                <Upload className="w-4 h-4 mr-2" />
                Importar Estatísticas
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
