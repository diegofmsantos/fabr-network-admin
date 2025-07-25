
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from './queryKeys'
import { useNotifications } from './useNotifications'
import { JogosService, Jogo } from '@/services/jogos.service'

interface JogosFilters {
  temporada?: string
  campeonatoId?: number
  status?: string
  fase?: string
  rodada?: number
  conferencia?: string
  regional?: string
  timeId?: number
  limite?: number
}

interface GerenciarJogoData {
  placarCasa?: number
  placarVisitante?: number
  dataJogo?: string
  local?: string
  observacoes?: string
  status?: 'AGENDADO' | 'AO VIVO' | 'FINALIZADO' | 'ADIADO'
}

export function useJogos(filters?: JogosFilters) {
  return useQuery({
    queryKey: queryKeys.jogos.list(filters || {}),
    queryFn: () => JogosService.getJogos(filters),
    enabled: true,
    staleTime: 1000 * 60 * 5, // 5 minutos
    retry: 2,
    refetchOnWindowFocus: false,
    throwOnError: false
  })
}

export function useJogo(id: number) {
  return useQuery({
    queryKey: queryKeys.jogos.detail(id),
    queryFn: () => JogosService.getJogo(id),
    enabled: !!id && id > 0,
    staleTime: 1000 * 60 * 5,
    retry: 2,
    refetchOnWindowFocus: false,
    throwOnError: false
  })
}

export function useJogosTime(timeId: number, filters?: Omit<JogosFilters, 'timeId'>) {
  return useQuery({
    queryKey: [...queryKeys.jogos.all, 'jogos-time', timeId, filters],
    queryFn: () => JogosService.getJogos({ ...filters, timeId }),
    enabled: !!timeId && timeId > 0,
    staleTime: 1000 * 60 * 3,
    retry: 2,
    refetchOnWindowFocus: false
  })
}

export function useJogosSuperliga(temporada: string, filters?: Omit<JogosFilters, 'temporada'>) {
  return useQuery({
    queryKey: [...queryKeys.jogos.all, 'superliga', temporada, filters],
    queryFn: () => JogosService.getJogos({ ...filters, temporada }),
    enabled: !!temporada,
    staleTime: 1000 * 60 * 3,
    retry: 2,
    refetchOnWindowFocus: false
  })
}

export function useAtualizarResultadoJogo() {
  const queryClient = useQueryClient()
  const notifications = useNotifications()

  return useMutation({
    mutationFn: ({ id, dados }: {
      id: number,
      dados: {
        placarCasa: number
        placarVisitante: number
        status?: string
        observacoes?: string
      }
    }) => JogosService.atualizarResultado(id, dados),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.jogos.detail(id)
      })
      queryClient.invalidateQueries({
        queryKey: queryKeys.jogos.lists()
      })
      notifications.success('Resultado atualizado!', 'Placar do jogo foi salvo com sucesso')
    },
    onError: (error: any) => {
      notifications.error('Erro ao atualizar resultado', error.message)
    }
  })
}

export function useFinalizarJogo() {
  const queryClient = useQueryClient()
  const notifications = useNotifications()

  return useMutation({
    mutationFn: (jogoId: number) => JogosService.finalizarJogo(jogoId),
    onSuccess: (updatedJogo) => {
      queryClient.setQueryData(queryKeys.jogos.detail(updatedJogo.id), updatedJogo)
      queryClient.invalidateQueries({
        queryKey: queryKeys.jogos.lists()
      })
      notifications.success('Jogo finalizado!', 'Jogo foi marcado como finalizado')
    },
    onError: (error: any) => {
      notifications.error('Erro ao finalizar jogo', error.message)
    },
  })
}

export function useAdiarJogo() {
  const queryClient = useQueryClient()
  const notifications = useNotifications()

  return useMutation({
    mutationFn: ({ jogoId, novaData }: { jogoId: number; novaData?: string }) =>
      JogosService.adiarJogo(jogoId, novaData),
    onSuccess: (updatedJogo) => {
      queryClient.setQueryData(queryKeys.jogos.detail(updatedJogo.id), updatedJogo)
      queryClient.invalidateQueries({
        queryKey: queryKeys.jogos.lists()
      })
      notifications.success('Jogo adiado!', 'Jogo foi marcado como adiado')
    },
    onError: (error: any) => {
      notifications.error('Erro ao adiar jogo', error.message)
    },
  })
}

export function useGerenciarJogo() {
  const queryClient = useQueryClient()
  const notifications = useNotifications()

  return useMutation({
    mutationFn: async ({ 
      id, 
      dados 
    }: { 
      id: number; 
      dados: GerenciarJogoData
    }): Promise<Jogo> => {
      if (dados.placarCasa !== undefined && dados.placarVisitante !== undefined) {
        const resultado = await JogosService.atualizarResultado(id, {
          placarCasa: dados.placarCasa,
          placarVisitante: dados.placarVisitante,
          status: dados.status,
          observacoes: dados.observacoes
        })
        return resultado.jogo
      }
      
      const dadosAtualizacao: Partial<Jogo> = {}
      
      if (dados.dataJogo) {
        dadosAtualizacao.dataJogo = new Date(dados.dataJogo).toISOString()
      }
      if (dados.local !== undefined) {
        dadosAtualizacao.local = dados.local
      }
      if (dados.observacoes !== undefined) {
        dadosAtualizacao.observacoes = dados.observacoes
      }
      if (dados.status) {
        dadosAtualizacao.status = dados.status
      }
      
      return JogosService.atualizarJogo(id, dadosAtualizacao)
    },
    onSuccess: (jogoAtualizado, { id }) => {
      queryClient.setQueryData(queryKeys.jogos.detail(id), jogoAtualizado)

      queryClient.invalidateQueries({
        queryKey: queryKeys.jogos.lists()
      })

      queryClient.invalidateQueries({
        queryKey: ['superliga']
      })

      queryClient.invalidateQueries({
        queryKey: ['superliga', '2025']
      })

      notifications.success('Jogo atualizado!', 'As alterações foram salvas com sucesso')
    },
    onError: (error: any) => {
      notifications.error('Erro ao atualizar jogo', error.message || 'Tente novamente')
    },
  })
}

export type { Jogo, JogosFilters }