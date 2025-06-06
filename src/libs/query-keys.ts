import { useQueryClient } from "@tanstack/react-query"

export const queryKeys = {
  // Times
  times: {
    all: ['times'] as const,
    lists: () => [...queryKeys.times.all, 'list'] as const,
    list: (filters: Record<string, any>) => [...queryKeys.times.lists(), filters] as const,
    details: () => [...queryKeys.times.all, 'detail'] as const,
    detail: (id: number) => [...queryKeys.times.details(), id] as const,
    jogadores: (timeId: number, temporada?: string) => 
      [...queryKeys.times.detail(timeId), 'jogadores', temporada] as const,
  },

  // Jogadores
  jogadores: {
    all: ['jogadores'] as const,
    lists: () => [...queryKeys.jogadores.all, 'list'] as const,
    list: (filters: Record<string, any>) => [...queryKeys.jogadores.lists(), filters] as const,
    details: () => [...queryKeys.jogadores.all, 'detail'] as const,
    detail: (id: number) => [...queryKeys.jogadores.details(), id] as const,
    estatisticas: (jogadorId: number, temporada?: string) => 
      [...queryKeys.jogadores.detail(jogadorId), 'estatisticas', temporada] as const,
    historico: (jogadorId: number) => 
      [...queryKeys.jogadores.detail(jogadorId), 'historico'] as const,
  },

  // Campeonatos
  campeonatos: {
    all: ['campeonatos'] as const,
    lists: () => [...queryKeys.campeonatos.all, 'list'] as const,
    list: (filters: Record<string, any>) => [...queryKeys.campeonatos.lists(), filters] as const,
    details: () => [...queryKeys.campeonatos.all, 'detail'] as const,
    detail: (id: number) => [...queryKeys.campeonatos.details(), id] as const,
    classificacao: (campeonatoId: number) => 
      [...queryKeys.campeonatos.detail(campeonatoId), 'classificacao'] as const,
    jogos: (campeonatoId: number, filters?: Record<string, any>) => 
      [...queryKeys.campeonatos.detail(campeonatoId), 'jogos', filters] as const,
    grupos: (campeonatoId: number) => 
      [...queryKeys.campeonatos.detail(campeonatoId), 'grupos'] as const,
  },

  // Jogos
  jogos: {
    all: ['jogos'] as const,
    lists: () => [...queryKeys.jogos.all, 'list'] as const,
    list: (filters: Record<string, any>) => [...queryKeys.jogos.lists(), filters] as const,
    details: () => [...queryKeys.jogos.all, 'detail'] as const,
    detail: (id: number) => [...queryKeys.jogos.details(), id] as const,
    estatisticas: (jogoId: number) => 
      [...queryKeys.jogos.detail(jogoId), 'estatisticas'] as const,
    proximos: (timeId: number, limit?: number) => 
      [...queryKeys.jogos.all, 'proximos', timeId, limit] as const,
    resultados: (timeId: number, limit?: number) => 
      [...queryKeys.jogos.all, 'resultados', timeId, limit] as const,
  },

  // Materias/Notícias
  materias: {
    all: ['materias'] as const,
    lists: () => [...queryKeys.materias.all, 'list'] as const,
    list: (filters: Record<string, any>) => [...queryKeys.materias.lists(), filters] as const,
    details: () => [...queryKeys.materias.all, 'detail'] as const,
    detail: (id: number) => [...queryKeys.materias.details(), id] as const,
  },

  // Admin/Dashboard
  admin: {
    all: ['admin'] as const,
    stats: (filters: Record<string, any>) => [...queryKeys.admin.all, 'stats', filters] as const,
    activities: () => [...queryKeys.admin.all, 'activities'] as const,
    alerts: () => [...queryKeys.admin.all, 'alerts'] as const,
  },

  // Temporadas
  temporadas: {
    all: ['temporadas'] as const,
    list: () => [...queryKeys.temporadas.all, 'list'] as const,
    current: () => [...queryKeys.temporadas.all, 'current'] as const,
  },
} as const

// Utility functions para invalidação em massa
export const invalidateQueries = {
  // Invalidar todos os dados de uma temporada
  temporada: (queryClient: any, temporada: string) => {
    queryClient.invalidateQueries({ 
      predicate: (query: any) => {
        return query.queryKey.some((key: any) => 
          typeof key === 'object' && key?.temporada === temporada
        )
      }
    })
  },

  // Invalidar todos os dados de um time
  time: (queryClient: any, timeId: number) => {
    queryClient.invalidateQueries({ queryKey: queryKeys.times.detail(timeId) })
    queryClient.invalidateQueries({ 
      predicate: (query: any) => {
        return query.queryKey.includes('times') || 
               query.queryKey.some((key: any) => 
                 typeof key === 'object' && key?.timeId === timeId
               )
      }
    })
  },

  // Invalidar todos os dados de um jogador
  jogador: (queryClient: any, jogadorId: number) => {
    queryClient.invalidateQueries({ queryKey: queryKeys.jogadores.detail(jogadorId) })
    queryClient.invalidateQueries({ 
      predicate: (query: any) => {
        return query.queryKey.includes('jogadores') ||
               query.queryKey.some((key: any) => 
                 typeof key === 'object' && key?.jogadorId === jogadorId
               )
      }
    })
  },

  // Invalidar todos os dados de um campeonato
  campeonato: (queryClient: any, campeonatoId: number) => {
    queryClient.invalidateQueries({ queryKey: queryKeys.campeonatos.detail(campeonatoId) })
    queryClient.invalidateQueries({ 
      predicate: (query: any) => {
        return query.queryKey.includes('campeonatos') ||
               query.queryKey.includes('jogos') ||
               query.queryKey.some((key: any) => 
                 typeof key === 'object' && key?.campeonatoId === campeonatoId
               )
      }
    })
  },

  // Invalidar tudo (usar com cuidado)
  all: (queryClient: any) => {
    queryClient.invalidateQueries()
  },
}

// Hook para facilitar invalidações
export function useInvalidateQueries() {
  const queryClient = useQueryClient()

  return {
    temporada: (temporada: string) => invalidateQueries.temporada(queryClient, temporada),
    time: (timeId: number) => invalidateQueries.time(queryClient, timeId),
    jogador: (jogadorId: number) => invalidateQueries.jogador(queryClient, jogadorId),
    campeonato: (campeonatoId: number) => invalidateQueries.campeonato(queryClient, campeonatoId),
    all: () => invalidateQueries.all(queryClient),
  }
}

// Type utilities para query keys
export type QueryKeys = typeof queryKeys
export type TimeQueryKeys = typeof queryKeys.times
export type JogadorQueryKeys = typeof queryKeys.jogadores
export type CampeonatoQueryKeys = typeof queryKeys.campeonatos