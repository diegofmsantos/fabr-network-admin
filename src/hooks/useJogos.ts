import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { BaseService } from '@/services/base.service'
import { queryKeys } from './queryKeys'
import { useNotifications } from './useNotifications'

interface JogosFilters {
  temporada?: string
  status?: string
  fase?: string
  rodada?: number
  conferencia?: string
  limite?: number
}

interface Time {
  id: number
  nome: string
  sigla: string
  logo?: string
  cor?: string
  presidente?: string
  head_coach?: string
  estadio?: string
}

interface Campeonato {
  id: number
  nome: string
  temporada: string
  isSuperliga?: boolean
}

interface EstatisticaJogo {
  id: number
  jogadorId: number
  timeId: number
  estatisticas: any
  jogador: {
    id: number
    nome: string
    posicao: string
  }
  time: {
    id: number
    nome: string
    sigla: string
  }
}

export interface Jogo {
  id: number
  campeonatoId: number
  timeCasaId: number
  timeVisitanteId: number
  dataJogo: string
  local?: string
  rodada: number
  fase: string
  status: 'AGENDADO' | 'AO VIVO' | 'FINALIZADO' | 'ADIADO'
  placarCasa?: number
  placarVisitante?: number
  observacoes?: string
  estatisticasProcessadas: boolean

  timeCasa: Time
  timeVisitante: Time
  campeonato: Campeonato
  estatisticas?: EstatisticaJogo[]
}

class JogosService extends BaseService {
  static async getJogos(filters?: {
    temporada?: string
    campeonatoId?: number
    timeId?: number
    status?: string
    fase?: string
    rodada?: number
    limite?: number
  }): Promise<Jogo[]> {
    const service = new JogosService()

    if (filters?.temporada) {
      const params = new URLSearchParams()

      if (filters.status) params.append('status', filters.status)
      if (filters.fase) params.append('fase', filters.fase)
      if (filters.rodada) params.append('rodada', filters.rodada.toString())
      if (filters.limite) params.append('limite', filters.limite.toString())

      const queryString = params.toString()
      const url = `/superliga/${filters.temporada}/jogos${queryString ? `?${queryString}` : ''}`

      return service.get<Jogo[]>(url)
    }

    if (filters?.campeonatoId) {
      const params = new URLSearchParams()
      if (filters.status) params.append('status', filters.status)
      if (filters.fase) params.append('fase', filters.fase)
      if (filters.rodada) params.append('rodada', filters.rodada.toString())
      if (filters.timeId) params.append('timeId', filters.timeId.toString())
      if (filters.limite) params.append('limite', filters.limite.toString())

      const queryString = params.toString()
      const url = `/admin/campeonatos/${filters.campeonatoId}/jogos${queryString ? `?${queryString}` : ''}`

      return service.get<Jogo[]>(url)
    }

    const params = new URLSearchParams()
    if (filters?.status) params.append('status', filters.status)
    if (filters?.fase) params.append('fase', filters.fase)
    if (filters?.rodada) params.append('rodada', filters.rodada.toString())
    if (filters?.timeId) params.append('timeId', filters.timeId.toString())
    if (filters?.limite) params.append('limite', filters.limite.toString())

    const queryString = params.toString()
    const url = `/admin/jogos${queryString ? `?${queryString}` : ''}`

    return service.get<Jogo[]>(url)
  }

  static async getJogo(id: number): Promise<Jogo> {
    const service = new JogosService()
    return service.get<Jogo>(`/admin/jogos/${id}`)
  }

  static async atualizarResultado(id: number, dados: {
    placarCasa: number
    placarVisitante: number
    status?: string
    observacoes?: string
  }): Promise<{ message: string; jogo: Jogo }> {
    const service = new JogosService()
    return service.put(`/admin/jogos/${id}/resultado`, dados)
  }
}

export function useJogos(filters?: JogosFilters) {
  return useQuery({
    queryKey: queryKeys.jogos.list(filters || {}),
    queryFn: () => JogosService.getJogos(filters),
    staleTime: 1000 * 60 * 5,
    retry: 2,
    refetchOnWindowFocus: false,
    throwOnError: false
  })
}

export function useJogo(id: number) {
  return useQuery({
    queryKey: queryKeys.jogos.detail(id),
    queryFn: () => JogosService.getJogo(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
    retry: 2,
    refetchOnWindowFocus: false,
    throwOnError: false
  })
}

export function useAtualizarResultadoJogo() {
  const queryClient = useQueryClient()
  const notifications = useNotifications()

  return useMutation({
    mutationFn: ({ id, dados }: {
      id: number,
      dados: {
        placarCasa: number
        placarVisitante: number
        status?: string
        observacoes?: string
      }
    }) => JogosService.atualizarResultado(id, dados),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.jogos.detail(id)
      })
      queryClient.invalidateQueries({
        queryKey: queryKeys.jogos.lists()
      })
      notifications.success('Resultado atualizado!', 'Placar do jogo foi salvo com sucesso')
    },
    onError: (error: any) => {
      notifications.error('Erro ao atualizar resultado', error.message)
    }
  })
}

class GerenciarJogoService extends BaseService {
  async atualizarJogoCompleto(id: number, dados: {
    placarCasa?: number
    placarVisitante?: number
    dataJogo?: string
    local?: string
    observacoes?: string
    status?: string
  }): Promise<{ message: string; jogo: Jogo }> {
    return this.put(`/admin/jogos/${id}/gerenciar`, dados)
  }
}

// Hook para atualizar jogo completo
export function useGerenciarJogo() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, dados }: {
      id: number,
      dados: {
        placarCasa?: number
        placarVisitante?: number
        dataJogo?: string
        local?: string
        observacoes?: string
        status?: string
      }
    }) => {
      const service = new GerenciarJogoService()
      return service.atualizarJogoCompleto(id, dados)
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.jogos.detail(id)
      })
      queryClient.invalidateQueries({
        queryKey: queryKeys.jogos.lists()
      })
      // Adicione notificação aqui se tiver sistema de notificações
      console.log('✅ Jogo atualizado com sucesso!')
    },
    onError: (error: any) => {
      // Adicione notificação de erro aqui se tiver sistema de notificações
      console.error('❌ Erro ao atualizar jogo:', error.message)
    }
  })
}
