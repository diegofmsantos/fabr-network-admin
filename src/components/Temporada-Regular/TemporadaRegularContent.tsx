"use client"

import { ImageService } from "@/utils/services/ImageService"
import { Calendar, RefreshCw } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface TemporadaRegularContentProps {
  jogosPorRodada: Record<number, any[]>
  jogosFiltrados: any[]
  onRefresh: () => void
}

export function TemporadaRegularContent({ jogosPorRodada, onRefresh }: TemporadaRegularContentProps) {
  const router = useRouter()

  if (Object.keys(jogosPorRodada).length === 0) {
    return (
      <div className="text-center py-12">
        <Calendar className="w-16 h-16 text-gray-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">Nenhum jogo encontrado</h3>
        <p className="text-gray-400 mb-6">
          Não há jogos que correspondam aos filtros selecionados.
        </p>
        <button
          onClick={onRefresh}
          className="flex items-center gap-2 bg-[#63E300] text-black px-4 py-2 rounded-lg font-semibold hover:bg-[#50B800] transition-colors mx-auto"
        >
          <RefreshCw className="w-4 h-4" />
          Atualizar Lista
        </button>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'FINALIZADO': return 'bg-green-500/20 text-green-500'
      case 'AO VIVO': return 'bg-red-500/20 text-red-500'
      case 'AGENDADO': return 'bg-blue-500/20 text-blue-500'
      case 'ADIADO': return 'bg-yellow-500/20 text-yellow-500'
      default: return 'bg-gray-500/20 text-gray-500'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'FINALIZADO': return 'Finalizado'
      case 'AO VIVO': return 'Ao Vivo'
      case 'AGENDADO': return 'Agendado'
      case 'ADIADO': return 'Adiado'
      default: return status
    }
  }

  return (
    <div className="space-y-8">
      {Object.entries(jogosPorRodada)
        .sort(([a], [b]) => parseInt(a) - parseInt(b))
        .map(([rodada, jogosRodada]) => (
          <div key={rodada}>
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-[#63E300]" />
              <h3 className="text-white font-semibold">
                Rodada {rodada}{' '}
                <span className="text-gray-400 text-sm ml-2">
                  ({jogosRodada.length} jogo{jogosRodada.length !== 1 ? 's' : ''})
                </span>
              </h3>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {jogosRodada.map((jogo: any) => {
                const dataFormatada = jogo.dataJogo ? (() => {
                  const [datePart, timePart] = jogo.dataJogo.split('T');
                  const [ano, mes, dia] = datePart.split('-');
                  const [hora, minuto] = timePart.split(':');
                  return `${dia}/${mes}/${ano} às ${hora}:${minuto}`;
                })() : null

                return (
                  <div key={jogo.id} className="bg-[#1C1C24] rounded-lg p-4 border border-gray-700 hover:border-gray-600 transition-colors">
                    <div className="flex items-center justify-between mb-4">
                      <span className={`text-xs font-semibold px-2 py-1 rounded ${getStatusColor(jogo.status)}`}>
                        {getStatusLabel(jogo.status)}
                      </span>
                      {dataFormatada && <span className="text-xs text-gray-400">{dataFormatada}</span>}
                    </div>

                    <div className="space-y-3">
                      {/* Time Casa */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1">
                          {jogo.timeCasa ? (
                            <>
                              <Image
                                src={ImageService.getTeamLogo(jogo.timeCasa.nome)}
                                alt={jogo.timeCasa.nome}
                                width={40}
                                height={40}
                                className="rounded-full object-contain"
                              />
                              <div className="flex-1">
                                <p className="font-bold text-white">{jogo.timeCasa.sigla}</p>
                                <p className="text-xs text-gray-400">{jogo.timeCasa.nome}</p>
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
                                <span className="text-gray-400 text-xs">?</span>
                              </div>
                              <div className="flex-1">
                                <p className="font-bold text-gray-400">A Definir</p>
                                <p className="text-xs text-gray-500">Aguardando</p>
                              </div>
                            </>
                          )}
                        </div>
                        <div className="text-2xl font-bold text-white w-12 text-center">
                          {jogo.placarCasa ?? '-'}
                        </div>
                      </div>

                      <div className="border-t border-gray-700"></div>

                      {/* Time Visitante */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1">
                          {jogo.timeVisitante ? (
                            <>
                              <Image
                                src={ImageService.getTeamLogo(jogo.timeVisitante.nome)}
                                alt={jogo.timeVisitante.nome}
                                width={40}
                                height={40}
                                className="rounded-full object-contain"
                              />
                              <div className="flex-1">
                                <p className="font-bold text-white">{jogo.timeVisitante.sigla}</p>
                                <p className="text-xs text-gray-400">{jogo.timeVisitante.nome}</p>
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
                                <span className="text-gray-400 text-xs">?</span>
                              </div>
                              <div className="flex-1">
                                <p className="font-bold text-gray-400">A Definir</p>
                                <p className="text-xs text-gray-500">Aguardando</p>
                              </div>
                            </>
                          )}
                        </div>
                        <div className="text-2xl font-bold text-white w-12 text-center">
                          {jogo.placarVisitante ?? '-'}
                        </div>
                      </div>
                    </div>

                    {(jogo.local || (jogo as any).conferencia) && (
                      <div className="mt-4 pt-4 border-t border-gray-700 flex items-center justify-between text-xs text-gray-400">
                        {jogo.local && <span>📍 {jogo.local}</span>}
                        {(jogo as any).conferencia && (
                          <span className="bg-gray-700 px-2 py-1 rounded">{(jogo as any).conferencia}</span>
                        )}
                      </div>
                    )}

                    <div className="mt-4 flex gap-2">
                      {jogo.status !== 'FINALIZADO' && (
                        <button
                          className="flex-1 bg-[#63E300] text-black py-2 rounded-md font-semibold hover:bg-[#50B800] transition-colors text-sm"
                          onClick={() => router.push(`/admin/jogos/${jogo.id}/gerenciar-jogo`)}
                        >
                          Gerenciar
                        </button>
                      )}
                      <Link
                        href={`/admin/jogos/${jogo.id}`}
                        className="flex-1 text-center bg-[#272731] text-white py-2 rounded-md border border-gray-700 hover:border-[#63E300] hover:text-[#63E300] transition-colors text-sm font-semibold"
                      >
                        Ver Detalhes
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
    </div>
  )
}