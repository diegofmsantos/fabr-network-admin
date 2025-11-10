import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { JogadoresService } from '@/services/jogadores.service'
import { Estatisticas } from '@/types'

export function useEstatisticasJogo(jogadorId: number, temporada: string = '2025') {
  return useQuery({
    queryKey: ['estatisticas-jogo', jogadorId, temporada],
    queryFn: () => JogadoresService.getEstatisticasJogo(jogadorId, temporada),
    enabled: !!jogadorId,
    staleTime: 1000 * 60 * 5, 
  })
}

export function useEstatisticaJogoPorId(estatisticaId: number) {
  return useQuery({
    queryKey: ['estatistica-jogo', estatisticaId],
    queryFn: () => JogadoresService.getEstatisticaJogoPorId(estatisticaId),
    enabled: !!estatisticaId,
  })
}

export function useUpdateEstatisticaJogo() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, estatisticas }: { id: number; estatisticas: Estatisticas }) =>
      JogadoresService.updateEstatisticaJogo(id, estatisticas),
    
    onSuccess: (data, variables) => {
      console.log('✅ Estatística de jogo atualizada com sucesso:', data)

      queryClient.invalidateQueries({
        queryKey: ['estatisticas-jogo', data.jogadorId]
      })

      queryClient.invalidateQueries({
        queryKey: ['estatistica-jogo', variables.id]
      })

      queryClient.invalidateQueries({
        queryKey: ['jogadores']
      })

      queryClient.invalidateQueries({
        queryKey: ['jogador', data.jogadorId]
      })
    },

    onError: (error) => {
      console.error('❌ Erro ao atualizar estatística de jogo:', error)
    }
  })
}