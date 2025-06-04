import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Campeonato } from '@/types/campeonato'
import { useNotifications } from '@/hooks/useNotifications'
import { handleApiError } from '@/utils/errorHandler'
import { campeonatoQueryKeys } from './useCampeonatos'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export function useUpdateCampeonato() {
  const queryClient = useQueryClient()
  const notifications = useNotifications()

  return useMutation({
    mutationFn: async ({ 
      id, 
      data 
    }: { 
      id: number; 
      data: Partial<Campeonato> 
    }): Promise<Campeonato> => {
      const response = await fetch(`${API_BASE_URL}/campeonatos/campeonatos/${id}`, {
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
      // Atualizar cache específico
      queryClient.setQueryData(campeonatoQueryKeys.detail(id), data)
      
      // Invalidar listas para garantir consistência
      queryClient.invalidateQueries({ queryKey: campeonatoQueryKeys.lists() })
      
      notifications.success(
        'Campeonato atualizado!', 
        `${data.nome} foi atualizado com sucesso`
      )
    },
    onError: (error) => {
      notifications.error(
        'Erro ao atualizar campeonato', 
        error.message || 'Verifique os dados e tente novamente'
      )
    }
  })
}