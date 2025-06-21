import React from 'react'
import { ClipboardList, RefreshCw, AlertTriangle, Loader2 } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { BaseService } from '@/services/base.service'

interface ProcessedGame {
  id_jogo: string
  data_jogo: string
  processado_em: string
}

class JogosProcessadosService extends BaseService {
  static async getJogosProcessados(): Promise<{ jogos: ProcessedGame[] }> {
    const service = new JogosProcessadosService()
    return service.get<{ jogos: ProcessedGame[] }>('/admin/jogos-processados')
  }
}

const ProcessedGamesList = () => {
  const { 
    data, 
    isLoading, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ['jogosProcessados'],
    queryFn: JogosProcessadosService.getJogosProcessados,
    staleTime: 1000 * 60 * 5, 
    retry: 2,
  })

  const games = data?.jogos || []

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('pt-BR')
    } catch (e) {
      return dateString
    }
  }

  const formatDateTime = (dateTimeString: string) => {
    try {
      const date = new Date(dateTimeString)
      return `${date.toLocaleDateString('pt-BR')} ${date.toLocaleTimeString('pt-BR')}`
    } catch (e) {
      return dateTimeString
    }
  }

  return (
    <div className="max-w-2xl mx-auto bg-[#1C1C24] p-6 rounded-lg shadow-md">
      
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-[#63E300]">Jogos Processados</h2>
        <button
          onClick={() => refetch()}
          disabled={isLoading}
          className="text-[#63E300] hover:text-[#50B800] flex items-center transition-colors disabled:opacity-50"
        >
          <RefreshCw size={16} className={`mr-1 ${isLoading ? 'animate-spin' : ''}`} />
          Atualizar
        </button>
      </div>

      {error && (
        <div className="bg-red-500/20 border border-red-500 text-red-100 px-4 py-3 rounded mb-4 flex items-center">
          <AlertTriangle size={20} className="mr-2" />
          {error.message || 'Erro ao carregar jogos processados'}
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-8 text-gray-400">
          <Loader2 className="w-6 h-6 animate-spin mr-2" />
          Carregando jogos processados...
        </div>
      ) : games.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          <ClipboardList size={48} className="mx-auto mb-4 opacity-50" />
          <p>Nenhum jogo processado encontrado</p>
          <button
            onClick={() => refetch()}
            className="mt-2 text-[#63E300] hover:text-[#50B800] text-sm"
          >
            Tentar novamente
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {games.map((game, index) => (
            <div
              key={`${game.id_jogo}-${index}`}
              className="bg-[#272731] border border-gray-700 rounded-lg p-4 hover:border-[#63E300] transition-colors"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-white">
                    Jogo: {game.id_jogo}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    Data do Jogo: {formatDate(game.data_jogo)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[#63E300] text-sm font-medium">
                    Processado
                  </p>
                  <p className="text-gray-400 text-xs">
                    {formatDateTime(game.processado_em)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ProcessedGamesList