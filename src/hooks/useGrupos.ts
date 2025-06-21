import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { CampeonatosService } from '@/services/campeonatos.service'
import { queryKeys } from './queryKeys'
import { useNotifications } from './useNotifications'
import { Grupo } from '@/types'

// ==================== GRUPOS ====================

// Hook para buscar grupos de um campeonato
export function useGrupos(campeonatoId: number) {
  return useQuery({
    queryKey: queryKeys.grupos.list(campeonatoId),
    queryFn: () => CampeonatosService.getGrupos(campeonatoId),
    enabled: !!campeonatoId,
    staleTime: 1000 * 60 * 5,
    retry: 2,
  })
}

// Hook para buscar um grupo específico
export function useGrupo(id: number) {
  return useQuery({
    queryKey: queryKeys.grupos.detail(id),
    queryFn: () => CampeonatosService.getGrupo(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
    retry: 2,
  })
}

// Hook para atualizar nome do grupo
export function useUpdateGrupoNome() {
  const queryClient = useQueryClient()
  const notifications = useNotifications()

  return useMutation({
    mutationFn: ({ id, nome }: { id: number; nome: string }) =>
      CampeonatosService.updateGrupo(id, { nome }),
    onSuccess: (updatedGrupo, { id }) => {
      // Atualizar cache específico
      queryClient.setQueryData(queryKeys.grupos.detail(id), updatedGrupo)
      
      // Invalidar lista de grupos do campeonato
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.grupos.list(updatedGrupo.campeonatoId) 
      })
      
      // Invalidar dados do campeonato
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.campeonatos.detail(updatedGrupo.campeonatoId) 
      })
      
      notifications.success('Grupo atualizado!', `Nome alterado para "${updatedGrupo.nome}"`)
    },
    onError: (error: any) => {
      notifications.error('Erro ao atualizar grupo', error.message || 'Tente novamente')
    },
  })
}

// Hook para adicionar time ao grupo
export function useAdicionarTimeAoGrupo() {
  const queryClient = useQueryClient()
  const notifications = useNotifications()

  return useMutation({
    mutationFn: ({ grupoId, timeId }: { grupoId: number; timeId: number }) =>
      CampeonatosService.adicionarTimeAoGrupo(grupoId, timeId),
    onSuccess: (_, { grupoId }) => {
      // Invalidar dados do grupo
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.grupos.detail(grupoId) 
      })
      
      // Invalidar lista de grupos
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.grupos.lists() 
      })
      
      // Invalidar dados do campeonato
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.campeonatos.all 
      })
      
      notifications.success('Time adicionado!', 'Time foi adicionado ao grupo com sucesso')
    },
    onError: (error: any) => {
      notifications.error('Erro ao adicionar time', error.message || 'Tente novamente')
    },
  })
}

// Hook para remover time do grupo
export function useRemoverTimeDoGrupo() {
  const queryClient = useQueryClient()
  const notifications = useNotifications()

  return useMutation({
    mutationFn: ({ grupoId, timeId }: { grupoId: number; timeId: number }) =>
      CampeonatosService.removerTimeDoGrupo(grupoId, timeId),
    onSuccess: (_, { grupoId }) => {
      // Invalidar dados do grupo
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.grupos.detail(grupoId) 
      })
      
      // Invalidar lista de grupos
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.grupos.lists() 
      })
      
      // Invalidar dados do campeonato
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.campeonatos.all 
      })
      
      notifications.success('Time removido!', 'Time foi removido do grupo com sucesso')
    },
    onError: (error: any) => {
      notifications.error('Erro ao remover time', error.message || 'Tente novamente')
    },
  })
}

// Hook para mover times entre grupos
export function useMoverTimesEntreGrupos() {
  const queryClient = useQueryClient()
  const notifications = useNotifications()

  return useMutation({
    mutationFn: ({ 
      timesIds, 
      grupoOrigemId, 
      grupoDestinoId 
    }: { 
      timesIds: number[]
      grupoOrigemId: number
      grupoDestinoId: number 
    }) => CampeonatosService.moverTimesEntreGrupos(timesIds, grupoOrigemId, grupoDestinoId),
    onSuccess: (_, { grupoOrigemId, grupoDestinoId }) => {
      // Invalidar grupos afetados
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.grupos.detail(grupoOrigemId) 
      })
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.grupos.detail(grupoDestinoId) 
      })
      
      // Invalidar lista de grupos
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.grupos.lists() 
      })
      
      // Invalidar dados do campeonato
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.campeonatos.all 
      })
      
      notifications.success('Times movidos!', 'Times foram movidos entre grupos com sucesso')
    },
    onError: (error: any) => {
      notifications.error('Erro ao mover times', error.message || 'Tente novamente')
    },
  })
}

// Hook para esvaziar grupo
export function useEsvaziarGrupo() {
  const queryClient = useQueryClient()
  const notifications = useNotifications()

  return useMutation({
    mutationFn: (grupoId: number) => CampeonatosService.esvaziarGrupo(grupoId),
    onSuccess: (_, grupoId) => {
      // Invalidar dados do grupo
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.grupos.detail(grupoId) 
      })
      
      // Invalidar lista de grupos
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.grupos.lists() 
      })
      
      // Invalidar dados do campeonato
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.campeonatos.all 
      })
      
      notifications.success('Grupo esvaziado!', 'Todos os times foram removidos do grupo')
    },
    onError: (error: any) => {
      notifications.error('Erro ao esvaziar grupo', error.message || 'Tente novamente')
    },
  })
}

// Hook para misturar times no grupo
export function useMisturarTimesGrupo() {
  const queryClient = useQueryClient()
  const notifications = useNotifications()

  return useMutation({
    mutationFn: (grupoId: number) => CampeonatosService.misturarTimesGrupo(grupoId),
    onSuccess: (_, grupoId) => {
      // Invalidar dados do grupo
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.grupos.detail(grupoId) 
      })
      
      // Invalidar lista de grupos
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.grupos.lists() 
      })
      
      notifications.success('Times misturados!', 'A ordem dos times no grupo foi alterada')
    },
    onError: (error: any) => {
      notifications.error('Erro ao misturar times', error.message || 'Tente novamente')
    },
  })
}

// Hook para distribuir times automaticamente
export function useDistribuirTimesAutomaticamente() {
  const queryClient = useQueryClient()
  const notifications = useNotifications()

  return useMutation({
    mutationFn: (campeonatoId: number) => CampeonatosService.distribuirTimesAutomaticamente(campeonatoId),
    onSuccess: (_, campeonatoId) => {
      // Invalidar todos os dados do campeonato
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.campeonatos.detail(campeonatoId) 
      })
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.grupos.lists() 
      })
      
      notifications.success('Times distribuídos!', 'Times foram distribuídos automaticamente entre os grupos')
    },
    onError: (error: any) => {
      notifications.error('Erro na distribuição automática', error.message || 'Tente novamente')
    },
  })
}