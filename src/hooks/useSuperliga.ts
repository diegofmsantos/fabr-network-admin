/**
 * useSuperliga.ts — atualizado para D1/D2
 * Substitui: src/hooks/useSuperliga.ts (frontend admin)
 *
 * MUDANÇAS (mínimas):
 *  - useCriarSuperliga: mutationFn aceita { temporada, divisao }
 *  - useConfigurarConferencias: idem
 *  - useDistribuirTimesAutomatico: idem
 *  - Tudo mais permanece idêntico
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNotifications } from './useNotifications'
import { SuperligaService } from '@/services/superliga.service'
import { JogosService } from '@/services/jogos.service'

type SuperligaParams = { temporada: string; divisao?: string }

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
  jogosRodada: (temporada: string, rodada: number) =>
    [...superligaQueryKeys.jogos(temporada), 'rodada', rodada] as const,
  classificacaoConferencia: (temporada: string, conferencia: string) =>
    [...superligaQueryKeys.classificacao(temporada), 'conferencia', conferencia] as const,
}

export function useSuperliga(temporada: string, divisao: string = 'D1') {
  return useQuery({
    queryKey: [...superligaQueryKeys.temporada(temporada), divisao],
    queryFn: () => SuperligaService.getSuperliga(temporada, divisao),
    enabled: !!temporada,
    staleTime: 1000 * 60 * 5,
    retry: 2,
  })
}

export function useStatusSuperliga(temporada: string, divisao: string = 'D1') {
  return useQuery({
    queryKey: [...superligaQueryKeys.status(temporada), divisao],
    queryFn: () => SuperligaService.getStatus(temporada, divisao),
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
  divisao?: string
}) {
  const divisao = filters?.divisao || 'D1'

  return useQuery({
    queryKey: [...superligaQueryKeys.jogos(temporada), divisao, filters],
    queryFn: async () => {
      const isAdminContext = typeof window !== 'undefined' &&
        window.location.pathname.includes('/admin/')
      if (isAdminContext) {
        return JogosService.getJogos({ temporada, ...filters, divisao, isAdminContext: true })
      } else {
        return SuperligaService.getJogos(temporada, { ...filters, divisao })
      }
    },
    enabled: !!temporada,
    staleTime: 1000 * 60 * 5,
    retry: 2,
    refetchOnWindowFocus: false,
    select: (data) => Array.isArray(data) ? data : []
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

// ── Mutations atualizadas para receber { temporada, divisao } ────────────────

export function useCriarSuperliga() {
  const queryClient = useQueryClient()
  const notifications = useNotifications()

  return useMutation({
    mutationFn: ({ temporada, divisao = 'D1' }: SuperligaParams) =>
      SuperligaService.criarSuperliga({ temporada, divisao }),
    onSuccess: (_: any, { temporada, divisao = 'D1' }: SuperligaParams) => {
      queryClient.invalidateQueries({ queryKey: superligaQueryKeys.all })
      notifications.success('Superliga criada!', `Superliga ${divisao} ${temporada} criada com sucesso`)
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
    mutationFn: ({ temporada, divisao = 'D1' }: SuperligaParams) =>
      SuperligaService.configurarConferencias({ temporada, divisao }),
    onSuccess: (_: any, { temporada }: SuperligaParams) => {
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
    mutationFn: ({ temporada, divisao = 'D1' }: SuperligaParams) =>
      SuperligaService.distribuirTimesAutomatico({ temporada, divisao }),
    onSuccess: (_: any, { temporada }: SuperligaParams) => {
      queryClient.invalidateQueries({ queryKey: superligaQueryKeys.temporada(temporada) })
      notifications.success('Distribuição automática concluída!', 'Times organizados automaticamente')
    },
    onError: (error: any) => {
      notifications.error('Erro na distribuição automática', error.message)
    },
  })
}

export function useAdminSuperliga(temporada: string) {
  const superliga = useSuperliga(temporada)
  const status = useStatusSuperliga(temporada)
  const conferencias = useConferencias(temporada)
  const times = useTimesPorConferencia(temporada)

  return {
    superliga: superliga.data,
    status: status.data,
    conferencias: conferencias.data,
    times: times.data,
    isLoading: superliga.isLoading || status.isLoading || conferencias.isLoading,
    error: superliga.error || status.error || conferencias.error,
    refetch: () => {
      superliga.refetch()
      status.refetch()
      conferencias.refetch()
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

export function useClassificacaoSuperliga(temporada: string, divisao: string = 'D1') {
  return useQuery({
    queryKey: [...superligaQueryKeys.classificacao(temporada), divisao],
    queryFn: () => SuperligaService.getClassificacao(temporada, divisao),
    enabled: !!temporada,
    staleTime: 1000 * 60 * 10,
    retry: 2,
    refetchOnWindowFocus: false,
  })
}