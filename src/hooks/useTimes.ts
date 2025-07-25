import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { TimesService } from '@/services/times.service'
import { queryKeys } from './queryKeys'
import { useNotifications } from './useNotifications'
import { Time } from '@/types'

export function useTimes(temporada: string = '2025') {
  return useQuery({
    queryKey: queryKeys.times.list(temporada),
    queryFn: () => TimesService.getTimes(temporada),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    retry: 2,
    refetchOnWindowFocus: false,
  })
}

export function useTime(id: number) {
  return useQuery({
    queryKey: queryKeys.times.detail(id),
    queryFn: () => TimesService.getTime(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
    retry: 2,
  })
}

export function useTimeJogadores(timeId: number, temporada?: string) {
  return useQuery({
    queryKey: queryKeys.times.jogadores(timeId, temporada),
    queryFn: () => TimesService.getTimeJogadores(timeId, temporada),
    enabled: !!timeId,
    staleTime: 1000 * 60 * 3,
  })
}

export function useCreateTime() {
  const queryClient = useQueryClient()
  const notifications = useNotifications()

  return useMutation({
    mutationFn: (data: Omit<Time, 'id'>) => TimesService.createTime(data),
    onSuccess: (newTime) => {
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.times.list(newTime.temporada || '2025') 
      })
      
      queryClient.setQueryData(queryKeys.times.detail(newTime.id), newTime)
      
      notifications.success('Time criado!', `${newTime.nome} foi criado com sucesso`)
    },
    onError: (error: any) => {
      notifications.error('Erro ao criar time', error.message || 'Tente novamente')
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
      queryClient.setQueryData(queryKeys.times.detail(id), updatedTime)
      
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.times.list(updatedTime.temporada || '2025') 
      })
      
      notifications.success('Time atualizado!', `${updatedTime.nome} foi atualizado`)
    },
    onError: (error: any) => {
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
      queryClient.removeQueries({ 
        queryKey: queryKeys.times.detail(id) 
      })
      
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.times.lists() 
      })
      
      notifications.success('Time removido!', 'Time foi excluído com sucesso')
    },
    onError: (error: any) => {
      notifications.error('Erro ao remover time', error.message)
    },
  })
}

export function useImportarTimes() {
  const queryClient = useQueryClient()
  const notifications = useNotifications()

  return useMutation({
    mutationFn: TimesService.importarTimes,
    onSuccess: (result) => {
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.times.lists() 
      })
      
      notifications.success(
        'Importação concluída!', 
        `${result.sucesso || 0} times importados com sucesso`
      )
    },
    onError: (error: any) => {
      notifications.error('Erro na importação', error.message)
    },
  })
}