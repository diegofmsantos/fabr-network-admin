import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNotifications } from '@/hooks/useNotifications'
import { TimesService } from '@/services/times.services'
import { Time } from '@/types/time'

// Query Keys centralizados
export const timesQueryKeys = {
  all: ['times'] as const,
  lists: () => [...timesQueryKeys.all, 'list'] as const,
  list: (temporada: string) => [...timesQueryKeys.lists(), temporada] as const,
  details: () => [...timesQueryKeys.all, 'detail'] as const,
  detail: (id: number) => [...timesQueryKeys.details(), id] as const,
}

export function useTimes(temporada: string = '2025') {
  return useQuery({
    queryKey: timesQueryKeys.list(temporada),
    queryFn: () => TimesService.getTimes(temporada),
    staleTime: 1000 * 60 * 5, // 5 minutos
    gcTime: 1000 * 60 * 10,   // 10 minutos
  })
}

export function useTime(id: number) {
  return useQuery({
    queryKey: timesQueryKeys.detail(id),
    queryFn: () => TimesService.getTime(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  })
}

export function useCreateTime() {
  const queryClient = useQueryClient()
  const notifications = useNotifications()

  return useMutation({
    mutationFn: TimesService.createTime,
    onSuccess: (newTime) => {
      // Invalidar listas
      queryClient.invalidateQueries({ 
        queryKey: timesQueryKeys.lists() 
      })
      
      notifications.success('Time criado!', `${newTime.nome} foi criado com sucesso`)
    },
    onError: (error) => {
      notifications.error('Erro ao criar time', error.message)
    },
  })
}

export function useUpdateTime() {
  const queryClient = useQueryClient()
  const notifications = useNotifications()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Time> }) =>
      TimesService.updateTime(id, data),
    onSuccess: (updatedTime, { id }) => {
      // Atualizar cache específico
      queryClient.setQueryData(timesQueryKeys.detail(id), updatedTime)
      
      // Invalidar listas
      queryClient.invalidateQueries({ 
        queryKey: timesQueryKeys.lists() 
      })
      
      notifications.success('Time atualizado!', `${updatedTime.nome} foi atualizado`)
    },
    onError: (error) => {
      notifications.error('Erro ao atualizar time', error.message)
    },
  })
}

export function useDeleteTime() {
  const queryClient = useQueryClient()
  const notifications = useNotifications()

  return useMutation({
    mutationFn: TimesService.deleteTime,
    onSuccess: (_, id) => {
      // Remover do cache
      queryClient.removeQueries({ 
        queryKey: timesQueryKeys.detail(id) 
      })
      
      // Invalidar listas
      queryClient.invalidateQueries({ 
        queryKey: timesQueryKeys.lists() 
      })
      
      notifications.success('Time removido!', 'Time foi excluído com sucesso')
    },
    onError: (error) => {
      notifications.error('Erro ao remover time', error.message)
    },
  })
}