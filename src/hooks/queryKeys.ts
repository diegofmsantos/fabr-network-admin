export const queryKeys = {
  // Times - expandindo o que você já tem
  times: (temporada: string) => ['times', temporada],
  timeDetail: (id: number) => ['times', 'detail', id],
  timeJogadores: (timeId: number, temporada?: string) => ['times', timeId, 'jogadores', temporada],
  
  // Jogadores - expandindo o que você já tem  
  jogadores: (temporada: string) => ['jogadores', temporada],
  jogadorDetail: (id: number) => ['jogadores', 'detail', id],
  jogadorEstatisticas: (jogadorId: number, temporada?: string) => ['jogadores', jogadorId, 'estatisticas', temporada],
  
  // Notícias - expandindo o que você já tem
  noticias: ['noticias'],
  noticiaDetail: (id: number) => ['noticias', 'detail', id],
  
  // Campeonatos - melhorando os existentes
  campeonatos: {
    all: ['campeonatos'] as const,
    lists: () => [...queryKeys.campeonatos.all, 'list'] as const,
    list: (filters: Record<string, any>) => [...queryKeys.campeonatos.lists(), filters] as const,
    details: () => [...queryKeys.campeonatos.all, 'detail'] as const,
    detail: (id: number) => [...queryKeys.campeonatos.details(), id] as const,
    classificacao: (campeonatoId: number) => [...queryKeys.campeonatos.detail(campeonatoId), 'classificacao'] as const,
    jogos: (campeonatoId: number, filters?: Record<string, any>) => [...queryKeys.campeonatos.detail(campeonatoId), 'jogos', filters] as const,
    grupos: (campeonatoId: number) => [...queryKeys.campeonatos.detail(campeonatoId), 'grupos'] as const,
  },

  // Jogos 
  jogos: {
    all: ['jogos'] as const,
    lists: () => [...queryKeys.jogos.all, 'list'] as const,
    list: (filters: Record<string, any>) => [...queryKeys.jogos.lists(), filters] as const,
    details: () => [...queryKeys.jogos.all, 'detail'] as const,
    detail: (id: number) => [...queryKeys.jogos.details(), id] as const,
    estatisticas: (jogoId: number) => [...queryKeys.jogos.detail(jogoId), 'estatisticas'] as const,
    time: (timeId: number, limit?: number) => [...queryKeys.jogos.all, 'time', timeId, limit] as const,
  },

  // Admin/Dashboard
  admin: {
    all: ['admin'] as const,
    stats: (filters: Record<string, any>) => [...queryKeys.admin.all, 'stats', filters] as const,
    activities: () => [...queryKeys.admin.all, 'activities'] as const,
    alerts: () => [...queryKeys.admin.all, 'alerts'] as const,
  },
} as const

// Função helper para invalidação (adicione isso também)
export const invalidateHelpers = {
  temporada: (queryClient: any, temporada: string) => {
    queryClient.invalidateQueries({ queryKey: queryKeys.times(temporada) })
    queryClient.invalidateQueries({ queryKey: queryKeys.jogadores(temporada) })
  },
  
  time: (queryClient: any, timeId: number) => {
    queryClient.invalidateQueries({ queryKey: queryKeys.timeDetail(timeId) })
    queryClient.invalidateQueries({ 
      predicate: (query: any) => query.queryKey.includes('times')
    })
  },
}