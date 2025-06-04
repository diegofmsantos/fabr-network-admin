import { Time } from './time'
import { Jogador } from './jogador'

export interface Campeonato {
  id: number
  nome: string
  temporada: string
  tipo: 'REGULAR' | 'PLAYOFFS' | 'COPA'
  status: 'NAO_INICIADO' | 'EM_ANDAMENTO' | 'FINALIZADO'
  dataInicio: string
  dataFim?: string
  descricao?: string
  formato: FormatoCampeonato
  createdAt: string
  updatedAt: string
  grupos: Grupo[]
  jogos?: Jogo[]
  _count?: {
    grupos: number
    jogos: number
  }
}

export interface FormatoCampeonato {
  tipoDisputa: 'PONTOS_CORRIDOS' | 'MATA_MATA' | 'MISTO'
  numeroRodadas: number
  temGrupos: boolean
  numeroGrupos?: number
  timesGrupo?: number
  classificadosGrupo?: number
  temPlayoffs: boolean
  formatoPlayoffs?: string
}

export interface Grupo {
  id: number
  nome: string
  campeonatoId: number
  ordem: number
  times: GrupoTime[]
  classificacoes: ClassificacaoGrupo[]
  jogos?: Jogo[]
}

export interface GrupoTime {
  id: number
  grupoId: number
  timeId: number
  time: Time
}

export interface Jogo {
  id: number
  campeonatoId: number
  grupoId?: number
  timeVisitanteId: number
  timeCasaId: number
  dataJogo: string
  local?: string
  rodada: number
  fase: string
  status: 'AGENDADO' | 'AO_VIVO' | 'FINALIZADO' | 'ADIADO'
  placarCasa?: number
  placarVisitante?: number
  observacoes?: string
  estatisticasProcessadas: boolean
  campeonato?: {
    id: number
    nome: string
    temporada: string
  }
  grupo?: {
    id: number
    nome: string
  }
  timeCasa: Time
  timeVisitante: Time
  estatisticas?: EstatisticaJogo[]
}

export interface ClassificacaoGrupo {
  id: number
  grupoId: number
  timeId: number
  posicao: number
  jogos: number
  vitorias: number
  empates: number
  derrotas: number
  pontosPro: number
  pontosContra: number
  saldoPontos: number
  pontos: number
  aproveitamento: number
  time: Time
  grupo?: {
    id: number
    nome: string
    ordem: number
  }
}

export interface EstatisticaJogo {
  id: number
  jogoId: number
  jogadorId: number
  timeId: number
  estatisticas: any // Usar a mesma estrutura de estatísticas existente
  jogador: {
    id: number
    nome: string
    posicao: string
    numero?: number
    camisa?: string
  }
}

// Tipos para filtros e requests
export interface FiltroJogos {
  campeonatoId?: number
  timeId?: number
  grupoId?: number
  rodada?: number
  status?: string
  fase?: string
  dataInicio?: string
  dataFim?: string
  limit?: number
  offset?: number
}

export interface CriarCampeonatoRequest {
  nome: string
  temporada: string
  tipo: 'REGULAR' | 'PLAYOFFS' | 'COPA'
  dataInicio: string
  dataFim?: string
  descricao?: string
  formato: FormatoCampeonato
  grupos?: Array<{
    nome: string
    times: number[]
  }>
  gerarJogos?: boolean
}

// Tipos para componentes
export interface JogoCardProps {
  jogo: Jogo
  showDate?: boolean
  showGroup?: boolean
  compact?: boolean
}

export interface TabelaClassificacaoProps {
  classificacao: ClassificacaoGrupo[]
  grupoNome?: string
  showGroup?: boolean
  compact?: boolean
}

export interface CampeonatoHeaderProps {
  campeonato: Campeonato
  activeTab?: string
  onTabChange?: (tab: string) => void
}