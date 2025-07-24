// src/services/jogos.service.ts - SUBSTITUIR O ARQUIVO VAZIO POR ESTE CONTEÚDO

import { BaseService } from './base.service'

interface JogosFilters {
  temporada?: string
  campeonatoId?: number
  status?: string
  fase?: string
  rodada?: number
  conferencia?: string
  regional?: string
  timeId?: number
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

export class JogosService extends BaseService {
  static async getJogos(filters?: JogosFilters): Promise<Jogo[]> {
    const service = new JogosService()

    // ✅ PRIORIZAR ROTA DA SUPERLIGA QUANDO TEMPORADA É INFORMADA
    if (filters?.temporada) {
      const params = new URLSearchParams()
      if (filters.status) params.append('status', filters.status)
      if (filters.fase) params.append('fase', filters.fase)
      if (filters.rodada) params.append('rodada', filters.rodada.toString())
      if (filters.conferencia) params.append('conferencia', filters.conferencia)
      if (filters.regional) params.append('regional', filters.regional)
      if (filters.limite) params.append('limite', filters.limite.toString())

      const queryString = params.toString()
      const url = `/superliga/${filters.temporada}/jogos${queryString ? `?${queryString}` : ''}`
      
      console.log('🔍 JogosService: Usando rota da superliga:', url)
      return service.get<Jogo[]>(url)
    }

    // ✅ USAR ROTA ADMIN QUANDO CAMPEONATO ID É INFORMADO
    if (filters?.campeonatoId) {
      const params = new URLSearchParams()
      if (filters.status) params.append('status', filters.status)
      if (filters.fase) params.append('fase', filters.fase)
      if (filters.rodada) params.append('rodada', filters.rodada.toString())
      if (filters.timeId) params.append('timeId', filters.timeId.toString())
      if (filters.limite) params.append('limite', filters.limite.toString())

      const queryString = params.toString()
      const url = `/admin/campeonatos/${filters.campeonatoId}/jogos${queryString ? `?${queryString}` : ''}`
      
      console.log('🔍 JogosService: Usando rota de campeonato:', url)
      return service.get<Jogo[]>(url)
    }

    // ✅ ROTA PADRÃO ADMIN PARA OUTROS CASOS
    const params = new URLSearchParams()
    if (filters?.status) params.append('status', filters.status)
    if (filters?.fase) params.append('fase', filters.fase)
    if (filters?.rodada) params.append('rodada', filters.rodada.toString())
    if (filters?.timeId) params.append('timeId', filters.timeId.toString())
    if (filters?.limite) params.append('limite', filters.limite.toString())

    const queryString = params.toString()
    const url = `/admin/jogos${queryString ? `?${queryString}` : ''}`
    
    console.log('🔍 JogosService: Usando rota admin padrão:', url)
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

  static async finalizarJogo(id: number): Promise<Jogo> {
    const service = new JogosService()
    return service.put(`/admin/jogos/${id}/finalizar`, {})
  }

  static async adiarJogo(id: number, novaData?: string): Promise<Jogo> {
    const service = new JogosService()
    return service.put(`/admin/jogos/${id}/adiar`, { novaData })
  }

  static async criarJogo(dados: Partial<Jogo>): Promise<Jogo> {
    const service = new JogosService()
    return service.post('/admin/jogos', dados)
  }

  static async atualizarJogo(id: number, dados: Partial<Jogo>): Promise<Jogo> {
    const service = new JogosService()
    return service.put(`/admin/jogos/${id}`, dados)
  }

  static async deletarJogo(id: number): Promise<void> {
    const service = new JogosService()
    return service.delete(`/admin/jogos/${id}`)
  }

  // ✅ MÉTODOS ESPECÍFICOS DA SUPERLIGA
  static async getJogosPorRodada(temporada: string, rodada: number): Promise<Jogo[]> {
    const service = new JogosService()
    return service.get<Jogo[]>(`/superliga/${temporada}/jogos/rodada/${rodada}`)
  }

  static async getProximosJogos(temporada: string, limite: number = 5): Promise<Jogo[]> {
    const service = new JogosService()
    return service.get<Jogo[]>(`/superliga/${temporada}/proximos-jogos`, { limite })
  }

  static async getUltimosResultados(temporada: string, limite: number = 5): Promise<Jogo[]> {
    const service = new JogosService()
    return service.get<Jogo[]>(`/superliga/${temporada}/ultimos-resultados`, { limite })
  }
}