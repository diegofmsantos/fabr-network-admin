// Criar este arquivo: src/hooks/useEstatisticasJogo.ts

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { JogadoresService } from '@/services/jogadores.service'
import { EstatisticaJogo, Estatisticas } from '@/types'

// ✅ Hook para buscar estatísticas de jogos de um jogador
export function useEstatisticasJogo(jogadorId: number, temporada: string = '2025') {
  return useQuery({
    queryKey: ['estatisticas-jogo', jogadorId, temporada],
    queryFn: () => JogadoresService.getEstatisticasJogo(jogadorId, temporada),
    enabled: !!jogadorId,
    staleTime: 1000 * 60 * 5, // 5 minutos
  })
}

// ✅ Hook para buscar uma estatística específica por ID
export function useEstatisticaJogoPorId(estatisticaId: number) {
  return useQuery({
    queryKey: ['estatistica-jogo', estatisticaId],
    queryFn: () => JogadoresService.getEstatisticaJogoPorId(estatisticaId),
    enabled: !!estatisticaId,
  })
}

// ✅ Hook para atualizar estatística de jogo específico
export function useUpdateEstatisticaJogo() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, estatisticas }: { id: number; estatisticas: Estatisticas }) =>
      JogadoresService.updateEstatisticaJogo(id, estatisticas),
    
    onSuccess: (data, variables) => {
      console.log('✅ Estatística de jogo atualizada com sucesso:', data)

      // Invalidar cache das estatísticas do jogador
      queryClient.invalidateQueries({
        queryKey: ['estatisticas-jogo', data.jogadorId]
      })

      // Invalidar cache específico da estatística
      queryClient.invalidateQueries({
        queryKey: ['estatistica-jogo', variables.id]
      })

      // Invalidar cache dos jogadores para atualizar as estatísticas consolidadas
      queryClient.invalidateQueries({
        queryKey: ['jogadores']
      })

      // Invalidar cache do jogador específico
      queryClient.invalidateQueries({
        queryKey: ['jogador', data.jogadorId]
      })
    },

    onError: (error) => {
      console.error('❌ Erro ao atualizar estatística de jogo:', error)
    }
  })
}