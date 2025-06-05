"use client"

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Campeonato, Jogo, ClassificacaoGrupo, FiltroJogos, CriarCampeonatoRequest } from '@/types/campeonato'
import { useNotifications } from '@/hooks/useNotifications'
import { handleApiError } from '@/utils/errorHandler'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

// Query Keys
export const campeonatoQueryKeys = {
  all: ['campeonatos'] as const,
  lists: () => [...campeonatoQueryKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...campeonatoQueryKeys.lists(), filters] as const,
  details: () => [...campeonatoQueryKeys.all, 'detail'] as const,
  detail: (id: number) => [...campeonatoQueryKeys.details(), id] as const,
  jogos: (filters: FiltroJogos) => [...campeonatoQueryKeys.all, 'jogos', filters] as const,
  classificacao: (campeonatoId: number) => [...campeonatoQueryKeys.all, 'classificacao', campeonatoId] as const,
  proximosJogos: (campeonatoId: number) => [...campeonatoQueryKeys.all, 'proximos', campeonatoId] as const,
  ultimosResultados: (campeonatoId: number) => [...campeonatoQueryKeys.all, 'resultados', campeonatoId] as const,
}

// ===== CORREÇÃO 6: useGerarJogos =====
export function useGerarJogos() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (campeonatoId: number) => {
      // ✅ CORRIGIR ROTA DE GERAR JOGOS:
      const response = await fetch(`${API_BASE_URL}/campeonatos/campeonatos/${campeonatoId}/gerar-jogos`, {
        method: 'POST',
      })

      if (!response.ok) {
        throw new Error('Erro ao gerar jogos')
      }

      return response.json()
    },
    onSuccess: (_, campeonatoId) => {
      queryClient.invalidateQueries({ queryKey: campeonatoQueryKeys.detail(campeonatoId) })
      queryClient.invalidateQueries({ queryKey: campeonatoQueryKeys.jogos({}) })
    },
  })
}

export function useJogo(jogoId: number) {
  return useQuery({
    queryKey: [...campeonatoQueryKeys.all, 'jogo', jogoId] as const,
    queryFn: async (): Promise<Jogo> => {
      const response = await fetch(`${API_BASE_URL}/campeonatos/jogos/${jogoId}`)
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Jogo não encontrado')
        }
        throw new Error('Erro ao buscar jogo')
      }
      
      return response.json()
    },
    enabled: !!jogoId,
    staleTime: 1000 * 60 * 2,
  })
}

export function useJogosTime(timeId: number, campeonatoId?: number, limit: number = 20) {
  return useQuery({
    queryKey: [...campeonatoQueryKeys.all, 'jogos-time', timeId, campeonatoId, limit] as const,
    queryFn: async (): Promise<Jogo[]> => {
      const params = new URLSearchParams()
      params.append('timeId', String(timeId))
      params.append('limit', String(limit))
      
      if (campeonatoId) {
        params.append('campeonatoId', String(campeonatoId))
      }

      const response = await fetch(`${API_BASE_URL}/campeonatos/jogos?${params.toString()}`)
      
      if (!response.ok) {
        throw new Error('Erro ao buscar jogos do time')
      }
      
      return response.json()
    },
    enabled: !!timeId,
    staleTime: 1000 * 60 * 3, // 3 minutos
  })
}

// Hook para jogos de uma rodada específica
export function useJogosRodada(campeonatoId: number, rodada: number) {
  return useQuery({
    queryKey: [...campeonatoQueryKeys.all, 'rodada', campeonatoId, rodada] as const,
    queryFn: async (): Promise<Jogo[]> => {
      const response = await fetch(
        `${API_BASE_URL}/campeonatos/jogos?campeonatoId=${campeonatoId}&rodada=${rodada}`
      )
      
      if (!response.ok) {
        throw new Error('Erro ao buscar jogos da rodada')
      }
      
      return response.json()
    },
    enabled: !!campeonatoId && !!rodada,
    staleTime: 1000 * 60 * 5, // 5 minutos
  })
}


export function useJogos(filters: FiltroJogos) {
  return useQuery({
    queryKey: campeonatoQueryKeys.jogos(filters),
    queryFn: async (): Promise<Jogo[]> => {
      const params = new URLSearchParams()
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, String(value))
        }
      })

      const response = await fetch(`${API_BASE_URL}/campeonatos/jogos?${params.toString()}`)
      
      if (!response.ok) {
        throw new Error('Erro ao buscar jogos')
      }
      
      return response.json()
    },
    staleTime: 1000 * 60 * 2,
  })
}

export function useProximosJogos(campeonatoId: number, limit: number = 10) {
  return useQuery({
    queryKey: [...campeonatoQueryKeys.proximosJogos(campeonatoId), limit] as const,
    queryFn: async (): Promise<Jogo[]> => {
      const response = await fetch(
        `${API_BASE_URL}/campeonatos/campeonatos/${campeonatoId}/proximos-jogos?limit=${limit}`
      )
      
      if (!response.ok) {
        throw new Error('Erro ao buscar próximos jogos')
      }
      
      return response.json()
    },
    enabled: !!campeonatoId,
    staleTime: 1000 * 60 * 5, 
  })
}

export function useUltimosResultados(campeonatoId: number, limit: number = 10) {
  return useQuery({
    queryKey: [...campeonatoQueryKeys.ultimosResultados(campeonatoId), limit] as const,
    queryFn: async (): Promise<Jogo[]> => {
      const response = await fetch(
        `${API_BASE_URL}/campeonatos/campeonatos/${campeonatoId}/ultimos-resultados?limit=${limit}`
      )
      
      if (!response.ok) {
        throw new Error('Erro ao buscar últimos resultados')
      }
      
      return response.json()
    },
    enabled: !!campeonatoId,
    staleTime: 1000 * 60 * 5, 
  })
}

export function useCreateJogo() {
  const queryClient = useQueryClient()
  const notifications = useNotifications()

  return useMutation({
    mutationFn: async (data: Omit<Jogo, 'id'>): Promise<Jogo> => {
      const response = await fetch(`${API_BASE_URL}/campeonatos/jogos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json().catch(() => ({}))
        throw handleApiError({ response, message: error.message })
      }

      return response.json()
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: campeonatoQueryKeys.jogos({}) })
      queryClient.invalidateQueries({ queryKey: campeonatoQueryKeys.detail(data.campeonatoId) })
      
      notifications.success(
        'Jogo criado!',
        'O jogo foi agendado com sucesso'
      )
    },
    onError: (error) => {
      notifications.error(
        'Erro ao criar jogo',
        error.message || 'Verifique os dados e tente novamente'
      )
    },
  })
}

// Atualizar jogo (placar, status, etc.)
export function useUpdateJogo() {
  const queryClient = useQueryClient()
  const notifications = useNotifications()

  return useMutation({
    mutationFn: async ({ 
      id, 
      data 
    }: { 
      id: number; 
      data: Partial<Jogo> 
    }): Promise<Jogo> => {
      const response = await fetch(`${API_BASE_URL}/campeonatos/jogos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw handleApiError({ response })
      }

      return response.json()
    },
    onSuccess: (data, { id }) => {
      // Atualizar cache do jogo específico
      queryClient.setQueryData([...campeonatoQueryKeys.all, 'jogo', id], data)
      
      // Invalidar listas relacionadas
      queryClient.invalidateQueries({ queryKey: campeonatoQueryKeys.jogos({}) })
      queryClient.invalidateQueries({ queryKey: campeonatoQueryKeys.detail(data.campeonatoId) })
      queryClient.invalidateQueries({ queryKey: campeonatoQueryKeys.classificacao(data.campeonatoId) })
      
      notifications.success(
        'Jogo atualizado!',
        'As informações do jogo foram atualizadas'
      )
    },
    onError: (error) => {
      notifications.error(
        'Erro ao atualizar jogo',
        error.message || 'Tente novamente'
      )
    }
  })
}

// Deletar jogo
export function useDeleteJogo() {
  const queryClient = useQueryClient()
  const notifications = useNotifications()

  return useMutation({
    mutationFn: async (jogoId: number): Promise<void> => {
      const response = await fetch(`${API_BASE_URL}/campeonatos/jogos/${jogoId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      })

      if (!response.ok) {
        throw handleApiError({ response })
      }
    },
    onSuccess: (_, jogoId) => {
      queryClient.invalidateQueries({ queryKey: campeonatoQueryKeys.jogos({}) })
      queryClient.removeQueries({ queryKey: [...campeonatoQueryKeys.all, 'jogo', jogoId] })
      
      notifications.success(
        'Jogo excluído!',
        'O jogo foi removido do campeonato'
      )
    },
    onError: (error) => {
      notifications.error(
        'Erro ao excluir jogo',
        error.message || 'Verifique se o jogo não possui estatísticas processadas'
      )
    }
  })
}

// Bulk delete jogos
export function useBulkDeleteJogos() {
  const queryClient = useQueryClient()
  const notifications = useNotifications()

  return useMutation({
    mutationFn: async (jogoIds: number[]): Promise<void> => {
      const response = await fetch(`${API_BASE_URL}/admin/jogos/bulk-delete`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ids: jogoIds })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || 'Erro ao excluir jogos')
      }

      return response.json()
    },
    onSuccess: (_, jogoIds) => {
      queryClient.invalidateQueries({ queryKey: campeonatoQueryKeys.jogos({}) })
      
      // Remover cada jogo do cache
      jogoIds.forEach(id => {
        queryClient.removeQueries({ queryKey: [...campeonatoQueryKeys.all, 'jogo', id] })
      })

      notifications.success(
        'Jogos excluídos!',
        `${jogoIds.length} jogos foram removidos`
      )
    },
    onError: (error) => {
      notifications.error(
        'Erro ao excluir jogos',
        error.message || 'Alguns jogos podem ter estatísticas processadas'
      )
    }
  })
}
