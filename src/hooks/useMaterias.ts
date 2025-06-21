import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { MateriasService } from '@/services/materias.service'
import { queryKeys } from './queryKeys'
import { useNotifications } from './useNotifications'
import { Materia } from '@/types'

// Hook para buscar matérias
export function useMaterias() {
  return useQuery({
    queryKey: queryKeys.materias.lists(),
    queryFn: MateriasService.getMaterias,
    staleTime: 1000 * 60 * 5, // 5 minutos
    gcTime: 1000 * 60 * 10,   // 10 minutos
    retry: 2,
    refetchOnWindowFocus: false,
  })
}

// Hook para buscar uma matéria específica
export function useMateria(id: number) {
  return useQuery({
    queryKey: queryKeys.materias.detail(id),
    queryFn: () => MateriasService.getMateria(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
    retry: 2,
  })
}

// Hook para criar matéria
export function useCreateMateria() {
  const queryClient = useQueryClient()
  const notifications = useNotifications()

  return useMutation({
    mutationFn: (data: Omit<Materia, 'id'>) => MateriasService.createMateria(data),
    onSuccess: (newMateria) => {
      // Invalidar lista de matérias
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.materias.lists() 
      })
      
      // Adicionar ao cache
      queryClient.setQueryData(queryKeys.materias.detail(newMateria.id), newMateria)
      
      notifications.success('Matéria criada!', `"${newMateria.titulo}" foi criada com sucesso`)
    },
    onError: (error: any) => {
      notifications.error('Erro ao criar matéria', error.message || 'Tente novamente')
    },
  })
}

// Hook para atualizar matéria
export function useUpdateMateria() {
  const queryClient = useQueryClient()
  const notifications = useNotifications()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Materia> }) =>
      MateriasService.updateMateria(id, data),
    onSuccess: (updatedMateria, { id }) => {
      // Atualizar cache específico
      queryClient.setQueryData(queryKeys.materias.detail(id), updatedMateria)
      
      // Invalidar lista de matérias
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

// Hook para deletar matéria
export function useDeleteMateria() {
  const queryClient = useQueryClient()
  const notifications = useNotifications()

  return useMutation({
    mutationFn: MateriasService.deleteMateria,
    onSuccess: (_, id) => {
      // Remover do cache
      queryClient.removeQueries({ 
        queryKey: queryKeys.materias.detail(id) 
      })
      
      // Invalidar lista de matérias
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