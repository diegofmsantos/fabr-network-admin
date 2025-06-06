import { ClassificacaoPorCategoria } from "./jogador"

export interface BaseEntity {
  id: number
  createdAt: string
  updatedAt: string
}

// Time com dados sempre consistentes
export interface Time extends BaseEntity {
  nome: string
  sigla: string
  temporada: string
  cor: string
  cidade: string
  bandeira_estado: string
  fundacao: string
  logo: string
  capacete: string
  instagram?: string
  instagram2?: string
  estadio: string
  presidente: string
  head_coach: string
  instagram_coach?: string
  coord_ofen: string
  coord_defen: string
  titulos?: Titulo[]
  jogadores?: Jogador[]
  
  // Campos calculados/relacionados
  _count?: {
    jogadores: number
    campeonatos: number
  }
}

export interface Titulo {
  nacionais?: string
  conferencias?: string
  estaduais?: string
}

// Jogador com relacionamentos claros
export interface Jogador extends BaseEntity {
  nome: string
  posicao: string
  setor: 'Ataque' | 'Defesa' | 'Special'
  experiencia: number
  idade: number
  altura: number
  peso: number
  instagram?: string
  instagram2?: string
  cidade: string
  nacionalidade: string
  timeFormador: string
  
  // Relacionamento atual com time (via JogadorTime)
  timeAtual?: {
    timeId: number
    time: Time
    temporada: string
    numero: number
    camisa: string
    dataInicio: string
    dataFim?: string
  }
  
  // Histórico de times
  historicoTimes?: JogadorTime[]
  
  // Estatísticas (pode ser null se não tiver jogado)
  estatisticas?: Estatisticas
  
  // Classificações por categoria
  classificacoes?: ClassificacaoPorCategoria
}

// Relacionamento Time-Jogador por temporada
export interface JogadorTime extends BaseEntity {
  jogadorId: number
  timeId: number
  temporada: string
  numero: number
  camisa: string
  dataInicio: string
  dataFim?: string
  ativo: boolean
  
  // Relacionamentos
  jogador?: Jogador
  time?: Time
  estatisticas?: Estatisticas
}

// Estatísticas sempre tipadas e consistentes
export interface Estatisticas {
  id?: number
  jogadorId?: number
  temporada?: string
  jogoId?: string
  
  passe: {
    passes_completos: number
    passes_tentados: number
    jardas_de_passe: number
    td_passados: number
    interceptacoes_sofridas: number
    sacks_sofridos: number
    fumble_de_passador: number
  }
  corrida: {
    corridas: number
    jardas_corridas: number
    tds_corridos: number
    fumble_de_corredor: number
  }
  recepcao: {
    recepcoes: number
    alvo: number
    jardas_recebidas: number
    tds_recebidos: number
  }
  retorno: {
    retornos: number
    jardas_retornadas: number
    td_retornados: number
  }
  defesa: {
    tackles_totais: number
    tackles_for_loss: number
    sacks_forcado: number
    fumble_forcado: number
    interceptacao_forcada: number
    passe_desviado: number
    safety: number
    td_defensivo: number
  }
  kicker: {
    xp_bons: number
    tentativas_de_xp: number
    fg_bons: number
    tentativas_de_fg: number
    fg_mais_longo: number
  }
  punter: {
    punts: number
    jardas_de_punt: number
  }
}

// Respostas da API sempre padronizadas
export interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
  timestamp: string
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Filtros padronizados para todas as consultas
export interface BaseFilters {
  temporada?: string
  page?: number
  limit?: number
  orderBy?: string
  orderDirection?: 'asc' | 'desc'
}

export interface TimesFilters extends BaseFilters {
  cidade?: string
  setor?: string
  ativo?: boolean
}

export interface JogadoresFilters extends BaseFilters {
  timeId?: number
  posicao?: string
  setor?: 'Ataque' | 'Defesa' | 'Special'
  idadeMin?: number
  idadeMax?: number
  nacionalidade?: string
}

// Request/Response types para mutations
export interface CreateTimeRequest {
  nome: string
  sigla: string
  temporada: string
  cor: string
  cidade: string
  bandeira_estado: string
  fundacao: string
  logo: string
  capacete: string
  estadio: string
  presidente: string
  head_coach: string
  coord_ofen: string
  coord_defen: string
  instagram?: string
  instagram2?: string
  instagram_coach?: string
  titulos?: Titulo[]
}

export interface UpdateTimeRequest extends Partial<CreateTimeRequest> {
  id: number
}

export interface CreateJogadorRequest {
  nome: string
  posicao: string
  setor: 'Ataque' | 'Defesa' | 'Special'
  experiencia: number
  idade: number
  altura: number
  peso: number
  cidade: string
  nacionalidade: string
  timeFormador: string
  instagram?: string
  instagram2?: string
  
  // Dados do relacionamento atual
  timeId: number
  temporada: string
  numero: number
  camisa: string
  
  // Estatísticas iniciais (opcional)
  estatisticas?: Partial<Estatisticas>
}

export interface UpdateJogadorRequest extends Partial<CreateJogadorRequest> {
  id: number
}

// Error types padronizados
export interface ApiError {
  message: string
  code?: string
  status?: number
  field?: string
}

// Utility types
export type EntityStatus = 'ativo' | 'inativo' | 'suspenso'
export type Temporada = '2024' | '2025' | '2026'

// Hooks return types
export interface UseQueryResult<T> {
  data: T | undefined
  isLoading: boolean
  error: Error | null
  refetch: () => void
}

export interface UseMutationResult<TData, TVariables> {
  mutate: (variables: TVariables) => void
  mutateAsync: (variables: TVariables) => Promise<TData>
  isPending: boolean
  error: Error | null
  reset: () => void
}