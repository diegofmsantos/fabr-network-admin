"use client"

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNotifications } from '@/hooks/useNotifications'
import { queryKeys } from './queryKeys'
import { FiltroJogos, Jogo } from '@/types'
import { CampeonatosService } from '@/services/campeonatos.service'

// ==================== HOOKS DE QUERY ====================

// Hook para buscar jogos com filtros
export function useJogos(filters: FiltroJogos) {
  return useQuery({
    queryKey: queryKeys.jogos.list(filters),
    queryFn: () => CampeonatosService.getJogos(filters),
    staleTime: 1000 * 60 * 2, // Jogos mudam mais frequentemente
    gcTime: 1000 * 60 * 5,
    retry: 2,
  })
}

// Hook para buscar um jogo específico
export function useJogo(jogoId: number) {
  return useQuery({
    queryKey: queryKeys.jogos.detail(jogoId),
    queryFn: () => CampeonatosService.getJogo(jogoId),
    enabled: !!jogoId,
    staleTime: 1000 * 60 * 2,
  })
}

// Hook para buscar jogos de um time específico
export function useJogosTime(timeId: number, campeonatoId?: number, limit: number = 20) {
  return useQuery({
    queryKey: [...queryKeys.jogos.all, 'jogos-time', timeId, campeonatoId, limit] as const,
    queryFn: () => CampeonatosService.getJogos({
      timeId,
      campeonatoId,
      limit
    }),
    enabled: !!timeId,
    staleTime: 1000 * 60 * 3,
  })
}

// ==================== HOOKS DE MUTATION ====================

// Hook para criar jogo
export function useCreateJogo() {
  const queryClient = useQueryClient()
  const notifications = useNotifications()

  return useMutation({
    mutationFn: (data: any) => CampeonatosService.createJogo(data),
    onSuccess: (newJogo) => {
      // Invalidar lista de jogos
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.jogos.lists() 
      })
      
      // Invalidar dados do campeonato
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.campeonatos.detail(newJogo.campeonatoId) 
      })
      
      // Adicionar ao cache
      queryClient.setQueryData(queryKeys.jogos.detail(newJogo.id), newJogo)
      
      notifications.success('Jogo criado!', 'Jogo foi criado com sucesso')
    },
    onError: (error: any) => {
      notifications.error('Erro ao criar jogo', error.message || 'Tente novamente')
    },
  })
}

// Hook para atualizar jogo
export function useUpdateJogo() {
  const queryClient = useQueryClient()
  const notifications = useNotifications()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      CampeonatosService.updateJogo(id, data),
    onSuccess: (updatedJogo, { id }) => {
      // Atualizar cache específico
      queryClient.setQueryData(queryKeys.jogos.detail(id), updatedJogo)
      
      // Invalidar lista de jogos
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.jogos.lists() 
      })
      
      // Invalidar dados do campeonato se necessário
      if (updatedJogo.campeonatoId) {
        queryClient.invalidateQueries({ 
          queryKey: queryKeys.campeonatos.detail(updatedJogo.campeonatoId) 
        })
      }
      
      notifications.success('Jogo atualizado!', 'Jogo foi atualizado com sucesso')
    },
    onError: (error: any) => {
      notifications.error('Erro ao atualizar jogo', error.message || 'Tente novamente')
    },
  })
}

// Hook para deletar jogo
export function useDeleteJogo() {
  const queryClient = useQueryClient()
  const notifications = useNotifications()

  return useMutation({
    mutationFn: (id: number) => CampeonatosService.deleteJogo(id),
    onSuccess: (_, id) => {
      // Remover do cache
      queryClient.removeQueries({ 
        queryKey: queryKeys.jogos.detail(id) 
      })
      
      // Invalidar lista de jogos
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.jogos.lists() 
      })
      
      // Invalidar dados dos campeonatos
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.campeonatos.lists() 
      })
      
      notifications.success('Jogo removido!', 'Jogo foi excluído com sucesso')
    },
    onError: (error: any) => {
      notifications.error('Erro ao remover jogo', error.message || 'Tente novamente')
    },
  })
}

// Hook para gerar jogos automaticamente
export function useGerarJogos() {
  const queryClient = useQueryClient()
  const notifications = useNotifications()

  return useMutation({
    mutationFn: (campeonatoId: number) => CampeonatosService.gerarJogos(campeonatoId),
    onSuccess: (result, campeonatoId) => {
      // Invalidar dados do campeonato
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.campeonatos.detail(campeonatoId) 
      })
      
      // Invalidar lista de jogos
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.jogos.lists() 
      })
      
      notifications.success(
        'Jogos gerados!', 
        `${result.jogosGerados || 0} jogos foram criados automaticamente`
      )
    },
    onError: (error: any) => {
      notifications.error('Erro ao gerar jogos', error.message || 'Tente novamente')
    },
  })
}

// Hook para atualizar resultado do jogo
export function useAtualizarResultado() {
  const queryClient = useQueryClient()
  const notifications = useNotifications()

  return useMutation({
    mutationFn: ({ 
      jogoId, 
      placarCasa, 
      placarVisitante 
    }: { 
      jogoId: number
      placarCasa: number
      placarVisitante: number 
    }) => CampeonatosService.atualizarResultadoJogo(jogoId, placarCasa, placarVisitante),
    onSuccess: (updatedJogo) => {
      // Atualizar cache do jogo
      queryClient.setQueryData(queryKeys.jogos.detail(updatedJogo.id), updatedJogo)
      
      // Invalidar dados relacionados
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.jogos.lists() 
      })
      
      if (updatedJogo.campeonatoId) {
        queryClient.invalidateQueries({ 
          queryKey: queryKeys.campeonatos.detail(updatedJogo.campeonatoId) 
        })
        
        // Invalidar classificação se for jogo de grupo
        if (updatedJogo.grupoId) {
          queryClient.invalidateQueries({ 
            queryKey: queryKeys.classificacao.grupo(updatedJogo.grupoId) 
          })
        }
      }
      
      notifications.success('Resultado atualizado!', 'Placar do jogo foi atualizado')
    },
    onError: (error: any) => {
      notifications.error('Erro ao atualizar resultado', error.message || 'Tente novamente')
    },
  })
}

// Hook para finalizar jogo
export function useFinalizarJogo() {
  const queryClient = useQueryClient()
  const notifications = useNotifications()

  return useMutation({
    mutationFn: (jogoId: number) => CampeonatosService.finalizarJogo(jogoId),
    onSuccess: (updatedJogo) => {
      // Atualizar cache do jogo
      queryClient.setQueryData(queryKeys.jogos.detail(updatedJogo.id), updatedJogo)
      
      // Invalidar listas e dados relacionados
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.jogos.lists() 
      })
      
      if (updatedJogo.campeonatoId) {
        queryClient.invalidateQueries({ 
          queryKey: queryKeys.campeonatos.detail(updatedJogo.campeonatoId) 
        })
      }
      
      notifications.success('Jogo finalizado!', 'Jogo foi marcado como finalizado')
    },
    onError: (error: any) => {
      notifications.error('Erro ao finalizar jogo', error.message || 'Tente novamente')
    },
  })
}

// Hook para adiar jogo
export function useAdiarJogo() {
  const queryClient = useQueryClient()
  const notifications = useNotifications()

  return useMutation({
    mutationFn: ({ jogoId, novaData }: { jogoId: number; novaData?: string }) =>
      CampeonatosService.adiarJogo(jogoId, novaData),
    onSuccess: (updatedJogo) => {
      // Atualizar cache do jogo
      queryClient.setQueryData(queryKeys.jogos.detail(updatedJogo.id), updatedJogo)
      
      // Invalidar listas
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.jogos.lists() 
      })
      
      if (updatedJogo.campeonatoId) {
        queryClient.invalidateQueries({ 
          queryKey: queryKeys.campeonatos.detail(updatedJogo.campeonatoId) 
        })
      }
      
      notifications.success('Jogo adiado!', 'Jogo foi adiado com sucesso')
    },
    onError: (error: any) => {
      notifications.error('Erro ao adiar jogo', error.message || 'Tente novamente')
    },
  })
}