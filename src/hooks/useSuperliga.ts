// src/hooks/useSuperliga.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNotifications } from './useNotifications'
import { ConferenciaConfig, TipoConferencia, TipoRegional } from '@/types'
import { SuperligaService } from '@/services/superliga.service'

// ==================== QUERY KEYS ====================

export const superligaQueryKeys = {
  all: ['superliga'] as const,
  
  campeonato: (id: number) => [...superligaQueryKeys.all, 'campeonato', id] as const,
  bracket: (id: number) => [...superligaQueryKeys.campeonato(id), 'bracket'] as const,
  status: (id: number) => [...superligaQueryKeys.campeonato(id), 'status'] as const,
  
  conferencias: (id: number) => [...superligaQueryKeys.campeonato(id), 'conferencias'] as const,
  conferencia: (id: number, conf: TipoConferencia) => 
    [...superligaQueryKeys.conferencias(id), conf] as const,
    
  playoffs: (id: number) => [...superligaQueryKeys.campeonato(id), 'playoffs'] as const,
  playoffConferencia: (id: number, conf: TipoConferencia) => 
    [...superligaQueryKeys.playoffs(id), conf] as const,
    
  classificacao: (id: number) => [...superligaQueryKeys.campeonato(id), 'classificacao'] as const,
  classificacaoConferencia: (id: number, conf: TipoConferencia) =>
    [...superligaQueryKeys.classificacao(id), conf] as const,
  classificacaoRegional: (id: number, reg: TipoRegional) =>
    [...superligaQueryKeys.classificacao(id), 'regional', reg] as const,
    
  finalNacional: (id: number) => [...superligaQueryKeys.campeonato(id), 'final'] as const,
}

// ==================== HOOKS DE CRIAÇÃO ====================

export function useCriarSuperliga() {
  const queryClient = useQueryClient()
  const notifications = useNotifications()

  return useMutation({
    mutationFn: (temporada: string) => SuperligaService.criarSuperliga(temporada),
    onSuccess: (campeonato) => {
      queryClient.invalidateQueries({ queryKey: ['campeonatos'] })
      notifications.success(
        'Superliga criada!', 
        `Superliga ${campeonato.temporada} foi criada com sucesso`
      )
    },
    onError: (error: any) => {
      notifications.error('Erro ao criar Superliga', error.message)
    },
  })
}

export function useConfigurarConferencias() {
  const queryClient = useQueryClient()
  const notifications = useNotifications()

  return useMutation({
    mutationFn: ({ campeonatoId, config }: { campeonatoId: number; config: ConferenciaConfig[] }) =>
      SuperligaService.configurarConferencias(campeonatoId, config),
    onSuccess: (_, { campeonatoId }) => {
      queryClient.invalidateQueries({ 
        queryKey: superligaQueryKeys.conferencias(campeonatoId) 
      })
      notifications.success('Conferências configuradas!', 'Estrutura da Superliga definida')
    },
    onError: (error: any) => {
      notifications.error('Erro ao configurar conferências', error.message)
    },
  })
}

export function useDistribuirTimes() {
  const queryClient = useQueryClient()
  const notifications = useNotifications()

  return useMutation({
    mutationFn: (campeonatoId: number) => 
      SuperligaService.distribuirTimesAutomaticamente(campeonatoId),
    onSuccess: (_, campeonatoId) => {
      queryClient.invalidateQueries({ 
        queryKey: superligaQueryKeys.campeonato(campeonatoId) 
      })
      notifications.success('Times distribuídos!', 'Times foram organizados nas conferências')
    },
    onError: (error: any) => {
      notifications.error('Erro ao distribuir times', error.message)
    },
  })
}

// ==================== HOOKS DE TEMPORADA REGULAR ====================

export function useGerarJogosTemporadaRegular() {
  const queryClient = useQueryClient()
  const notifications = useNotifications()

  return useMutation({
    mutationFn: (campeonatoId: number) =>
      SuperligaService.gerarJogosTemporadaRegular(campeonatoId),
    onSuccess: (_, campeonatoId) => {
      queryClient.invalidateQueries({ queryKey: ['jogos'] })
      queryClient.invalidateQueries({ 
        queryKey: superligaQueryKeys.campeonato(campeonatoId) 
      })
      notifications.success('Jogos gerados!', 'Temporada regular criada com 4 rodadas')
    },
    onError: (error: any) => {
      notifications.error('Erro ao gerar jogos', error.message)
    },
  })
}

export function useFinalizarTemporadaRegular() {
  const queryClient = useQueryClient()
  const notifications = useNotifications()

  return useMutation({
    mutationFn: (campeonatoId: number) =>
      SuperligaService.finalizarTemporadaRegular(campeonatoId),
    onSuccess: (_, campeonatoId) => {
      queryClient.invalidateQueries({ 
        queryKey: superligaQueryKeys.status(campeonatoId) 
      })
      queryClient.invalidateQueries({ 
        queryKey: superligaQueryKeys.classificacao(campeonatoId) 
      })
      notifications.success('Temporada regular finalizada!', 'Playoffs podem ser gerados')
    },
    onError: (error: any) => {
      notifications.error('Erro ao finalizar temporada', error.message)
    },
  })
}

// ==================== HOOKS DE PLAYOFFS ====================

export function useGerarPlayoffs() {
  const queryClient = useQueryClient()
  const notifications = useNotifications()

  return useMutation({
    mutationFn: (campeonatoId: number) => SuperligaService.gerarPlayoffs(campeonatoId),
    onSuccess: (bracket, campeonatoId) => {
      queryClient.setQueryData(superligaQueryKeys.bracket(campeonatoId), bracket)
      queryClient.invalidateQueries({ 
        queryKey: superligaQueryKeys.playoffs(campeonatoId) 
      })
      notifications.success('Playoffs gerados!', 'Chaveamento criado para todas as conferências')
    },
    onError: (error: any) => {
      notifications.error('Erro ao gerar playoffs', error.message)
    },
  })
}

export function usePlayoffBracket(campeonatoId: number) {
  return useQuery({
    queryKey: superligaQueryKeys.bracket(campeonatoId),
    queryFn: () => SuperligaService.getPlayoffBracket(campeonatoId),
    enabled: !!campeonatoId,
    staleTime: 1000 * 60 * 2, // 2 minutos
    retry: 2,
  })
}

export function usePlayoffConferencia(campeonatoId: number, conferencia: TipoConferencia) {
  return useQuery({
    queryKey: superligaQueryKeys.playoffConferencia(campeonatoId, conferencia),
    queryFn: () => SuperligaService.getPlayoffConferencia(campeonatoId, conferencia),
    enabled: !!campeonatoId && !!conferencia,
    staleTime: 1000 * 60 * 2,
    retry: 2,
  })
}

// ==================== HOOKS DE CLASSIFICAÇÃO ====================

export function useClassificacaoConferencia(campeonatoId: number, conferencia: TipoConferencia) {
  return useQuery({
    queryKey: superligaQueryKeys.classificacaoConferencia(campeonatoId, conferencia),
    queryFn: () => SuperligaService.getClassificacaoConferencia(campeonatoId, conferencia),
    enabled: !!campeonatoId && !!conferencia,
    staleTime: 1000 * 60 * 5,
  })
}

export function useClassificacaoRegional(campeonatoId: number, regional: TipoRegional) {
  return useQuery({
    queryKey: superligaQueryKeys.classificacaoRegional(campeonatoId, regional),
    queryFn: () => SuperligaService.getClassificacaoRegional(campeonatoId, regional),
    enabled: !!campeonatoId && !!regional,
    staleTime: 1000 * 60 * 5,
  })
}

export function useTimesClassificados(campeonatoId: number) {
  return useQuery({
    queryKey: [...superligaQueryKeys.campeonato(campeonatoId), 'classificados'],
    queryFn: () => SuperligaService.getTimesClassificadosParaPlayoffs(campeonatoId),
    enabled: !!campeonatoId,
    staleTime: 1000 * 60 * 3,
  })
}

// ==================== HOOKS DE RESULTADOS ====================

export function useAtualizarResultadoPlayoff() {
  const queryClient = useQueryClient()
  const notifications = useNotifications()

  return useMutation({
    mutationFn: ({ jogoId, placarTime1, placarTime2 }: {
      jogoId: number
      placarTime1: number
      placarTime2: number
    }) => SuperligaService.atualizarResultadoPlayoff(jogoId, placarTime1, placarTime2),
    onSuccess: () => {
      // Invalidar brackets e classificações
      queryClient.invalidateQueries({ queryKey: superligaQueryKeys.all })
      notifications.success('Resultado atualizado!', 'Chaveamento foi atualizado')
    },
    onError: (error: any) => {
      notifications.error('Erro ao atualizar resultado', error.message)
    },
  })
}

export function useFinalizarJogoPlayoff() {
  const queryClient = useQueryClient()
  const notifications = useNotifications()

  return useMutation({
    mutationFn: (jogoId: number) => SuperligaService.finalizarJogoPlayoff(jogoId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: superligaQueryKeys.all })
      notifications.success('Jogo finalizado!', 'Próxima fase pode ser disputada')
    },
    onError: (error: any) => {
      notifications.error('Erro ao finalizar jogo', error.message)
    },
  })
}

// ==================== HOOKS DE FASE NACIONAL ====================

export function useGerarSemifinaisNacionais() {
  const queryClient = useQueryClient()
  const notifications = useNotifications()

  return useMutation({
    mutationFn: (campeonatoId: number) => 
      SuperligaService.gerarSemifinaisNacionais(campeonatoId),
    onSuccess: (_, campeonatoId) => {
      queryClient.invalidateQueries({ 
        queryKey: superligaQueryKeys.campeonato(campeonatoId) 
      })
      notifications.success('Semifinais nacionais geradas!', 'Sul × Sudeste e Nordeste × Centro-Norte')
    },
    onError: (error: any) => {
      notifications.error('Erro ao gerar semifinais nacionais', error.message)
    },
  })
}

export function useGerarFinalNacional() {
  const queryClient = useQueryClient()
  const notifications = useNotifications()

  return useMutation({
    mutationFn: (campeonatoId: number) => SuperligaService.gerarFinalNacional(campeonatoId),
    onSuccess: (_, campeonatoId) => {
      queryClient.invalidateQueries({ 
        queryKey: superligaQueryKeys.finalNacional(campeonatoId) 
      })
      notifications.success('Final nacional gerada!', 'Grande Decisão Nacional criada')
    },
    onError: (error: any) => {
      notifications.error('Erro ao gerar final nacional', error.message)
    },
  })
}

export function useFinalNacional(campeonatoId: number) {
  return useQuery({
    queryKey: superligaQueryKeys.finalNacional(campeonatoId),
    queryFn: () => SuperligaService.getFinalNacional(campeonatoId),
    enabled: !!campeonatoId,
    staleTime: 1000 * 60 * 5,
  })
}

// ==================== HOOKS UTILITÁRIOS ====================

export function useStatusSuperliga(campeonatoId: number) {
  return useQuery({
    queryKey: superligaQueryKeys.status(campeonatoId),
    queryFn: () => SuperligaService.getStatusSuperliga(campeonatoId),
    enabled: !!campeonatoId,
    staleTime: 1000 * 30, // 30 segundos - status muda frequentemente
    refetchInterval: 1000 * 60, // Refetch a cada minuto
  })
}

export function useValidarEstrutura(campeonatoId: number) {
  return useQuery({
    queryKey: [...superligaQueryKeys.campeonato(campeonatoId), 'validacao'],
    queryFn: () => SuperligaService.validarEstruturaSuperliga(campeonatoId),
    enabled: !!campeonatoId,
    staleTime: 1000 * 60 * 2,
  })
}

export function useResetarPlayoffs() {
  const queryClient = useQueryClient()
  const notifications = useNotifications()

  return useMutation({
    mutationFn: (campeonatoId: number) => SuperligaService.resetarPlayoffs(campeonatoId),
    onSuccess: (_, campeonatoId) => {
      queryClient.invalidateQueries({ 
        queryKey: superligaQueryKeys.campeonato(campeonatoId) 
      })
      notifications.success('Playoffs resetados!', 'Chaveamento foi limpo')
    },
    onError: (error: any) => {
      notifications.error('Erro ao resetar playoffs', error.message)
    },
  })
}

export function useSimularPlayoffs() {
  const queryClient = useQueryClient()
  const notifications = useNotifications()

  return useMutation({
    mutationFn: (campeonatoId: number) => SuperligaService.simularPlayoffs(campeonatoId),
    onSuccess: (bracket, campeonatoId) => {
      queryClient.setQueryData(superligaQueryKeys.bracket(campeonatoId), bracket)
      notifications.success('Playoffs simulados!', 'Resultados fictícios gerados para teste')
    },
    onError: (error: any) => {
      notifications.error('Erro ao simular playoffs', error.message)
    },
  })
}

export function useEstatisticasSuperliga(campeonatoId: number) {
  return useQuery({
    queryKey: [...superligaQueryKeys.campeonato(campeonatoId), 'estatisticas'],
    queryFn: () => SuperligaService.getEstatisticasSuperliga(campeonatoId),
    enabled: !!campeonatoId,
    staleTime: 1000 * 60 * 10, // 10 minutos
  })
}