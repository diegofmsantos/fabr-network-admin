"use client"

import { useQuery } from '@tanstack/react-query'

interface AdminStatsParams {
  temporada?: string
  period?: string
}

interface AdminStats {
  // Estatísticas principais
  totalCampeonatos: number
  campeonatosAtivos: number
  jogosAgendados: number
  jogosFinalizados: number
  timesAtivos: number
  timesParticipantes: number
  jogosEstaSemana: number;

  // Métricas de crescimento
  crescimentoCampeonatos: number
  novosTimes: number
  melhoriaOperacional: number
  taxaConclusao: number

  // Dados para gráficos
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

  // Atividades e alertas
  atividadesRecentes: Array<{
    id: string
    tipo: 'campeonato_criado' | 'jogo_finalizado' | 'classificacao_atualizada'
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

  // Top performers
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

  // Métricas detalhadas
  mediaJogosPorCampeonato: number
  tempoMedioDuracao: number
  taxaAdiamentos: number
  mediaGruposPorCampeonato: number
  participacaoMedia: number
  pontuacaoMedia: number

  // Atividades recentes
  recentActivities: Array<{
    id: string
    type: string
    message: string
    timestamp: string
    user?: string
  }>

  // Alertas do sistema
  alerts: string[]
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export function useAdminStats(params?: AdminStatsParams | string) {
  // Suporte para ambos os formatos: objeto ou string (temporada)
  const queryParams = typeof params === 'string' ? { temporada: params } : params || {}

  return useQuery({
    queryKey: ['adminStats', queryParams],
    queryFn: async (): Promise<AdminStats> => {
      const searchParams = new URLSearchParams()

      if (queryParams.temporada) {
        searchParams.append('temporada', queryParams.temporada)
      }
      if (queryParams.period) {
        searchParams.append('period', queryParams.period)
      }

      const url = `${API_BASE_URL}/admin/stats${searchParams.toString() ? `?${searchParams.toString()}` : ''}`
      const response = await fetch(url)

      if (!response.ok) {
        throw new Error('Erro ao buscar estatísticas admin')
      }

      const data = await response.json()

      // Se a API não estiver implementada, retornar dados mockados
      if (response.status === 404 || !data) {
        return getMockAdminStats(queryParams.temporada || '2025')
      }

      return data
    },
    staleTime: 1000 * 60 * 5, // 5 minutos
    gcTime: 1000 * 60 * 10,   // 10 minutos
  })
}

// Dados mockados para desenvolvimento
function getMockAdminStats(temporada: string): AdminStats {
  const isCurrent = temporada === '2025'

  return {
    // Estatísticas principais
    totalCampeonatos: isCurrent ? 8 : 6,
    campeonatosAtivos: isCurrent ? 3 : 0,
    jogosAgendados: isCurrent ? 45 : 0,
    jogosFinalizados: isCurrent ? 120 : 180,
    timesAtivos: isCurrent ? 32 : 28,
    timesParticipantes: isCurrent ? 32 : 28,
    jogosEstaSemana: isCurrent ? 8 : 0,

    // Métricas de crescimento
    crescimentoCampeonatos: isCurrent ? 25 : 0,
    novosTimes: isCurrent ? 4 : 0,
    melhoriaOperacional: isCurrent ? 15 : 0,
    taxaConclusao: isCurrent ? 85 : 100,

    // Dados para gráficos
    campeonatosPorStatus: [
      { status: 'Não Iniciado', quantidade: isCurrent ? 2 : 0, cor: '#9CA3AF' },
      { status: 'Em Andamento', quantidade: isCurrent ? 3 : 0, cor: '#10B981' },
      { status: 'Finalizado', quantidade: isCurrent ? 3 : 6, cor: '#3B82F6' }
    ],

    jogosPorMes: [
      { mes: 'Jan', jogos: 25, finalizados: 25 },
      { mes: 'Fev', jogos: 30, finalizados: 28 },
      { mes: 'Mar', jogos: 35, finalizados: 32 },
      { mes: 'Abr', jogos: 40, finalizados: 35 },
      { mes: 'Mai', jogos: 38, finalizados: 30 },
      { mes: 'Jun', jogos: 42, finalizados: isCurrent ? 25 : 42 }
    ],

    evolucaoCampeonatos: [
      { data: '2024-01', total: 1, ativos: 1 },
      { data: '2024-03', total: 2, ativos: 2 },
      { data: '2024-06', total: 4, ativos: 3 },
      { data: '2024-09', total: 6, ativos: 2 },
      { data: '2025-01', total: isCurrent ? 7 : 6, ativos: isCurrent ? 2 : 0 },
      { data: '2025-03', total: isCurrent ? 8 : 6, ativos: isCurrent ? 3 : 0 }
    ],

    statusJogos: [
      { status: 'Agendados', quantidade: isCurrent ? 45 : 0, porcentagem: isCurrent ? 27 : 0 },
      { status: 'Finalizados', quantidade: isCurrent ? 120 : 180, porcentagem: isCurrent ? 73 : 100 },
      { status: 'Ao Vivo', quantidade: isCurrent ? 0 : 0, porcentagem: 0 },
      { status: 'Adiados', quantidade: isCurrent ? 2 : 0, porcentagem: isCurrent ? 1 : 0 }
    ],

    performancePorTipo: [
      { tipo: 'Regular', quantidade: isCurrent ? 6 : 4, media: 85 },
      { tipo: 'Playoffs', quantidade: isCurrent ? 1 : 1, media: 92 },
      { tipo: 'Copa', quantidade: isCurrent ? 1 : 1, media: 78 }
    ],

    participacaoRegional: [
      { regiao: 'Sudeste', times: 12, porcentagem: 37.5 },
      { regiao: 'Sul', times: 8, porcentagem: 25 },
      { regiao: 'Nordeste', times: 6, porcentagem: 18.75 },
      { regiao: 'Centro-Oeste', times: 4, porcentagem: 12.5 },
      { regiao: 'Norte', times: 2, porcentagem: 6.25 }
    ],

    tendenciaMensal: [
      { mes: 'Jan', valor: 85, variacao: 5 },
      { mes: 'Fev', valor: 88, variacao: 3 },
      { mes: 'Mar', valor: 92, variacao: 4 },
      { mes: 'Abr', valor: 87, variacao: -5 },
      { mes: 'Mai', valor: 90, variacao: 3 },
      { mes: 'Jun', valor: isCurrent ? 93 : 89, variacao: isCurrent ? 3 : -1 }
    ],

    // Atividades recentes
    atividadesRecentes: [
      {
        id: '1',
        tipo: 'jogo_finalizado',
        titulo: 'Jogo Finalizado',
        descricao: 'Flamengo 28 x 14 Vasco - Brasileirão 2025',
        data: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 min atrás
        usuario: 'Admin'
      },
      {
        id: '2',
        tipo: 'campeonato_criado',
        titulo: 'Novo Campeonato',
        descricao: 'Copa do Nordeste 2025 foi criada',
        data: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2h atrás
        usuario: 'Admin'
      },
      {
        id: '3',
        tipo: 'classificacao_atualizada',
        titulo: 'Classificação Atualizada',
        descricao: 'Tabela do Grupo A foi recalculada',
        data: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(), // 4h atrás
        usuario: 'Sistema'
      }
    ],

    // Alertas
    alertas: isCurrent ? [
      {
        id: '1',
        titulo: 'Jogos Pendentes',
        descricao: '3 jogos agendados para hoje precisam de confirmação',
        prioridade: 'alta',
        tipo: 'warning',
        data: new Date().toISOString()
      },
      {
        id: '2',
        titulo: 'Classificação Pendente',
        descricao: 'Grupo B precisa de recálculo manual',
        prioridade: 'media',
        tipo: 'info',
        data: new Date().toISOString()
      }
    ] : [],

    // Top performers
    topCampeonatos: [
      { id: 1, nome: 'Brasileirão 2025', jogos: 85, times: 16, popularidade: 95 },
      { id: 2, nome: 'Copa do Brasil 2025', jogos: 42, times: 12, popularidade: 88 },
      { id: 3, nome: 'Regional Sul 2025', jogos: 38, times: 8, popularidade: 82 }
    ],

    topTimes: [
      { id: 1, nome: 'Flamengo Imperadores', campeonatos: 3, vitorias: 12, pontos: 285 },
      { id: 2, nome: 'Corinthians Steamrollers', campeonatos: 2, vitorias: 10, pontos: 245 },
      { id: 3, nome: 'Galo FA', campeonatos: 2, vitorias: 9, pontos: 220 }
    ],

    topRegioes: [
      { nome: 'Sudeste', times: 12, campeonatos: 6, crescimento: 15 },
      { nome: 'Sul', times: 8, campeonatos: 4, crescimento: 25 },
      { nome: 'Nordeste', times: 6, campeonatos: 3, crescimento: 20 }
    ],

    // Métricas detalhadas
    mediaJogosPorCampeonato: isCurrent ? 21 : 30,
    tempoMedioDuracao: isCurrent ? 45 : 60,
    taxaAdiamentos: isCurrent ? 1.2 : 0.8,
    mediaGruposPorCampeonato: 4,
    participacaoMedia: isCurrent ? 8 : 7,
    pontuacaoMedia: isCurrent ? 24 : 28,

    // Atividades recentes (formato alternativo)
    recentActivities: [
      {
        id: '1',
        type: 'game_finished',
        message: 'Jogo finalizado: Flamengo 28 x 14 Vasco',
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        user: 'Admin'
      },
      {
        id: '2',
        type: 'championship_created',
        message: 'Novo campeonato criado: Copa do Nordeste 2025',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        user: 'Admin'
      }
    ],

    // Alertas do sistema (formato alternativo)
    alerts: isCurrent ? [
      '3 jogos agendados para hoje precisam de confirmação',
      'Grupo B precisa de recálculo de classificação',
      '2 times não confirmaram presença no próximo campeonato'
    ] : []
  }
}