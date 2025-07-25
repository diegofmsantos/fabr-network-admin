import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNotifications } from './useNotifications'
import { SuperligaService } from '@/services/superliga.service'

export const superligaQueryKeys = {
  all: ['superliga'] as const,
  
  temporada: (temporada: string) => [...superligaQueryKeys.all, temporada] as const,
  status: (temporada: string) => [...superligaQueryKeys.temporada(temporada), 'status'] as const,
  conferencias: (temporada: string) => [...superligaQueryKeys.temporada(temporada), 'conferencias'] as const,
  regionais: (temporada: string) => [...superligaQueryKeys.temporada(temporada), 'regionais'] as const,
  times: (temporada: string) => [...superligaQueryKeys.temporada(temporada), 'times'] as const,
  jogos: (temporada: string) => [...superligaQueryKeys.temporada(temporada), 'jogos'] as const,
  classificacao: (temporada: string) => [...superligaQueryKeys.temporada(temporada), 'classificacao'] as const,
  bracket: (temporada: string) => [...superligaQueryKeys.temporada(temporada), 'bracket'] as const,
  validacao: (temporada: string) => [...superligaQueryKeys.temporada(temporada), 'validacao'] as const,
  
  jogosRodada: (temporada: string, rodada: number) => 
    [...superligaQueryKeys.jogos(temporada), 'rodada', rodada] as const,
  classificacaoConferencia: (temporada: string, conferencia: string) => 
    [...superligaQueryKeys.classificacao(temporada), 'conferencia', conferencia] as const,
}

export function useSuperliga(temporada: string) {
  return useQuery({
    queryKey: superligaQueryKeys.temporada(temporada),
    queryFn: () => SuperligaService.getSuperliga(temporada),
    enabled: !!temporada,
    staleTime: 1000 * 60 * 5, 
    retry: 2,
  })
}

export function useStatusSuperliga(temporada: string) {
  return useQuery({
    queryKey: superligaQueryKeys.status(temporada),
    queryFn: () => SuperligaService.getStatus(temporada),
    enabled: !!temporada,
    staleTime: 1000 * 30, 
    refetchInterval: 1000 * 60, 
  })
}

export function useConferencias(temporada: string) {
  return useQuery({
    queryKey: superligaQueryKeys.conferencias(temporada),
    queryFn: () => SuperligaService.getConferencias(temporada),
    enabled: !!temporada,
    staleTime: 1000 * 60 * 10, 
  })
}

export function useRegionais(temporada: string, conferencia?: string) {
  return useQuery({
    queryKey: [...superligaQueryKeys.regionais(temporada), conferencia],
    queryFn: () => SuperligaService.getRegionais(temporada, conferencia),
    enabled: !!temporada,
    staleTime: 1000 * 60 * 10,
  })
}

export function useTimesPorConferencia(temporada: string) {
  return useQuery({
    queryKey: [...superligaQueryKeys.times(temporada), 'por-conferencia'],
    queryFn: () => SuperligaService.getTimesPorConferencia(temporada),
    enabled: !!temporada,
    staleTime: 1000 * 60 * 5,
  })
}

export function useJogosSuperliga(temporada: string, filters?: {
  conferencia?: string
  fase?: string
  rodada?: number
  status?: string
}) {
  return useQuery({
    queryKey: [...superligaQueryKeys.jogos(temporada), filters],
    queryFn: () => SuperligaService.getJogos(temporada, filters),
    enabled: !!temporada,
    staleTime: 1000 * 60 * 2,
  })
}

export function useJogosPorRodada(temporada: string, rodada: number) {
  return useQuery({
    queryKey: superligaQueryKeys.jogosRodada(temporada, rodada),
    queryFn: () => SuperligaService.getJogosPorRodada(temporada, rodada),
    enabled: !!temporada && !!rodada,
    staleTime: 1000 * 60 * 3,
  })
}

export function useProximosJogos(temporada: string, limite?: number) {
  return useQuery({
    queryKey: [...superligaQueryKeys.jogos(temporada), 'proximos', limite],
    queryFn: () => SuperligaService.getProximosJogos(temporada, limite),
    enabled: !!temporada,
    staleTime: 1000 * 60 * 1, 
  })
}

export function useClassificacaoGeral(temporada: string) {
  return useQuery({
    queryKey: [...superligaQueryKeys.classificacao(temporada), 'geral'],
    queryFn: () => SuperligaService.getClassificacaoGeral(temporada),
    enabled: !!temporada,
    staleTime: 1000 * 60 * 5,
  })
}

export function useClassificacaoConferencia(temporada: string, conferencia: string) {
  return useQuery({
    queryKey: superligaQueryKeys.classificacaoConferencia(temporada, conferencia),
    queryFn: () => SuperligaService.getClassificacaoConferencia(temporada, conferencia),
    enabled: !!temporada && !!conferencia,
    staleTime: 1000 * 60 * 5,
  })
}

export function useWildCardRanking(temporada: string, conferencia: string) {
  return useQuery({
    queryKey: [...superligaQueryKeys.classificacao(temporada), 'wildcard', conferencia],
    queryFn: () => SuperligaService.getWildCardRanking(temporada, conferencia),
    enabled: !!temporada && !!conferencia,
    staleTime: 1000 * 60 * 3,
  })
}

export function usePlayoffBracket(temporada: string) {
  return useQuery({
    queryKey: superligaQueryKeys.bracket(temporada),
    queryFn: () => SuperligaService.getBracket(temporada),
    enabled: !!temporada,
    staleTime: 1000 * 60 * 2,
  })
}

export function useFaseNacional(temporada: string) {
  return useQuery({
    queryKey: [...superligaQueryKeys.bracket(temporada), 'nacional'],
    queryFn: () => SuperligaService.getFaseNacional(temporada),
    enabled: !!temporada,
    staleTime: 1000 * 60 * 2,
  })
}

export function useValidarEstrutura(temporada: string) {
  return useQuery({
    queryKey: [...superligaQueryKeys.validacao(temporada), 'estrutura'],
    queryFn: () => SuperligaService.validarEstrutura(temporada),
    enabled: !!temporada,
    staleTime: 1000 * 60 * 2,
  })
}

export function useValidarIntegridade(temporada: string) {
  return useQuery({
    queryKey: [...superligaQueryKeys.validacao(temporada), 'integridade'],
    queryFn: () => SuperligaService.validarIntegridade(temporada),
    enabled: !!temporada,
    staleTime: 1000 * 60 * 2,
  })
}

export function useCriarSuperliga() {
  const queryClient = useQueryClient()
  const notifications = useNotifications()

  return useMutation({
    mutationFn: (temporada: string) => SuperligaService.criarSuperliga(temporada),
    onSuccess: (data: any, temporada: string) => {
      queryClient.invalidateQueries({ queryKey: superligaQueryKeys.all })
      notifications.success('Superliga criada!', `Superliga ${temporada} criada com sucesso`)
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
    mutationFn: (temporada: string) => SuperligaService.configurarConferencias(temporada),
    onSuccess: (_, temporada) => {
      queryClient.invalidateQueries({ queryKey: superligaQueryKeys.temporada(temporada) })
      notifications.success('Conferências configuradas!', 'Estrutura da Superliga criada')
    },
    onError: (error: any) => {
      notifications.error('Erro ao configurar conferências', error.message)
    },
  })
}

export function useDistribuirTimesAutomatico() {
  const queryClient = useQueryClient()
  const notifications = useNotifications()

  return useMutation({
    mutationFn: (temporada: string) => SuperligaService.distribuirTimesAutomatico(temporada),
    onSuccess: (_, temporada) => {
      queryClient.invalidateQueries({ queryKey: superligaQueryKeys.temporada(temporada) })
      notifications.success('Distribuição automática concluída!', 'Times organizados automaticamente')
    },
    onError: (error: any) => {
      notifications.error('Erro na distribuição automática', error.message)
    },
  })
}

export function useGerarJogosTemporada() {
  const queryClient = useQueryClient()
  const notifications = useNotifications()

  return useMutation({
    mutationFn: ({ temporada, config }: { temporada: string, config: { rodadas?: number } }) => 
      SuperligaService.gerarJogosTemporada(temporada, config),
    onSuccess: (_, { temporada }) => {
      queryClient.invalidateQueries({ queryKey: superligaQueryKeys.jogos(temporada) })
      notifications.success('Jogos gerados!', 'Temporada regular criada')
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
    mutationFn: (temporada: string) => SuperligaService.gerarPlayoffs(temporada),
    onSuccess: (_, temporada) => {
      queryClient.invalidateQueries({ queryKey: superligaQueryKeys.bracket(temporada) })
      notifications.success('Playoffs gerados!', 'Chaveamento criado')
    },
    onError: (error: any) => {
      notifications.error('Erro ao gerar playoffs', error.message)
    },
  })
}

export function useResetarPlayoffs() {
  const queryClient = useQueryClient()
  const notifications = useNotifications()

  return useMutation({
    mutationFn: (temporada: string) => SuperligaService.resetarPlayoffs(temporada),
    onSuccess: (_, temporada) => {
      queryClient.invalidateQueries({ queryKey: superligaQueryKeys.bracket(temporada) })
      notifications.success('Playoffs resetados!', 'Chaveamento limpo')
    },
    onError: (error: any) => {
      notifications.error('Erro ao resetar playoffs', error.message)
    },
  })
}

export function useGerarFaseNacional() {
  const queryClient = useQueryClient()
  const notifications = useNotifications()

  return useMutation({
    mutationFn: (temporada: string) => SuperligaService.gerarFaseNacional(temporada),
    onSuccess: (_, temporada) => {
      queryClient.invalidateQueries({ queryKey: superligaQueryKeys.bracket(temporada) })
      notifications.success('Fase nacional gerada!', 'Final da Superliga criada')
    },
    onError: (error: any) => {
      notifications.error('Erro ao gerar fase nacional', error.message)
    },
  })
}

export function useRepararIntegridade() {
  const queryClient = useQueryClient()
  const notifications = useNotifications()

  return useMutation({
    mutationFn: (temporada: string) => SuperligaService.repararIntegridade(temporada),
    onSuccess: (_, temporada) => {
      queryClient.invalidateQueries({ queryKey: superligaQueryKeys.temporada(temporada) })
      notifications.success('Integridade reparada!', 'Estrutura corrigida')
    },
    onError: (error: any) => {
      notifications.error('Erro ao reparar integridade', error.message)
    },
  })
}

export function useSimularTemporadaCompleta() {
  const queryClient = useQueryClient()
  const notifications = useNotifications()

  return useMutation({
    mutationFn: (temporada: string) => SuperligaService.simularTemporadaCompleta(temporada),
    onSuccess: (_, temporada) => {
      queryClient.invalidateQueries({ queryKey: superligaQueryKeys.temporada(temporada) })
      notifications.success('Temporada simulada!', 'Resultados fictícios gerados')
    },
    onError: (error: any) => {
      notifications.error('Erro ao simular temporada', error.message)
    },
  })
}

export function useAdminSuperliga(temporada: string) {
  const superliga = useSuperliga(temporada)
  const status = useStatusSuperliga(temporada)
  const conferencias = useConferencias(temporada)
  const validacao = useValidarIntegridade(temporada)
  const times = useTimesPorConferencia(temporada)

  return {
    superliga: superliga.data,
    status: status.data,
    conferencias: conferencias.data,
    validacao: validacao.data,
    times: times.data,
    isLoading: superliga.isLoading || status.isLoading || conferencias.isLoading,
    error: superliga.error || status.error || conferencias.error,
    refetch: () => {
      superliga.refetch()
      status.refetch()
      conferencias.refetch()
      validacao.refetch()
      times.refetch()
    }
  }
}

export function usePlayoffAdmin(temporada: string) {
  const bracket = usePlayoffBracket(temporada)
  const faseNacional = useFaseNacional(temporada)
  const status = useStatusSuperliga(temporada)

  return {
    bracket: bracket.data,
    faseNacional: faseNacional.data,
    status: status.data,
    isLoading: bracket.isLoading || faseNacional.isLoading || status.isLoading,
    error: bracket.error || faseNacional.error || status.error,
    refetch: () => {
      bracket.refetch()
      faseNacional.refetch()
      status.refetch()
    }
  }
}

export function useTemporadas() {
  return useQuery({
    queryKey: [...superligaQueryKeys.all, 'temporadas'],
    queryFn: () => SuperligaService.listarTemporadas(),
    staleTime: 1000 * 60 * 10, 
  })
}

export function useTemporadaAtual() {
  return useQuery({
    queryKey: [...superligaQueryKeys.all, 'atual'],
    queryFn: () => SuperligaService.getTemporadaAtual(),
    staleTime: 1000 * 60 * 30, 
  })
}

export function useClassificacaoSuperliga(temporada: string) {
  return useQuery({
    queryKey: [...superligaQueryKeys.classificacao(temporada)],
    queryFn: () => SuperligaService.getClassificacao(temporada), // ✅ ESTE USA classificacao
    enabled: !!temporada,
    staleTime: 1000 * 60 * 10,
    retry: 2,
    refetchOnWindowFocus: false,
  })
}
