import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNotifications } from './useNotifications'
import { useCampeonatos } from './useCampeonatos'
import { ConferenciaConfig, TipoConferencia, TipoRegional } from '@/types'
import { SuperligaService } from '@/services/superliga.service'
import { queryKeys } from './queryKeys'

// ==================== QUERY KEYS ====================

export const superligaQueryKeys = {
  all: ['superliga'] as const,
  
  campeonato: (id: number) => [...superligaQueryKeys.all, 'campeonato', id] as const,
  status: (id: number) => [...superligaQueryKeys.campeonato(id), 'status'] as const,
  bracket: (id: number) => [...superligaQueryKeys.campeonato(id), 'bracket'] as const,
  
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
    
  jogos: (id: number) => [...superligaQueryKeys.campeonato(id), 'jogos'] as const,
  estatisticas: (id: number) => [...superligaQueryKeys.campeonato(id), 'estatisticas'] as const,
  finalNacional: (id: number) => [...superligaQueryKeys.campeonato(id), 'final'] as const,
}

// ==================== MUTATIONS - CRIAÇÃO E CONFIGURAÇÃO ====================

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
      notifications.success('Conferências configuradas!', 'Estrutura da Superliga foi criada')
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
      notifications.success('Times distribuídos!', 'Distribuição automática concluída com sucesso')
    },
    onError: (error: any) => {
      notifications.error('Erro ao distribuir times', error.message)
    },
  })
}

export function useDistribuirTimesManual() {
  const queryClient = useQueryClient()
  const notifications = useNotifications()

  return useMutation({
    mutationFn: ({ campeonatoId, distribuicao }: { 
      campeonatoId: number; 
      distribuicao: Record<TipoRegional, number[]> 
    }) => SuperligaService.distribuirTimes(campeonatoId, distribuicao),
    onSuccess: (_, { campeonatoId }) => {
      queryClient.invalidateQueries({ 
        queryKey: superligaQueryKeys.campeonato(campeonatoId) 
      })
      notifications.success('Times distribuídos!', 'Distribuição manual concluída')
    },
    onError: (error: any) => {
      notifications.error('Erro ao distribuir times', error.message)
    },
  })
}

// ==================== MUTATIONS - GERAÇÃO DE JOGOS ====================

export function useGerarJogosTemporadaRegular() {
  const queryClient = useQueryClient()
  const notifications = useNotifications()

  return useMutation({
    mutationFn: ({ campeonatoId, rodadas }: { campeonatoId: number; rodadas?: number }) =>
      SuperligaService.gerarJogosTemporada(campeonatoId, rodadas),
    onSuccess: (_, { campeonatoId }) => {
      queryClient.invalidateQueries({ 
        queryKey: superligaQueryKeys.jogos(campeonatoId) 
      })
      notifications.success('Jogos gerados!', 'Temporada regular foi criada')
    },
    onError: (error: any) => {
      notifications.error('Erro ao gerar jogos', error.message)
    },
  })
}

export function useGerarPlayoffs() {
  const queryClient = useQueryClient()
  const notifications = useNotifications()

  return useMutation({
    mutationFn: (campeonatoId: number) => SuperligaService.gerarPlayoffs(campeonatoId),
    onSuccess: (_, campeonatoId) => {
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

export function useGerarFaseNacional() {
  const queryClient = useQueryClient()
  const notifications = useNotifications()

  return useMutation({
    mutationFn: (campeonatoId: number) => SuperligaService.gerarFaseNacional(campeonatoId),
    onSuccess: (_, campeonatoId) => {
      queryClient.invalidateQueries({ 
        queryKey: superligaQueryKeys.finalNacional(campeonatoId) 
      })
      notifications.success('Fase nacional gerada!', 'Semifinais e final nacional criadas')
    },
    onError: (error: any) => {
      notifications.error('Erro ao gerar fase nacional', error.message)
    },
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

// ==================== MUTATIONS - JOGOS DOS PLAYOFFS ====================

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
      notifications.success('Jogo finalizado!', 'Resultado foi registrado')
    },
    onError: (error: any) => {
      notifications.error('Erro ao finalizar jogo', error.message)
    },
  })
}

// ==================== MUTATIONS - SIMULAÇÃO ====================

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

export function useGerarTemporadaCompleta() {
  const queryClient = useQueryClient()
  const notifications = useNotifications()

  return useMutation({
    mutationFn: ({ campeonatoId, configuracao }: { 
      campeonatoId: number; 
      configuracao: {
        rodadas?: number
        incluirPlayoffs?: boolean
        incluirFaseNacional?: boolean
      }
    }) => SuperligaService.gerarTemporadaCompleta(campeonatoId, configuracao),
    onSuccess: (_, { campeonatoId }) => {
      queryClient.invalidateQueries({ 
        queryKey: superligaQueryKeys.campeonato(campeonatoId) 
      })
      notifications.success('Temporada completa gerada!', 'Todos os jogos foram criados')
    },
    onError: (error: any) => {
      notifications.error('Erro ao gerar temporada', error.message)
    },
  })
}

// ==================== QUERIES - INFORMAÇÕES GERAIS ====================

export function useSuperligaInfo(campeonatoId: number) {
  return useQuery({
    queryKey: superligaQueryKeys.campeonato(campeonatoId),
    queryFn: () => SuperligaService.getSuperliga(campeonatoId),
    enabled: !!campeonatoId,
    staleTime: 1000 * 60 * 5,
    retry: 2,
  })
}

export function useStatusSuperliga(campeonatoId: number) {
  return useQuery({
    queryKey: superligaQueryKeys.status(campeonatoId),
    queryFn: () => SuperligaService.getStatusSuperliga(campeonatoId),
    enabled: !!campeonatoId,
    staleTime: 1000 * 30,
    refetchInterval: 1000 * 60, 
  })
}

export function useConferencias(campeonatoId: number) {
  return useQuery({
    queryKey: superligaQueryKeys.conferencias(campeonatoId),
    queryFn: () => SuperligaService.getConferencias(campeonatoId),
    enabled: !!campeonatoId,
    staleTime: 1000 * 60 * 10, 
    retry: 2,
  })
}

export function useTimesPorConferencia(campeonatoId: number) {
  return useQuery({
    queryKey: [...superligaQueryKeys.conferencias(campeonatoId), 'times'],
    queryFn: () => SuperligaService.getTimesPorConferencia(campeonatoId),
    enabled: !!campeonatoId,
    staleTime: 1000 * 60 * 10,
    retry: 2,
  })
}

// ==================== QUERIES - CLASSIFICAÇÕES ====================

export function useClassificacaoGeral(campeonatoId: number) {
  return useQuery({
    queryKey: [...superligaQueryKeys.classificacao(campeonatoId), 'geral'],
    queryFn: () => SuperligaService.getClassificacaoGeral(campeonatoId),
    enabled: !!campeonatoId,
    staleTime: 1000 * 60 * 5,
    retry: 2,
  })
}

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

export function useRankingGeral(campeonatoId: number) {
  return useQuery({
    queryKey: [...superligaQueryKeys.classificacao(campeonatoId), 'ranking'],
    queryFn: () => SuperligaService.getRankingGeral(campeonatoId),
    enabled: !!campeonatoId,
    staleTime: 1000 * 60 * 5, 
    retry: 2,
  })
}

export function useWildCardRanking(campeonatoId: number, conferencia: TipoConferencia) {
  return useQuery({
    queryKey: [...superligaQueryKeys.classificacao(campeonatoId), 'wildcard', conferencia],
    queryFn: () => SuperligaService.getWildCardRanking(campeonatoId, conferencia),
    enabled: !!campeonatoId && !!conferencia,
    staleTime: 1000 * 60 * 3,
  })
}

// ==================== QUERIES - PLAYOFFS ====================

export function usePlayoffBracket(campeonatoId: number) {
  return useQuery({
    queryKey: superligaQueryKeys.bracket(campeonatoId),
    queryFn: () => SuperligaService.getPlayoffBracket(campeonatoId),
    enabled: !!campeonatoId,
    staleTime: 1000 * 60 * 2, 
    retry: 2,
  })
}

export function usePlayoffConferencia(campeonatoId: number, conferencia: TipoConferencia) {
  return useQuery({
    queryKey: superligaQueryKeys.playoffConferencia(campeonatoId, conferencia),
    queryFn: () => SuperligaService.getPlayoffsConferencia(campeonatoId, conferencia),
    enabled: !!campeonatoId && !!conferencia,
    staleTime: 1000 * 60 * 2,
    retry: 2,
  })
}

export function useFaseNacional(campeonatoId: number) {
  return useQuery({
    queryKey: superligaQueryKeys.finalNacional(campeonatoId),
    queryFn: () => SuperligaService.getFaseNacional(campeonatoId),
    enabled: !!campeonatoId,
    staleTime: 1000 * 60 * 2,
    retry: 2,
  })
}

// ==================== QUERIES - JOGOS ====================

export function useJogosSuperliga(
  campeonatoId: number, 
  filters?: {
    conferencia?: string
    fase?: string
    rodada?: number
    status?: string
  }
) {
  return useQuery({
    queryKey: [...superligaQueryKeys.jogos(campeonatoId), filters],
    queryFn: () => SuperligaService.getJogosSuperliga(campeonatoId, filters),
    enabled: !!campeonatoId,
    staleTime: 1000 * 60 * 2, 
    retry: 2,
  })
}

export function useProximosJogosSuperliga(campeonatoId: number, limite?: number) {
  return useQuery({
    queryKey: [...superligaQueryKeys.jogos(campeonatoId), 'proximos', limite],
    queryFn: () => SuperligaService.getProximosJogosSuperliga(campeonatoId, limite),
    enabled: !!campeonatoId,
    staleTime: 1000 * 60 * 1, 
    retry: 2,
  })
}

export function useUltimosResultadosSuperliga(campeonatoId: number, limite?: number) {
  return useQuery({
    queryKey: [...superligaQueryKeys.jogos(campeonatoId), 'resultados', limite],
    queryFn: () => SuperligaService.getUltimosResultadosSuperliga(campeonatoId, limite),
    enabled: !!campeonatoId,
    staleTime: 1000 * 60 * 3, 
    retry: 2,
  })
}

// ==================== QUERIES - ESTATÍSTICAS ====================

export function useEstatisticasSuperliga(campeonatoId: number) {
  return useQuery({
    queryKey: superligaQueryKeys.estatisticas(campeonatoId),
    queryFn: () => SuperligaService.getEstatisticasSuperliga(campeonatoId),
    enabled: !!campeonatoId,
    staleTime: 1000 * 60 * 10, 
  })
}

export function useHistoricoSuperliga(temporadas: string[]) {
  return useQuery({
    queryKey: [...superligaQueryKeys.all, 'historico', temporadas],
    queryFn: () => SuperligaService.getHistoricoSuperliga(temporadas),
    enabled: temporadas.length > 0,
    staleTime: 1000 * 60 * 60, 
    retry: 2,
  })
}

export function usePrevisoes(campeonatoId: number) {
  return useQuery({
    queryKey: [...superligaQueryKeys.campeonato(campeonatoId), 'previsoes'],
    queryFn: () => SuperligaService.getPrevisoes(campeonatoId),
    enabled: !!campeonatoId,
    staleTime: 1000 * 60 * 30,
    retry: 2,
  })
}

// ==================== QUERIES - VALIDAÇÃO ====================

export function useValidarEstruturaSuperliga(campeonatoId: number) {
  return useQuery({
    queryKey: [...superligaQueryKeys.campeonato(campeonatoId), 'validar-estrutura'],
    queryFn: () => SuperligaService.validarEstruturaSuperliga(campeonatoId),
    enabled: !!campeonatoId,
    staleTime: 1000 * 60 * 2, 
    retry: 2,
  })
}

export function useValidarEstrutura(campeonatoId: number) {
  return useQuery({
    queryKey: [...superligaQueryKeys.campeonato(campeonatoId), 'validacao'],
    queryFn: () => SuperligaService.validarEstrutura(campeonatoId),
    enabled: !!campeonatoId,
    staleTime: 1000 * 60 * 2,
  })
}

export function useValidarIntegridade(campeonatoId: number) {
  return useQuery({
    queryKey: [...superligaQueryKeys.campeonato(campeonatoId), 'integridade'],
    queryFn: () => SuperligaService.validarIntegridade(campeonatoId),
    enabled: !!campeonatoId,
    staleTime: 1000 * 60 * 2,
  })
}

export function useRepararIntegridade() {
  const queryClient = useQueryClient()
  const notifications = useNotifications()

  return useMutation({
    mutationFn: (campeonatoId: number) => SuperligaService.repararIntegridade(campeonatoId),
    onSuccess: (_, campeonatoId) => {
      queryClient.invalidateQueries({ 
        queryKey: superligaQueryKeys.campeonato(campeonatoId) 
      })
      notifications.success('Integridade reparada!', 'Estrutura foi corrigida')
    },
    onError: (error: any) => {
      notifications.error('Erro ao reparar integridade', error.message)
    },
  })
}

// ==================== HOOKS COMPOSTOS - PARA PÁGINAS ESPECÍFICAS ====================

// Hook para página principal da Superliga por temporada
export function useSuperligaPorTemporada(temporada: string) {
  const { data: campeonatos = [] } = useCampeonatos({
    temporada,
    isSuperliga: true
  })
  
  const superligaId = campeonatos[0]?.id

  const superligaInfo = useSuperligaInfo(superligaId || 0)
  const status = useStatusSuperliga(superligaId || 0)
  const conferencias = useConferencias(superligaId || 0)
  const classificacao = useClassificacaoGeral(superligaId || 0)
  const jogos = useJogosSuperliga(superligaId || 0)

  return {
    superliga: campeonatos[0],
    superligaId,
    isLoading: superligaInfo.isLoading,
    info: superligaInfo.data,
    status: status.data,
    conferencias: conferencias.data,
    classificacao: classificacao.data,
    jogos: jogos.data,
    refetch: () => {
      superligaInfo.refetch()
      status.refetch()
      conferencias.refetch()
      classificacao.refetch()
      jogos.refetch()
    }
  }
}

// Hook para página de playoffs da Superliga
export function usePlayoffsSuperliga(campeonatoId: number) {
  const bracket = usePlayoffBracket(campeonatoId)
  const faseNacional = useFaseNacional(campeonatoId)
  const estatisticas = useEstatisticasSuperliga(campeonatoId)

  return {
    isLoading: bracket.isLoading || faseNacional.isLoading,
    bracket: bracket.data,
    faseNacional: faseNacional.data,
    estatisticas: estatisticas.data,
    refetch: () => {
      bracket.refetch()
      faseNacional.refetch()
      estatisticas.refetch()
    }
  }
}

// Hook para página de administração da Superliga
export function useAdminSuperliga(campeonatoId: number) {
  const info = useSuperligaInfo(campeonatoId)
  const status = useStatusSuperliga(campeonatoId)
  const validacao = useValidarEstruturaSuperliga(campeonatoId)
  const conferencias = useConferencias(campeonatoId)
  const timesPorConferencia = useTimesPorConferencia(campeonatoId)

  return {
    isLoading: info.isLoading,
    superliga: info.data,
    status: status.data,
    validacao: validacao.data,
    conferencias: conferencias.data,
    timesPorConferencia: timesPorConferencia.data,
    refetch: () => {
      info.refetch()
      status.refetch()
      validacao.refetch()
      conferencias.refetch()
      timesPorConferencia.refetch()
    }
  }
}

// ==================== HOOKS PARA FRONTEND DE EXIBIÇÃO ====================

export function useSuperligaFinal(temporada: string) {
  const { data: campeonatos = [] } = useCampeonatos({
    temporada,
    isSuperliga: true
  })
  
  const superligaId = campeonatos[0]?.id

  return useQuery({
    queryKey: ['superliga', temporada, 'final'],
    queryFn: () => SuperligaService.getFaseNacional(superligaId), 
    enabled: !!superligaId,
    staleTime: 1000 * 60 * 5,
  })
}

export function usePlayoffBracketPorTemporada(temporada: string) {
  const { data: campeonatos = [] } = useCampeonatos({
    temporada,
    isSuperliga: true
  })
  
  const superligaId = campeonatos[0]?.id

  return useQuery({
    queryKey: ['superliga', temporada, 'brackets'],
    queryFn: () => SuperligaService.getBracketPlayoffs(superligaId), 
    enabled: !!superligaId,
    staleTime: 1000 * 60 * 2,
  })
}

// ==================== HOOKS DE SIMULAÇÃO PARA DESENVOLVIMENTO ====================

export function useSimularTemporadaCompleta() {
  const queryClient = useQueryClient()
  const notifications = useNotifications()

  return useMutation({
    mutationFn: (campeonatoId: number) => SuperligaService.simularTemporadaCompleta(campeonatoId),
    onSuccess: (_, campeonatoId) => {
      queryClient.invalidateQueries({ 
        queryKey: superligaQueryKeys.campeonato(campeonatoId) 
      })
      notifications.success('Temporada simulada!', 'Resultados fictícios gerados para toda a temporada')
    },
    onError: (error: any) => {
      notifications.error('Erro ao simular temporada', error.message)
    },
  })
}

// ==================== HOOKS UTILITÁRIOS ====================

export function useTimesClassificados(campeonatoId: number) {
  return useQuery({
    queryKey: [...superligaQueryKeys.campeonato(campeonatoId), 'classificados'],
    queryFn: () => SuperligaService.getTimesPorConferencia(campeonatoId),
    enabled: !!campeonatoId,
    staleTime: 1000 * 60 * 3,
    select: (data) => {
      // Processar dados para retornar apenas times classificados para playoffs
      return data?.filter((time: any) => time.classificado === true) || []
    }
  })
}

export function useStatusTemporadaRegular(campeonatoId: number) {
  const jogos = useJogosSuperliga(campeonatoId, { fase: 'TEMPORADA_REGULAR' })
  const status = useStatusSuperliga(campeonatoId)

  return useQuery({
    queryKey: [...superligaQueryKeys.campeonato(campeonatoId), 'status-temporada-regular'],
    queryFn: () => ({
      total: jogos.data?.length || 0,
      finalizados: jogos.data?.filter((j: any) => j.status === 'FINALIZADO').length || 0,
      porcentagem: jogos.data?.length 
        ? Math.round((jogos.data.filter((j: any) => j.status === 'FINALIZADO').length / jogos.data.length) * 100)
        : 0,
      fase: status.data?.fase || 'CONFIGURACAO',
      podeGerarPlayoffs: jogos.data?.every((j: any) => j.status === 'FINALIZADO') || false
    }),
    enabled: !!campeonatoId && !!jogos.data,
    staleTime: 1000 * 60 * 1,
  })
}