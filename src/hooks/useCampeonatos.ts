// src/hooks/useCampeonatos.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { CampeonatosService } from '@/services/campeonatos.service'
import { queryKeys } from './queryKeys'
import { useNotifications } from './useNotifications'
import { Campeonato, CriarCampeonatoRequest, FiltroJogos } from '@/types';

// ==================== CAMPEONATOS ====================

// Hook para buscar campeonatos
export function useCampeonatos(filters?: { temporada?: string; tipo?: string; status?: string }) {
  return useQuery({
    queryKey: queryKeys.campeonatos.list(filters || {}),
    queryFn: () => CampeonatosService.getCampeonatos(filters),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    retry: 2,
    refetchOnWindowFocus: false,
  })
}

// Hook para buscar um campeonato específico
export function useCampeonato(id: number) {
  return useQuery({
    queryKey: queryKeys.campeonatos.detail(id),
    queryFn: () => CampeonatosService.getCampeonato(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
    retry: 2,
  })
}

// Hook para criar campeonato
export function useCreateCampeonato() {
  const queryClient = useQueryClient()
  const notifications = useNotifications()

  return useMutation({
    mutationFn: (data: CriarCampeonatoRequest) => CampeonatosService.createCampeonato(data),
    onSuccess: (newCampeonato) => {
      // Invalidar lista de campeonatos
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.campeonatos.lists() 
      })
      
      // Adicionar ao cache
      queryClient.setQueryData(queryKeys.campeonatos.detail(newCampeonato.id), newCampeonato)
      
      notifications.success('Campeonato criado!', `${newCampeonato.nome} foi criado com sucesso`)
    },
    onError: (error: any) => {
      notifications.error('Erro ao criar campeonato', error.message || 'Tente novamente')
    },
  })
}

// Hook para atualizar campeonato
export function useUpdateCampeonato() {
  const queryClient = useQueryClient()
  const notifications = useNotifications()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Campeonato> }) =>
      CampeonatosService.updateCampeonato(id, data),
    onSuccess: (updatedCampeonato, { id }) => {
      // Atualizar cache específico
      queryClient.setQueryData(queryKeys.campeonatos.detail(id), updatedCampeonato)
      
      // Invalidar lista de campeonatos
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.campeonatos.lists() 
      })
      
      notifications.success('Campeonato atualizado!', `${updatedCampeonato.nome} foi atualizado`)
    },
    onError: (error: any) => {
      notifications.error('Erro ao atualizar campeonato', error.message)
    },
  })
}

// Hook para deletar campeonato
export function useDeleteCampeonato() {
  const queryClient = useQueryClient()
  const notifications = useNotifications()

  return useMutation({
    mutationFn: CampeonatosService.deleteCampeonato,
    onSuccess: (_, id) => {
      // Remover do cache
      queryClient.removeQueries({ 
        queryKey: queryKeys.campeonatos.detail(id) 
      })
      
      // Invalidar listas
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.campeonatos.lists() 
      })
      
      notifications.success('Campeonato removido!', 'Campeonato foi excluído com sucesso')
    },
    onError: (error: any) => {
      notifications.error('Erro ao remover campeonato', error.message)
    },
  })
}

// ==================== GRUPOS ====================

// Hook para buscar grupos do campeonato
export function useGrupos(campeonatoId: number) {
  return useQuery({
    queryKey: queryKeys.campeonatos.grupos(campeonatoId),
    queryFn: () => CampeonatosService.getGrupos(campeonatoId),
    enabled: !!campeonatoId,
    staleTime: 1000 * 60 * 3,
  })
}

// ==================== JOGOS ====================

// Hook para buscar jogos
export function useJogos(filters: FiltroJogos) {
  return useQuery({
    queryKey: queryKeys.jogos.list(filters),
    queryFn: () => CampeonatosService.getJogos(filters),
    staleTime: 1000 * 60 * 2, // Jogos mudam mais frequentemente
    gcTime: 1000 * 60 * 5,
    retry: 2,
  })
}

// Hook para buscar um jogo específico
export function useJogo(id: number) {
  return useQuery({
    queryKey: queryKeys.jogos.detail(id),
    queryFn: () => CampeonatosService.getJogo(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 2,
  })
}

// Hook para próximos jogos
export function useProximosJogos(campeonatoId: number, limit?: number) {
  return useQuery({
    queryKey: queryKeys.campeonatos.proximosJogos(campeonatoId, limit),
    queryFn: () => CampeonatosService.getProximosJogos(campeonatoId, limit),
    enabled: !!campeonatoId,
    staleTime: 1000 * 60 * 1, // 1 minuto para próximos jogos
  })
}

// Hook para últimos resultados
export function useUltimosResultados(campeonatoId: number, limit?: number) {
  return useQuery({
    queryKey: queryKeys.campeonatos.ultimosResultados(campeonatoId, limit),
    queryFn: () => CampeonatosService.getUltimosResultados(campeonatoId, limit),
    enabled: !!campeonatoId,
    staleTime: 1000 * 60 * 5,
  })
}

// ==================== CLASSIFICAÇÃO ====================

// Hook para buscar classificação do campeonato
export function useClassificacao(campeonatoId: number) {
  return useQuery({
    queryKey: queryKeys.classificacao.campeonato(campeonatoId),
    queryFn: () => CampeonatosService.getClassificacao(campeonatoId),
    enabled: !!campeonatoId,
    staleTime: 1000 * 60 * 2,
  })
}

// Hook para classificação de um grupo específico
export function useClassificacaoGrupo(grupoId: number) {
  return useQuery({
    queryKey: queryKeys.classificacao.grupo(grupoId),
    queryFn: () => CampeonatosService.getClassificacaoGrupo(grupoId),
    enabled: !!grupoId,
    staleTime: 1000 * 60 * 2,
  })
}

// ==================== MUTATIONS UTILITÁRIAS ====================

// Hook para gerar jogos
export function useGerarJogos() {
  const queryClient = useQueryClient()
  const notifications = useNotifications()

  return useMutation({
    mutationFn: (campeonatoId: number) => CampeonatosService.gerarJogos(campeonatoId),
    onSuccess: (result, campeonatoId) => {
      // Invalidar dados relacionados ao campeonato
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.campeonatos.detail(campeonatoId) 
      })
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.jogos.lists() 
      })
      
      notifications.success(
        'Jogos gerados!', 
        `${result.jogosGerados || 0} jogos foram criados com sucesso`
      )
    },
    onError: (error: any) => {
      notifications.error('Erro ao gerar jogos', error.message)
    },
  })
}

// Hook para recalcular classificação
export function useRecalcularClassificacao() {
  const queryClient = useQueryClient()
  const notifications = useNotifications()

  return useMutation({
    mutationFn: (grupoId: number) => CampeonatosService.recalcularClassificacao(grupoId),
    onSuccess: (_, grupoId) => {
      // Invalidar classificações
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.classificacao.grupo(grupoId) 
      })
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.classificacao.all 
      })
      
      notifications.success('Classificação recalculada!', 'As posições foram atualizadas')
    },
    onError: (error: any) => {
      notifications.error('Erro ao recalcular classificação', error.message)
    },
  })
}