import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { MateriasService } from '@/services/materias.service'
import { queryKeys } from './queryKeys'
import { useNotifications } from './useNotifications'
import { Materia } from '@/types'

export function useMaterias() {
  return useQuery({
    queryKey: queryKeys.materias.lists(),
    queryFn: MateriasService.getMaterias,
    staleTime: 1000 * 60 * 5, 
    gcTime: 1000 * 60 * 10,  
    retry: 2,
    refetchOnWindowFocus: false,
  })
}

export function useMateria(id: number) {
  return useQuery({
    queryKey: queryKeys.materias.detail(id),
    queryFn: () => MateriasService.getMateria(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
    retry: 2,
  })
}

export function useCreateMateria() {
  const queryClient = useQueryClient()
  const notifications = useNotifications()

  return useMutation({
    mutationFn: (data: Omit<Materia, 'id'>) => MateriasService.createMateria(data),
    onSuccess: (newMateria) => {
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.materias.lists() 
      })
      
      queryClient.setQueryData(queryKeys.materias.detail(newMateria.id), newMateria)
      
      notifications.success('Matéria criada!', `"${newMateria.titulo}" foi criada com sucesso`)
    },
    onError: (error: any) => {
      notifications.error('Erro ao criar matéria', error.message || 'Tente novamente')
    },
  })
}

export function useUpdateMateria() {
  const queryClient = useQueryClient()
  const notifications = useNotifications()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Materia> }) =>
      MateriasService.updateMateria(id, data),
    onSuccess: (updatedMateria, { id }) => {
      queryClient.setQueryData(queryKeys.materias.detail(id), updatedMateria)
      
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.materias.lists() 
      })
      
      notifications.success('Matéria atualizada!', `"${updatedMateria.titulo}" foi atualizada`)
    },
    onError: (error: any) => {
      notifications.error('Erro ao atualizar matéria', error.message)
    },
  })
}

export function useDeleteMateria() {
  const queryClient = useQueryClient()
  const notifications = useNotifications()

  return useMutation({
    mutationFn: MateriasService.deleteMateria,
    onSuccess: (_, id) => {
      queryClient.removeQueries({ 
        queryKey: queryKeys.materias.detail(id) 
      })
      
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.materias.lists() 
      })
      
      notifications.success('Matéria removida!', 'Matéria foi excluída com sucesso')
    },
    onError: (error: any) => {
      notifications.error('Erro ao remover matéria', error.message)
    },
  })
}