import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Time } from '@/types/time'
import { queryKeys } from '@/hooks/queryKeys'
import { useNotifications } from '@/hooks/useNotifications'
import { TimesService } from '@/services/times.services'

// Hook para buscar times (substitui o useTimes atual)
export function useTimesNew(temporada: string = '2025') {
  return useQuery({
    queryKey: queryKeys.times(temporada),
    queryFn: () => TimesService.getTimes(temporada),
    staleTime: 1000 * 60 * 5, // 5 minutos
    gcTime: 1000 * 60 * 10,   // 10 minutos no cache
    retry: 2,
    refetchOnWindowFocus: false, // Não refetch ao focar janela
  })
}

// Hook para buscar um time específico
export function useTimeNew(id: number) {
  return useQuery({
    queryKey: queryKeys.timeDetail(id),
    queryFn: () => TimesService.getTime(id),
    enabled: !!id, // Só executa se tiver ID
    staleTime: 1000 * 60 * 5,
    retry: 2,
  })
}

// Hook para buscar jogadores de um time
export function useTimeJogadoresNew(timeId: number, temporada?: string) {
  return useQuery({
    queryKey: queryKeys.timeJogadores(timeId, temporada),
    queryFn: () => TimesService.getTimeJogadores(timeId, temporada),
    enabled: !!timeId,
    staleTime: 1000 * 60 * 3, // 3 minutos (jogadores mudam mais)
  })
}

// Hook para criar time
export function useCreateTimeNew() {
  const queryClient = useQueryClient()
  const notifications = useNotifications()

  return useMutation({
    mutationFn: (data: Omit<Time, 'id'>) => TimesService.createTime(data),
    onSuccess: (newTime) => {
      // Invalidar lista de times da temporada
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.times(newTime.temporada || '2025') 
      })
      
      // Adicionar ao cache (otimização)
      queryClient.setQueryData(queryKeys.timeDetail(newTime.id), newTime)
      
      // Notificação de sucesso
      notifications.success('Time criado!', `${newTime.nome} foi criado com sucesso`)
    },
    onError: (error: any) => {
      notifications.error('Erro ao criar time', error.message || 'Tente novamente')
    },
  })
}

// Hook para atualizar time
export function useUpdateTimeNew() {
  const queryClient = useQueryClient()
  const notifications = useNotifications()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Time> }) =>
      TimesService.updateTime(id, data),
    onSuccess: (updatedTime, { id }) => {
      // Atualizar cache específico do time
      queryClient.setQueryData(queryKeys.timeDetail(id), updatedTime)
      
      // Invalidar lista de times
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.times(updatedTime.temporada || '2025') 
      })
      
      notifications.success('Time atualizado!', `${updatedTime.nome} foi atualizado`)
    },
    onError: (error: any) => {
      notifications.error('Erro ao atualizar time', error.message || 'Tente novamente')
    },
  })
}

// Hook para deletar time
export function useDeleteTimeNew() {
  const queryClient = useQueryClient()
  const notifications = useNotifications()

  return useMutation({
    mutationFn: (id: number) => TimesService.deleteTime(id),
    onSuccess: (_, id) => {
      // Remover do cache específico
      queryClient.removeQueries({ 
        queryKey: queryKeys.timeDetail(id) 
      })
      
      // Invalidar todas as listas de times
      queryClient.invalidateQueries({ 
        predicate: (query) => query.queryKey[0] === 'times'
      })
      
      notifications.success('Time removido!', 'Time foi excluído com sucesso')
    },
    onError: (error: any) => {
      notifications.error('Erro ao remover time', error.message || 'Tente novamente')
    },
  })
}

// Hook combinado para facilitar uso
export function useTimesActions() {
  const createTime = useCreateTimeNew()
  const updateTime = useUpdateTimeNew()
  const deleteTime = useDeleteTimeNew()

  return {
    createTime,
    updateTime,
    deleteTime,
    isLoading: createTime.isPending || updateTime.isPending || deleteTime.isPending,
  }
}