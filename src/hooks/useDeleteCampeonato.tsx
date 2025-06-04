// src/hooks/useDeleteCampeonato.ts
"use client"

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { campeonatoQueryKeys } from './useCampeonatos'
import { handleApiError } from '@/utils/errorHandler'
import { useNotifications } from './useNotifications'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export function useDeleteCampeonato() {
  const queryClient = useQueryClient()
  const notifications = useNotifications()

  return useMutation({
    mutationFn: async (campeonatoId: number): Promise<void> => {
      const response = await fetch(`${API_BASE_URL}/campeonatos/campeonatos/${campeonatoId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      })

      if (!response.ok) {
        throw handleApiError({ response })
      }
    },
    onSuccess: (_, campeonatoId) => {
      queryClient.invalidateQueries({ queryKey: campeonatoQueryKeys.lists() })
      queryClient.removeQueries({ queryKey: campeonatoQueryKeys.detail(campeonatoId) })
      
      notifications.success(
        'Campeonato excluído!', 
        'O campeonato foi removido permanentemente'
      )
    },
    onError: (error) => {
      notifications.error(
        'Erro ao excluir campeonato', 
        error.message || 'Verifique se o campeonato não possui jogos associados'
      )
    }
  })
}

// Hook auxiliar para deletar múltiplos campeonatos
export function useBulkDeleteCampeonatos() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (campeonatoIds: number[]): Promise<void> => {
      const response = await fetch(`${API_BASE_URL}/admin/campeonatos/bulk-delete`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ids: campeonatoIds })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || 'Erro ao excluir campeonatos')
      }

      return response.json()
    },
    
    onSuccess: (_, campeonatoIds) => {
      // Invalidar todas as queries relacionadas
      queryClient.invalidateQueries({ queryKey: campeonatoQueryKeys.lists() })
      queryClient.invalidateQueries({ queryKey: ['adminStats'] })
      
      // Remover cada campeonato do cache
      campeonatoIds.forEach(id => {
        queryClient.removeQueries({ queryKey: campeonatoQueryKeys.detail(id) })
        queryClient.removeQueries({ queryKey: campeonatoQueryKeys.jogos({ campeonatoId: id }) })
        queryClient.removeQueries({ queryKey: campeonatoQueryKeys.classificacao(id) })
      })
    }
  })
}