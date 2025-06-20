// src/hooks/queryKeys.ts
export const queryKeys = {
  // TIMES
  times: {
    all: ['times'] as const,
    lists: () => [...queryKeys.times.all, 'list'] as const,
    list: (temporada: string) => [...queryKeys.times.lists(), temporada] as const,
    details: () => [...queryKeys.times.all, 'detail'] as const,
    detail: (id: number) => [...queryKeys.times.details(), id] as const,
    jogadores: (timeId: number, temporada?: string) => 
      [...queryKeys.times.detail(timeId), 'jogadores', temporada] as const,
  },

  // JOGADORES
  jogadores: {
    all: ['jogadores'] as const,
    lists: () => [...queryKeys.jogadores.all, 'list'] as const,
    list: (temporada: string) => [...queryKeys.jogadores.lists(), temporada] as const,
    details: () => [...queryKeys.jogadores.all, 'detail'] as const,
    detail: (id: number) => [...queryKeys.jogadores.details(), id] as const,
    estatisticas: (jogadorId: number, temporada?: string) => 
      [...queryKeys.jogadores.detail(jogadorId), 'estatisticas', temporada] as const,
  },

  // CAMPEONATOS
  campeonatos: {
    all: ['campeonatos'] as const,
    lists: () => [...queryKeys.campeonatos.all, 'list'] as const,
    list: (filters: Record<string, any>) => [...queryKeys.campeonatos.lists(), filters] as const,
    details: () => [...queryKeys.campeonatos.all, 'detail'] as const,
    detail: (id: number) => [...queryKeys.campeonatos.details(), id] as const,
    grupos: (campeonatoId: number) => 
      [...queryKeys.campeonatos.detail(campeonatoId), 'grupos'] as const,
    proximosJogos: (campeonatoId: number, limit?: number) => 
      [...queryKeys.campeonatos.detail(campeonatoId), 'proximos', limit] as const,
    ultimosResultados: (campeonatoId: number, limit?: number) => 
      [...queryKeys.campeonatos.detail(campeonatoId), 'resultados', limit] as const,
  },

  // JOGOS
  jogos: {
    all: ['jogos'] as const,
    lists: () => [...queryKeys.jogos.all, 'list'] as const,
    list: (filters: Record<string, any>) => [...queryKeys.jogos.lists(), filters] as const,
    details: () => [...queryKeys.jogos.all, 'detail'] as const,
    detail: (id: number) => [...queryKeys.jogos.details(), id] as const,
    estatisticas: (jogoId: number) => 
      [...queryKeys.jogos.detail(jogoId), 'estatisticas'] as const,
  },

  // CLASSIFICAÇÃO
  classificacao: {
    all: ['classificacao'] as const,
    campeonato: (campeonatoId: number) => 
      [...queryKeys.classificacao.all, 'campeonato', campeonatoId] as const,
    grupo: (grupoId: number) => 
      [...queryKeys.classificacao.all, 'grupo', grupoId] as const,
  },

  // GRUPOS
  grupos: {
    all: ['grupos'] as const,
    list: (campeonatoId: number) => [...queryKeys.grupos.all, 'list', campeonatoId] as const,
    detail: (id: number) => [...queryKeys.grupos.all, 'detail', id] as const,
  },

  // ADMIN/ESTATÍSTICAS
  admin: {
    all: ['admin'] as const,
    stats: (params: Record<string, any>) => [...queryKeys.admin.all, 'stats', params] as const,
    dashboard: (temporada: string) => [...queryKeys.admin.all, 'dashboard', temporada] as const,
  },

  // IMPORTAÇÃO
  importacao: {
    all: ['importacao'] as const,
    times: ['importacao', 'times'] as const,
    jogadores: ['importacao', 'jogadores'] as const,
    estatisticas: ['importacao', 'estatisticas'] as const,
  },

  // TEMPORADA
  temporada: {
    all: ['temporada'] as const,
    current: (temporada: string) => [...queryKeys.temporada.all, 'current', temporada] as const,
    transition: (from: string, to: string) => 
      [...queryKeys.temporada.all, 'transition', from, to] as const,
  },

  // MATÉRIAS/NOTÍCIAS
  materias: {
    all: ['materias'] as const,
    lists: () => [...queryKeys.materias.all, 'list'] as const,
    detail: (id: number) => [...queryKeys.materias.all, 'detail', id] as const,
  },
}