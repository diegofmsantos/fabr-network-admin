"use client"

import { Calendar, Eye, Play, RefreshCw } from "lucide-react"
import { useRouter } from "next/navigation"

interface TemporadaRegularContentProps {
  jogosPorRodada: Record<number, any[]>
  jogosFiltrados: any[]
  onRefresh: () => void
}

export function TemporadaRegularContent({ jogosPorRodada, jogosFiltrados, onRefresh }: TemporadaRegularContentProps) {

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

  return (
    <div className="space-y-6">
      {Object.entries(jogosPorRodada)
        .sort(([a], [b]) => parseInt(a) - parseInt(b))
        .map(([rodada, jogosRodada]) => (
          <div key={rodada} className="bg-[#272731] rounded-lg border border-gray-700">
            <div className="p-4 border-b border-gray-700">
              <h3 className="text-white font-semibold flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#63E300]" />
                Rodada {rodada}
                <span className="text-gray-400 text-sm ml-2">
                  ({jogosRodada.length} jogo{jogosRodada.length !== 1 ? 's' : ''})
                </span>
              </h3>
            </div>

            <div className="p-4 space-y-3">
              {jogosRodada.map((jogo: any) => (
                <div key={jogo.id} className="bg-[#1C1C24] rounded-lg p-4 border border-gray-700">
                  <div className="flex items-center">
                    <div className="flex-1 justify-between flex items-center gap-5">
                      <div className="text-center">
                        <p className="text-white font-medium">{jogo.timeCasa?.sigla || 'TBD'}</p>
                        <p className="text-gray-400 text-xs">{jogo.timeCasa?.nome || 'A definir'}</p>
                      </div>

                      <div className="text-center px-4">
                        <p className="text-gray-400 text-sm">vs</p>
                        {jogo.status === 'FINALIZADO' && (
                          <p className="text-white font-bold">
                            {jogo.placarCasa} - {jogo.placarVisitante}
                          </p>
                        )}
                      </div>

                      <div className="text-center">
                        <p className="text-white font-medium">{jogo.timeVisitante?.sigla || 'TBD'}</p>
                        <p className="text-gray-400 text-xs">{jogo.timeVisitante?.nome || 'A definir'}</p>
                      </div>
                    </div>

                    <div className="text-center flex-1">
                      <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${jogo.status === 'FINALIZADO' ? 'bg-green-500/20 text-green-400' :
                        jogo.status === 'AO VIVO' ? 'bg-red-500/20 text-red-400' :
                          jogo.status === 'ADIADO' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-gray-500/20 text-gray-400'
                        }`}>
                        {jogo.status === 'FINALIZADO' ? 'Finalizado' :
                          jogo.status === 'AO VIVO' ? 'Ao Vivo' :
                            jogo.status === 'ADIADO' ? 'Adiado' : 'Agendado'}
                      </div>

                      {jogo.dataJogo && (
                        <p className="text-gray-400 text-sm mt-1">
                          {new Date(jogo.dataJogo).toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric'
                          })}
                        </p>
                      )}

                      {jogo.local && (
                        <p className="text-gray-500 text-xs mt-1">
                          {jogo.local}
                        </p>
                      )}
                    </div>

                    <div className="flex-1 flex justify-end gap-2 ml-4">
                      {jogo.status !== 'FINALIZADO' && (
                        <button className="p-2 bg-[#63E300] text-black rounded-lg hover:bg-[#50B800] transition-colors"
                          onClick={() => router.push(`/admin/jogos/${jogo.id}/gerenciar-jogo`)}
                        >
                          <Play className="w-4 h-4" />
                        </button>
                      )}
                      <button className="p-2 bg-[#272731] text-gray-400 rounded-lg border border-gray-700 hover:border-gray-600 hover:text-white transition-colors"
                        onClick={() => router.push(`/admin/jogos/${jogo.id}`)}
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
    </div>
  )
}