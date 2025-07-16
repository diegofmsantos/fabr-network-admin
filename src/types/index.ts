// ==================== BASE TYPES ====================

export interface Conferencia {
  id: number
  nome: string
  tipo: string
  icone: string
  campeonatoId: number
  ordem: number
  totalTimes: number
}

export interface Regional {
  id: number
  nome: string
  tipo: string
  conferenciaId: number
  ordem: number
  timesPorRegional: number
}

export interface PlayoffJogo {
  id: number
  campeonatoId: number
  conferenciaId: number | null
  fase: string
  rodada: number
  nome: string
  timeClassificado1Id: number | null
  timeClassificado2Id: number | null
  jogoAnterior1Id: number | null
  jogoAnterior2Id: number | null
  timeVencedorId: number | null
  dataJogo: Date | null
  local: string | null
  status: string
  placarTime1: number | null
  placarTime2: number | null
  observacoes: string | null
}

export interface BaseEntity {
  id: number
  createdAt: string
  updatedAt: string
}

// ==================== TIME ====================

export interface Titulo {
  nacionais?: string
  conferencias?: string
  estaduais?: string
}

// Versão principal do Time (usada no backend/admin)
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
  instagram: string
  instagram2: string
  estadio: string
  presidente: string
  head_coach: string
  instagram_coach: string
  coord_ofen: string
  coord_defen: string
  titulos: Titulo[] // Sempre array, nunca undefined

  // Relacionamentos (para frontend)
  jogadores?: JogadorTime[]

  // Campos calculados (cache/otimização)
  _count?: {
    jogadores: number
    campeonatos: number
    vitorias: number
    derrotas: number
  }
}

// Versão com campos opcionais (compatibilidade com frontend antigo)
export type TimeOptional = {
  id?: number
  nome?: string
  temporada?: string
  sigla?: string
  cor?: string
  cidade?: string
  bandeira_estado?: string
  fundacao?: string
  logo?: string
  capacete?: string
  instagram?: string
  instagram2?: string
  estadio?: string
  presidente?: string
  head_coach?: string
  instagram_coach?: string
  coord_ofen?: string
  coord_defen?: string
  titulos?: Titulo[]
  jogadores?: Jogador[]
}

export interface Transferencia {
  id: number
  jogadorNome: string
  timeOrigemId?: number
  timeOrigemNome?: string
  timeOrigemSigla?: string
  timeDestinoId: number
  timeDestinoNome?: string
  timeDestinoSigla?: string
  novaPosicao?: string | null
  novoSetor?: string | null
  novoNumero?: number | null
  novaCamisa?: string | null
  data: string
}

export interface TimeMercadoCardProps {
  timeNome: string
  jogadoresEntrando: Transferencia[]
  jogadoresSaindo: Transferencia[]
}

// ==================== JOGADOR ====================

export interface Estatisticas {
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

// Versão com campos opcionais das estatísticas (frontend antigo)
export type EstatisticasOptional = {
  passe?: {
    passes_completos?: number
    passes_tentados?: number
    jardas_de_passe?: number
    td_passados?: number
    interceptacoes_sofridas?: number
    sacks_sofridos?: number
    fumble_de_passador?: number
  }
  corrida?: {
    corridas?: number
    jardas_corridas?: number
    tds_corridos?: number
    fumble_de_corredor?: number
  }
  recepcao?: {
    recepcoes?: number
    alvo?: number
    jardas_recebidas?: number
    tds_recebidos?: number
  }
  retorno?: {
    retornos?: number
    jardas_retornadas?: number
    td_retornados?: number
  }
  defesa?: {
    tackles_totais?: number
    tackles_for_loss?: number
    sacks_forcado?: number
    fumble_forcado?: number
    interceptacao_forcada?: number
    passe_desviado?: number
    safety?: number
    td_defensivo?: number
  }
  kicker?: {
    xp_bons?: number
    tentativas_de_xp?: number
    fg_bons?: number
    tentativas_de_fg?: number
    fg_mais_longo?: number
  }
  punter?: {
    punts?: number
    jardas_de_punt?: number
  }
}

export interface Classificacao {
  estrelas: number
  criterio_valor: number
}

export interface ClassificacaoPorCategoria {
  passe?: Classificacao
  corrida?: Classificacao
  recepcao?: Classificacao
  retorno?: Classificacao
  defesa?: Classificacao
  kicker?: Classificacao
  punter?: Classificacao
}

// Versão principal do Jogador (backend/admin)
export interface Jogador extends BaseEntity {
  nome: string
  posicao: string
  setor: 'Ataque' | 'Defesa' | 'Special'
  experiencia: number
  idade: number
  altura: number // Float no banco
  peso: number
  instagram: string
  instagram2: string
  cidade: string
  nacionalidade: string
  timeFormador: string

  // Relacionamentos (para frontend - via JogadorTime)
  times?: JogadorTime[]

  // Dados do relacionamento atual (para facilitar acesso)
  timeId?: number
  numero?: number
  camisa?: string
  estatisticas?: Estatisticas
  classificacoes?: ClassificacaoPorCategoria
}

// Versão com campos opcionais (compatibilidade frontend antigo)
export type JogadorOptional = {
  id?: number
  nome?: string
  time?: string
  timeId?: number
  timeFormador?: string
  posicao?: string
  setor?: "Ataque" | "Defesa" | "Special"
  experiencia?: number
  numero?: number
  idade?: number
  altura?: number
  peso?: number
  instagram?: string
  instagram2?: string
  cidade?: string
  nacionalidade?: string
  camisa?: string
  estatisticas?: EstatisticasOptional
}

// ✅ IMPORTANTE: JogadorType é um ALIAS para compatibilidade
export type JogadorType = Jogador

export interface JogadorTime extends BaseEntity {
  jogadorId: number
  timeId: number
  temporada: string
  numero: number
  camisa: string
  estatisticas: Estatisticas // Sempre presente, mesmo que vazio

  // Relacionamentos (quando incluídos)
  jogador?: Jogador
  time?: Time
}

// ==================== MATÉRIAS/NOTÍCIAS ====================

export interface Materia extends BaseEntity {
  titulo: string
  subtitulo: string
  imagem: string
  legenda: string | null
  texto: string
  autor: string
  autorImage: string
  // ✅ PADRONIZADO: sempre string ISO (vem da API assim)
  createdAt: string
  updatedAt: string
}

// Alias para compatibilidade com código existente
export type Noticia = Materia

// ==================== CAMPEONATOS ====================

export interface FormatoCampeonato {
  tipoDisputa: 'PONTOS CORRIDOS' | 'MATA MATA' | 'MISTO'
  numeroRodadas: number
  temGrupos: boolean
  numeroGrupos?: number
  timesGrupo?: number
  classificadosGrupo?: number
  temPlayoffs: boolean
  formatoPlayoffs?: string
}

export interface Campeonato extends BaseEntity {
  nome: string
  temporada: string
  tipo: 'REGULAR' | 'PLAYOFFS' | 'COPA'
  status: 'NAO INICIADO' | 'EM ANDAMENTO' | 'FINALIZADO'
  dataInicio: string // ISO string
  dataFim?: string
  descricao?: string
  formato: FormatoCampeonato

  // Relacionamentos
  grupos: Grupo[]
  jogos?: Jogo[]

  // Contadores
  _count?: {
    grupos: number
    jogos: number
  }
}

export interface Grupo extends BaseEntity {
  nome: string
  campeonatoId: number
  ordem: number
  regionalId?: number

  // Relacionamentos
  campeonato?: Campeonato
  regional?: Regional  // ADICIONAR ESTA LINHA
  times: GrupoTime[]
  classificacoes: ClassificacaoGrupo[]
  jogos?: Jogo[]
}

export interface GrupoTime extends BaseEntity {
  grupoId: number
  timeId: number

  // Relacionamentos
  grupo?: Grupo
  time: Time
}

export interface Jogo extends BaseEntity {
  campeonatoId: number
  grupoId?: number // Null se não for jogo de grupo
  timeVisitanteId: number
  timeCasaId: number
  dataJogo: string // ISO string
  local?: string
  rodada: number
  fase: string // "FASE_GRUPOS", "OITAVAS", "QUARTAS", "SEMI", "FINAL"
  status: 'AGENDADO' | 'AO VIVO' | 'FINALIZADO' | 'ADIADO'
  placarCasa?: number
  placarVisitante?: number
  observacoes?: string
  estatisticasProcessadas: boolean

  // Relacionamentos
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

export interface ClassificacaoGrupo extends BaseEntity {
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
  pontos: number // Pontos na tabela (vitória = 3, empate = 1)
  aproveitamento: number

  // Relacionamentos
  time: Time
  grupo?: {
    id: number
    nome: string
    ordem: number
  }
}

export interface EstatisticaJogo extends BaseEntity {
  jogoId: number
  jogadorId: number
  timeId: number
  estatisticas: Estatisticas // Mesma estrutura das estatísticas existente

  // Relacionamentos
  jogo?: Jogo
  jogador: {
    id: number
    nome: string
    posicao: string
    numero?: number
    camisa?: string
  }
  time?: Time
}

// ==================== ESTATÍSTICAS E STATS ====================

export type StatKey =
  | keyof Estatisticas['passe']
  | keyof Estatisticas['corrida']
  | keyof Estatisticas['recepcao']
  | keyof Estatisticas['retorno']
  | keyof Estatisticas['defesa']
  | keyof Estatisticas['kicker']
  | keyof Estatisticas['punter']
  | 'passes_percentual'
  | 'jardas_media'
  | 'jardas_corridas_media'
  | 'jardas_recebidas_media'
  | 'jardas_retornadas_media'
  | 'extra_points'
  | 'field_goals'
  | 'jardas_punt_media'

// Interfaces específicas para compatibilidade
export interface PasseStats {
  passes_completos: number
  passes_tentados: number
  jardas_de_passe: number
  td_passados: number
  interceptacoes_sofridas: number
  sacks_sofridos: number
  fumble_de_passador: number
}

export interface CorridaStats {
  corridas: number
  jardas_corridas: number
  tds_corridos: number
  fumble_de_corredor: number
}

export interface RecepcaoStats {
  recepcoes: number
  alvo: number
  jardas_recebidas: number
  tds_recebidos: number
}

export interface RetornoStats {
  retornos: number
  jardas_retornadas: number
  td_retornados: number
}

export interface DefesaStats {
  tackles_totais: number
  tackles_for_loss: number
  sacks_forcado: number
  fumble_forcado: number
  interceptacao_forcada: number
  passe_desviado: number
  safety: number
  td_defensivo: number
}

export interface KickerStats {
  xp_bons: number
  tentativas_de_xp: number
  fg_bons: number
  tentativas_de_fg: number
  fg_mais_longo: number
}

export interface PunterStats {
  punts: number
  jardas_de_punt: number
}

export interface StatsBase {
  passe: PasseStats
  corrida: CorridaStats
  recepcao: RecepcaoStats
  retorno: RetornoStats
  defesa: DefesaStats
  kicker: KickerStats
  punter: PunterStats
}

export interface StatGroup {
  title: string
  groupLabel: string
  stats: Array<{
    title: string
    urlParam: string
  }>
}

export interface CalculatedStats {
  jardas_media: number | null
  jardas_corridas_media: number | null
  jardas_recebidas_media: number | null
  jardas_retornadas_media: number | null
  jardas_punt_media: number | null
  passes_percentual: number | null
  field_goals: string | null
  extra_points: string | null
}

export type StatType = 'PASSE' | 'CORRIDA' | 'RECEPCAO' | 'RETORNO' | 'DEFESA' | 'KICKER' | 'PUNTER'

export interface StatConfig {
  key: string
  title: string
  category: string
  isCalculated?: boolean
}

export interface StatResult {
  value: number | null
  tier: number
}

export interface ProcessedPlayer {
  player: Jogador
  average: number
  baseStat: number
  teamInfo: any
  value: string | number
}

export interface ProcessedStatCard {
  title: string
  category: string
  players: Array<{
    id: number
    name: string
    team: string
    value: string
    camisa: string
    teamColor?: string
    teamLogo?: string
    isFirst?: boolean
  }>
}

// ==================== TEAM STATS E COMPARAÇÕES ====================

export interface TeamStats {
  timeId: number
  passe: {
    jardas_de_passe: number
    passes_completos: number
    passes_tentados: number
    td_passados: number
    interceptacoes_sofridas: number
    sacks_sofridos: number
    fumble_de_passador: number
  }
  corrida: {
    jardas_corridas: number
    corridas: number
    tds_corridos: number
    fumble_de_corredor: number
  }
  recepcao: {
    jardas_recebidas: number
    recepcoes: number
    tds_recebidos: number
    alvo: number
  }
  retorno: {
    jardas_retornadas: number
    retornos: number
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

export type StatCategory = 'passe' | 'corrida' | 'recepcao' | 'retorno' | 'defesa' | 'kicker' | 'punter'

export interface TeamComparisonStats {
  passe: {
    jardas_de_passe: number
    passes_completos: number
    passes_tentados: number
    td_passados: number
    interceptacoes_sofridas: number
    sacks_sofridos: number
    fumble_de_passador: number
  }
  corrida: {
    jardas_corridas: number
    corridas: number
    tds_corridos: number
    fumble_de_corredor: number
  }
  recepcao: {
    jardas_recebidas: number
    recepcoes: number
    alvo: number
    tds_recebidos: number
  }
  retorno: {
    jardas_retornadas: number
    retornos: number
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
    fg_bons: number
    tentativas_de_fg: number
    fg_mais_longo: number
    xp_bons: number
    tentativas_de_xp: number
  }
  punter: {
    jardas_de_punt: number
    punts: number
  }
}

export interface TeamComparisonPlayer {
  id: number
  nome: string
  camisa: string
  numero: number
  posicao: string
  estatisticas: {
    passe?: Record<string, number>
    corrida?: Record<string, number>
    recepcao?: Record<string, number>
    retorno?: Record<string, number>
    defesa?: Record<string, number>
    kicker?: Record<string, number>
    punter?: Record<string, number>
  }
}

export interface TeamComparisonHighlights {
  ataque: {
    passador: TeamComparisonPlayer | null
    corredor: TeamComparisonPlayer | null
    recebedor: TeamComparisonPlayer | null
    retornador: TeamComparisonPlayer | null
  }
  defesa: {
    tackler: TeamComparisonPlayer | null
    rusher: TeamComparisonPlayer | null
    interceptador: TeamComparisonPlayer | null
    desviador: TeamComparisonPlayer | null
  }
  specialTeams: {
    kicker: TeamComparisonPlayer | null
    punter: TeamComparisonPlayer | null
  }
}

export interface TeamComparisonTeam {
  id: number
  nome: string
  sigla: string
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
  temporada: string
  estatisticas: TeamComparisonStats
  destaques: TeamComparisonHighlights
}

export interface TeamComparisonData {
  teams: {
    time1: TeamComparisonTeam
    time2: TeamComparisonTeam
  }
  metaData: {
    temporada: string
    geradoEm: string
    totalJogos: {
      time1: number
      time2: number
    }
  }
}

export interface ChartDataPoint {
  name: string
  [key: string]: string | number
}

export interface ComparisonCardData {
  title: string
  stat1: string
  stat2: string
  color1: string
  color2: string
  isFirstBetter?: boolean
  isSecondBetter?: boolean
  isEqual?: boolean
}

export interface PlayerComparisonData {
  title: string
  player1: TeamComparisonPlayer | null
  player2: TeamComparisonPlayer | null
  team1: TeamComparisonTeam
  team2: TeamComparisonTeam
  statKey: string
  statCategory: StatCategory
}

export interface ComparisonFilters {
  temporada: string
  categoria?: StatCategory
  tipoEstatistica?: StatTypeEnum
  ordenarPor?: 'nome' | 'valor' | 'diferenca'
  mostrarApenas?: 'melhores' | 'piores' | 'todos'
}

export interface ProcessedComparison {
  teams: {
    time1: TeamComparisonTeam
    time2: TeamComparisonTeam
  }
  comparisons: {
    [category in StatCategory]: ComparisonCardData[]
  }
  highlights: {
    [category in StatCategory]: PlayerComparisonData[]
  }
  charts: {
    [category in StatCategory]: ChartDataPoint[]
  }
  summary: {
    vencedor: 'time1' | 'time2' | 'empate'
    categorias_vencidas: {
      time1: StatCategory[]
      time2: StatCategory[]
      empates: StatCategory[]
    }
    pontuacao: {
      time1: number
      time2: number
    }
  }
}

export interface TeamComparisonResponse {
  success: boolean
  data: TeamComparisonData
  message?: string
  error?: string
}

export type StatComparison = {
  [K in StatCategory]: {
    [key: string]: number
  }
}

export enum StatTypeEnum {
  TOTAL = 'total',
  AVERAGE = 'average',
  PERCENTAGE = 'percentage',
  RATIO = 'ratio'
}

export interface TeamInfo {
  nome: string
  cor: string
}

export interface TeamCardProps {
  id: number
  name: string
  value: string
  teamColor?: string
  isFirst?: boolean
}

export interface TeamStatCardProps {
  title: string
  category: string
  teams: TeamCardProps[]
}

export interface TeamStatCardsGridProps {
  stats: TeamStatCardProps[]
  category: string
}

// ==================== REQUESTS/RESPONSES ====================

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

// ==================== FILTROS ====================

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

// ==================== API RESPONSES ====================

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

export interface ApiError {
  message: string
  code?: string
  status?: number
  field?: string
}

// ==================== TIPOS UTILITÁRIOS ====================

export type EntityStatus = 'ativo' | 'inativo' | 'suspenso'
export type Temporada = '2024' | '2025' | '2026'
export type TipoSetor = 'Ataque' | 'Defesa' | 'Special'

// ==================== PROPS DE COMPONENTES ====================

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

// ==================== HOOKS RETURN TYPES ====================

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

// ==================== TEMPORADA ====================

export interface TimeChange {
  timeId: number
  alteracoes: Record<string, any>
}

export interface TransferenciaTemporada {
  id?: number
  jogadorNome: string
  jogadorId: number
  timeOrigemId?: number
  timeOrigemNome?: string
  timeOrigemSigla?: string
  timeDestinoId: number
  timeDestinoNome?: string
  timeDestinoSigla?: string
  temporadaOrigem?: string
  temporadaDestino?: string
  novaPosicao?: string
  novoSetor?: string
  novoNumero?: number
  novaCamisa?: string
  tipo?: 'TRANSFERENCIA' | 'RENOVACAO' | 'NOVO'
  status?: 'PENDENTE' | 'APROVADO' | 'REJEITADO'
  observacoes?: string
  dataTransferencia?: string
}

export interface IniciarTemporadaData {
  timeChanges: TimeChange[]
  transferencias: TransferenciaTemporada[]
}

export interface IniciarTemporadaResponse {
  message: string
  times: number
  jogadores: number
  transferencias: number
}

// ==================== ESTATÍSTICAS ADMIN ====================

export interface AdminStats {
  totalCampeonatos: number
  campeonatosAtivos: number
  jogosAgendados: number
  jogosFinalizados: number
  timesAtivos: number
  timesParticipantes: number
  jogosEstaSemana: number

  crescimentoCampeonatos: number
  novosTimes: number
  melhoriaOperacional: number
  taxaConclusao: number

  campeonatosPorStatus: Array<{
    status: string
    quantidade: number
    cor: string
  }>

  jogosPorMes: Array<{
    mes: string
    jogos: number
    finalizados: number
  }>

  evolucaoCampeonatos: Array<{
    data: string
    total: number
    ativos: number
  }>

  statusJogos: Array<{
    status: string
    quantidade: number
    porcentagem: number
  }>

  performancePorTipo: Array<{
    tipo: string
    quantidade: number
    media: number
  }>

  participacaoRegional: Array<{
    regiao: string
    times: number
    porcentagem: number
  }>

  tendenciaMensal: Array<{
    mes: string
    valor: number
    variacao: number
  }>

  atividadesRecentes: Array<{
    id: string
    tipo: 'campeonato criado' | 'jogo finalizado' | 'classificacao atualizada'
    titulo: string
    descricao: string
    data: string
    usuario?: string
  }>

  alertas: Array<{
    id: string
    titulo: string
    descricao: string
    prioridade: 'alta' | 'media' | 'baixa'
    tipo: 'warning' | 'error' | 'info'
    data: string
  }>

  topCampeonatos: Array<{
    id: number
    nome: string
    jogos: number
    times: number
    popularidade: number
  }>

  topTimes: Array<{
    id: number
    nome: string
    campeonatos: number
    vitorias: number
    pontos: number
  }>

  topRegioes: Array<{
    nome: string
    times: number
    campeonatos: number
    crescimento: number
  }>

  mediaJogosPorCampeonato: number
  tempoMedioDuracao: number
  taxaAdiamentos: number
  mediaGruposPorCampeonato: number
  participacaoMedia: number
  pontuacaoMedia: number

  recentActivities: Array<{
    id: string
    type: string
    message: string
    timestamp: string
    user?: string
  }>

  alerts: string[]
}

export interface AdminStatsParams {
  temporada?: string
  period?: string
}

// ==================== NOTIFICAÇÕES ====================

export interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
  timestamp: Date
}

// ==================== COMPONENTES ADMIN ====================

export interface RecentActivityItem {
  id: string
  type: string
  message: string
  timestamp: string
  user?: string
  link?: string
}

export interface RecentActivityProps {
  activities: RecentActivityItem[]
  maxItems?: number
}

// ==================== SCHEMAS ZOD (para referência) ====================

export interface CampeonatoValidation {
  id?: number
  nome: string
  temporada: string
  tipo: 'REGULAR' | 'PLAYOFFS' | 'COPA'
  status: 'NAO INICIADO' | 'EM ANDAMENTO' | 'FINALIZADO'
  dataInicio: Date | string
  dataFim?: Date | string
  descricao?: string
  formato: FormatoCampeonato
}

export interface GrupoValidation {
  id?: number
  nome: string
  campeonatoId: number
  ordem: number
  times?: number[]
}

export interface JogoValidation {
  id?: number
  campeonatoId: number
  grupoId?: number
  timeVisitanteId: number
  timeCasaId: number
  dataJogo: Date | string
  local?: string
  rodada: number
  fase: 'FASE GRUPOS' | 'OITAVAS' | 'QUARTAS' | 'SEMI' | 'FINAL'
  status: 'AGENDADO' | 'AO VIVO' | 'FINALIZADO' | 'ADIADO'
  placarCasa?: number
  placarVisitante?: number
  observacoes?: string
}

// ==================== TYPES ESPECÍFICOS PARA PÁGINAS ====================

// Tipos para página de jogos do admin
export type FilterStatus = 'todos' | 'AGENDADO' | 'AO VIVO' | 'FINALIZADO' | 'ADIADO'
export type ViewMode = 'calendar' | 'list' | 'table'

// Tipos para comparação de times
export interface TeamComparisonProps {
  currentTeam: Time
  selectedSetor: string
}


// Re-exports para facilitar imports
export type {
  Estatisticas as Stats,
  EstatisticasOptional as StatsOptional,
  StatCategory as Category,
  StatKey as Key
}

// ==================== TIPOS PARA SUPERLIGA ====================

export type TipoConferencia = 'SUDESTE' | 'SUL' | 'NORDESTE' | 'CENTRO NORTE'

export type TipoRegional =
  | 'SERRAMAR' | 'CANASTRA' | 'CANTAREIRA' // Sudeste
  | 'ARAUCARIA' | 'PAMPA' // Sul  
  | 'ATLANTICO' // Nordeste
  | 'CERRADO' | 'AMAZONIA' // Centro-Norte

export interface ConferenciaConfig {
  tipo: TipoConferencia
  nome: string
  icone: string
  totalTimes: number
  regionais: RegionalConfig[]
  playoffConfig: PlayoffConfig
}

export interface RegionalConfig {
  tipo: TipoRegional
  nome: string
  conferencia: TipoConferencia
  timesPorRegional: number
  times: number[]
}

export interface PlayoffConfig {
  semifinalDireta: number // quantos times vão direto
  wildcardVagas: number // quantas vagas de wild card
  estrutura: 'CONFERENCIA' | 'REGIONAL' | 'GERAL'
}

// ==================== CONFIGURAÇÃO DA SUPERLIGA ====================

// ADICIONAR ESTA CONFIGURAÇÃO NO ARQUIVO src/types/index.ts

export const TIMES_SUPERLIGA: Record<TipoRegional, string[]> = {
  // Conferência Sudeste - Regional Serramar
  SERRAMAR: [
    'Vasco Almirantes',
    'Flamengo Imperadores',
    'Locomotiva FA',
    'Tritões FA'
  ],

  // Conferência Sudeste - Regional Canastra
  CANASTRA: [
    'Galo FA',
    'Moura Lacerda Dragons',
    'Rio Preto Weilers',
    'Spartans FA'
  ],

  // Conferência Sudeste - Regional Cantareira
  CANTAREIRA: [
    'Corinthians Steamrollers',
    'Cruzeiro FA',
    'Guarulhos Rhynos',
    'Ocelots FA'
  ],

  // Conferência Sul - Regional Araucária
  ARAUCARIA: [
    'Timbó Rex',
    'Coritiba Crocodiles',
    'Calvary Cavaliers',
    'Brown Spiders'
  ],

  // Conferência Sul - Regional Pampa
  PAMPA: [
    'Santa Maria Soldiers',
    'Juventude FA',
    'Bravos FA',
    'Istepôs FA'
  ],

  // Conferência Nordeste - Regional Atlântico
  ATLANTICO: [
    'Fortaleza Tritões',
    'Ceará Sabres',
    'João Pessoa Espectros',
    'Recife Mariners',
    'Cavalaria 2 de Julho',
    'Caruaru Wolves'
  ],

  // Conferência Centro-Norte - Regional Cerrado
  CERRADO: [
    'Rondonópolis Hawks',
    'Cuiabá Arsenal',
    'Tubarões do Cerrado'
  ],

  // Conferência Centro-Norte - Regional Amazônia  
  AMAZONIA: [
    'Porto Velho Miners',
    'Manaus FA',
    'São Raimundo Cavaliers'
  ]
}

// COMPLETAR A CONFIGURAÇÃO SUPERLIGA_CONFIG
export const SUPERLIGA_CONFIG: ConferenciaConfig[] = [
  // ✅ CONFERÊNCIA SUDESTE (12 times, 3 regionais)
  {
    tipo: 'SUDESTE',
    nome: 'Conferência Sudeste',
    icone: '🏭',
    totalTimes: 12,
    regionais: [
      {
        tipo: 'SERRAMAR',
        nome: 'Regional Serramar',
        conferencia: 'SUDESTE',
        timesPorRegional: 4,
        times: [] // Preenchido dinamicamente
      },
      {
        tipo: 'CANASTRA',
        nome: 'Regional Canastra',
        conferencia: 'SUDESTE',
        timesPorRegional: 4,
        times: []
      },
      {
        tipo: 'CANTAREIRA',
        nome: 'Regional Cantareira',
        conferencia: 'SUDESTE',
        timesPorRegional: 4,
        times: []
      }
    ],
    playoffConfig: {
      semifinalDireta: 2, // 2 melhores 1º colocados vão direto
      wildcardVagas: 4,   // 4 vagas de wild card
      estrutura: 'CONFERENCIA'
    }
  },

  // ✅ CONFERÊNCIA SUL (8 times, 2 regionais)
  {
    tipo: 'SUL',
    nome: 'Conferência Sul',
    icone: '🧊',
    totalTimes: 8,
    regionais: [
      {
        tipo: 'ARAUCARIA',
        nome: 'Regional Araucária',
        conferencia: 'SUL',
        timesPorRegional: 4,
        times: []
      },
      {
        tipo: 'PAMPA',
        nome: 'Regional Pampa',
        conferencia: 'SUL',
        timesPorRegional: 4,
        times: []
      }
    ],
    playoffConfig: {
      semifinalDireta: 2, // 1º de cada regional vai direto
      wildcardVagas: 4,   // 2º e 3º de cada regional
      estrutura: 'CONFERENCIA'
    }
  },

  // ✅ CONFERÊNCIA NORDESTE (6 times, 1 regional) - ERA ISSO QUE ESTAVA FALTANDO!
  {
    tipo: 'NORDESTE',
    nome: 'Conferência Nordeste',
    icone: '🌵',
    totalTimes: 6,
    regionais: [
      {
        tipo: 'ATLANTICO',
        nome: 'Regional Atlântico',
        conferencia: 'NORDESTE',
        timesPorRegional: 6,
        times: []
      }
    ],
    playoffConfig: {
      semifinalDireta: 2, // 1º e 2º lugar vão direto para semifinal
      wildcardVagas: 2,   // 4º vs 5º (wild card)
      estrutura: 'CONFERENCIA'
    }
  },

  // ✅ CONFERÊNCIA CENTRO-NORTE (6 times, 2 regionais)
  {
    tipo: 'CENTRO NORTE',
    nome: 'Conferência Centro-Norte',
    icone: '🌲',
    totalTimes: 6,
    regionais: [
      {
        tipo: 'CERRADO',
        nome: 'Regional Cerrado',
        conferencia: 'CENTRO NORTE',
        timesPorRegional: 3,
        times: []
      },
      {
        tipo: 'AMAZONIA',
        nome: 'Regional Amazônia',
        conferencia: 'CENTRO NORTE',
        timesPorRegional: 3,
        times: []
      }
    ],
    playoffConfig: {
      semifinalDireta: 2, // 1º de cada regional vai direto para semifinal
      wildcardVagas: 2,   // 2º de cada regional
      estrutura: 'CONFERENCIA'
    }
  }
]

// ==================== TIPOS PARA PLAYOFFS ====================

export interface PlayoffBracket {
  conferencia: TipoConferencia
  wildcards: WildCardGame[]
  semifinais: SemifinalGame[]
  final: FinalGame
}

export interface WildCardGame {
  id: string
  nome: string
  time1: PlayoffTeam
  time2: PlayoffTeam
  vencedor?: PlayoffTeam
}

export interface SemifinalGame {
  id: string
  nome: string
  time1: PlayoffTeam | 'VencedorWC'
  time2: PlayoffTeam | 'VencedorWC'
  vencedor?: PlayoffTeam
}

export interface FinalGame {
  id: string
  nome: string
  time1: PlayoffTeam | 'VencedorSF'
  time2: PlayoffTeam | 'VencedorSF'
  vencedor?: PlayoffTeam
}

export interface PlayoffTeam {
  timeId: number
  nome: string
  sigla: string
  regional: TipoRegional
  posicaoRegional: number
  classificacao: 'DIRETO' | 'WILD CARD'
}

// ==================== FASE NACIONAL ====================

export interface SemifinalNacional {
  id: string
  nome: string
  time1: {
    conferencia: TipoConferencia
    campeao: PlayoffTeam
  }
  time2: {
    conferencia: TipoConferencia
    campeao: PlayoffTeam
  }
  vencedor?: PlayoffTeam
}

export interface FinalNacional {
  id: string
  nome: 'Grande Decisão Nacional'
  semifinal1: SemifinalNacional
  semifinal2: SemifinalNacional
  vencedor?: PlayoffTeam
}

export interface SuperligaBracket {
  temporada: string
  status: 'CONFIGURANDO' | 'FASE GRUPOS' | 'PLAYOFFS' | 'FINALIZADO'

  // Playoffs por conferência
  playoffsSudeste: PlayoffBracket
  playoffsSul: PlayoffBracket
  playoffsNordeste: PlayoffBracket
  playoffsCentroNorte: PlayoffBracket

  // Fase Nacional
  semifinalNacional1: SemifinalNacional
  semifinalNacional2: SemifinalNacional
  finalNacional: FinalNacional
}

// ==================== UTILITÁRIOS ====================

export function getConferenciaConfig(tipo: TipoConferencia): ConferenciaConfig {
  return SUPERLIGA_CONFIG.find(c => c.tipo === tipo)!
}

export function getRegionalConfig(tipo: TipoRegional): RegionalConfig {
  for (const conf of SUPERLIGA_CONFIG) {
    const regional = conf.regionais.find(r => r.tipo === tipo)
    if (regional) return regional
  }
  throw new Error(`Regional ${tipo} não encontrada`)
}

export function getTimesByRegional(regional: TipoRegional): string[] {
  return TIMES_SUPERLIGA[regional] || []
}

// ==================== TIPOS ADICIONAIS SUPERLIGA ====================

export interface SuperligaJogo extends Jogo {
  conferencia?: TipoConferencia
  regional?: TipoRegional
  tipoJogo: 'TEMPORADA REGULAR' | 'WILD CARD' | 'SEMIFINAL CONFERENCIA' | 'FINAL CONFERENCIA' | 'SEMIFINAL NACIONAL' | 'FINAL NACIONAL'
}

export interface ClassificacaoRegional {
  regionalId: number
  regional: TipoRegional
  conferencia: TipoConferencia
  times: ClassificacaoTime[]
}

export interface ClassificacaoTime {
  posicao: number
  timeId: number
  time: Time
  jogos: number
  vitorias: number
  derrotas: number
  pontosPro: number
  pontosContra: number
  saldo: number
  aproveitamento: number
}

// Interface PlayoffBracket já existe no arquivo, não precisa redeclarar

export interface FaseNacional {
  semifinais: PlayoffJogo[]
  final: PlayoffJogo
  campeao?: Time
}

export interface SuperligaStatus {
  campeonatoId: number
  fase: 'CONFIGURACAO' | 'TEMPORADA REGULAR' | 'PLAYOFFS CONFERENCIA' | 'FASE NACIONAL' | 'FINALIZADO'
  jogosTemporadaRegular: {
    total: number
    finalizados: number
    percentual: number
  }
  playoffsStatus: {
    [key in TipoConferencia]?: {
      wildcardCompleto: boolean
      semifinalCompleto: boolean
      finalCompleto: boolean
      campeao?: Time
    }
  }
  faseNacionalStatus?: {
    semifinaisCompletas: boolean
    campeaoNacional?: Time
  }
}

// ==================== REQUESTS/RESPONSES SUPERLIGA ====================

export interface DistribuirTimesRequest {
  campeonatoId: number
  distribuicao: {
    [key in TipoRegional]?: number[] // IDs dos times
  }
}

export interface GerarJogosRequest {
  campeonatoId: number
  rodadas: number
  algoritmo: 'ROUND ROBIN' | 'CUSTOM'
}

export interface GerarPlayoffsRequest {
  campeonatoId: number
  conferencia: TipoConferencia
}

export interface AtualizarJogoPlayoffRequest {
  jogoId: number
  placarTime1: number
  placarTime2: number
  observacoes?: string
}

// ==================== HELPERS E UTILS ====================

export interface DistribuicaoTime {
  timeId: number
  timeNome: string
  conferencia: TipoConferencia
  regional: TipoRegional
}

export interface EstatisticasSuperliga {
  campeonatoId: number
  temporada: string
  totalJogos: number
  jogosRealizados: number
  mediaGolsPorJogo: number
  maiorGoleada: {
    jogo: Jogo
    placar: string
  }
  artilheiros: Array<{
    jogador: Jogador
    time: Time
    tds: number
  }>
  melhoresDefesas: Array<{
    time: Time
    pontosSofridos: number
    mediaPorJogo: number
  }>
  melhoresAtaques: Array<{
    time: Time
    pontosMarcados: number
    mediaPorJogo: number
  }>
}

// ==================== INTERFACES COMPONENTES ====================

export interface SuperligaCardProps {
  campeonato: Campeonato & {
    _count?: {
      jogos: number
      conferencias: number
    }
  }
  onEdit?: () => void
  onDelete?: () => void
  onViewDetails?: () => void
}

export interface ConferenciaViewProps {
  conferencia: Conferencia & {
    regionais: Regional[]
    _count?: {
      times: number
      jogos: number
    }
  }
  classificacao?: ClassificacaoRegional[]
  jogos?: Jogo[]
}

export interface RegionalViewProps {
  regional: Regional & {
    conferencia: Conferencia
  }
  classificacao: ClassificacaoTime[]
  jogos: Jogo[]
}

export interface PlayoffBracketViewProps {
  bracket: PlayoffBracket  // Usando a interface que já existe
  onUpdateJogo?: (jogo: PlayoffJogo) => void
}

// ==================== TYPES PARA FORMULÁRIOS ====================

export interface FormDistribuirTimes {
  [regional: string]: number[]
}

export interface FormGerarJogos {
  rodadas: number
  dataInicio: string
  intervaloEntreDatas: number
  jogosSimultaneos: boolean
}

export interface FormAtualizarPlacar {
  placarCasa: string
  placarVisitante: string
  observacoes?: string
}

