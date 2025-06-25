"use client"

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNotifications } from '@/hooks/useNotifications'
import { queryKeys } from './queryKeys'
import { FiltroJogos } from '@/types'
import { CampeonatosService } from '@/services/campeonatos.service'

export function useJogos(filters: FiltroJogos) {
  return useQuery({
    queryKey: queryKeys.jogos.list(filters),
    queryFn: () => CampeonatosService.getJogos(filters),
    staleTime: 1000 * 60 * 2, 
    retry: 2,
  })
}

export function useJogo(jogoId: number) {
  return useQuery({
    queryKey: queryKeys.jogos.detail(jogoId),
    queryFn: () => CampeonatosService.getJogo(jogoId),
    enabled: !!jogoId,
    staleTime: 1000 * 60 * 2,
  })
}

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

export function useCreateJogo() {
  const queryClient = useQueryClient()
  const notifications = useNotifications()

  return useMutation({
    mutationFn: (data: any) => CampeonatosService.createJogo(data),
    onSuccess: (newJogo) => {
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.jogos.lists() 
      })
      
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.campeonatos.detail(newJogo.campeonatoId) 
      })
      
      queryClient.setQueryData(queryKeys.jogos.detail(newJogo.id), newJogo)
      
      notifications.success('Jogo criado!', 'Jogo foi criado com sucesso')
    },
    onError: (error: any) => {
      notifications.error('Erro ao criar jogo', error.message || 'Tente novamente')
    },
  })
}

export function useUpdateJogo() {
  const queryClient = useQueryClient()
  const notifications = useNotifications()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      CampeonatosService.updateJogo(id, data),
    onSuccess: (updatedJogo, { id }) => {
      queryClient.setQueryData(queryKeys.jogos.detail(id), updatedJogo)
      
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.jogos.lists() 
      })
      
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

export function useDeleteJogo() {
  const queryClient = useQueryClient()
  const notifications = useNotifications()

  return useMutation({
    mutationFn: (id: number) => CampeonatosService.deleteJogo(id),
    onSuccess: (_, id) => {
      queryClient.removeQueries({ 
        queryKey: queryKeys.jogos.detail(id) 
      })
      
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.jogos.lists() 
      })
      
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

export function useGerarJogos() {
  const queryClient = useQueryClient()
  const notifications = useNotifications()

  return useMutation({
    mutationFn: (campeonatoId: number) => CampeonatosService.gerarJogos(campeonatoId),
    onSuccess: (result, campeonatoId) => {
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.campeonatos.detail(campeonatoId) 
      })
      
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
      queryClient.setQueryData(queryKeys.jogos.detail(updatedJogo.id), updatedJogo)
      
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.jogos.lists() 
      })
      
      if (updatedJogo.campeonatoId) {
        queryClient.invalidateQueries({ 
          queryKey: queryKeys.campeonatos.detail(updatedJogo.campeonatoId) 
        })
        
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

export function useFinalizarJogo() {
  const queryClient = useQueryClient()
  const notifications = useNotifications()

  return useMutation({
    mutationFn: (jogoId: number) => CampeonatosService.finalizarJogo(jogoId),
    onSuccess: (updatedJogo) => {
      queryClient.setQueryData(queryKeys.jogos.detail(updatedJogo.id), updatedJogo)
      
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

export function useAdiarJogo() {
  const queryClient = useQueryClient()
  const notifications = useNotifications()

  return useMutation({
    mutationFn: ({ jogoId, novaData }: { jogoId: number; novaData?: string }) =>
      CampeonatosService.adiarJogo(jogoId, novaData),
    onSuccess: (updatedJogo) => {
      queryClient.setQueryData(queryKeys.jogos.detail(updatedJogo.id), updatedJogo)
      
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