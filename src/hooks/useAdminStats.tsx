// src/hooks/useAdminStats.ts
import { useQuery } from '@tanstack/react-query'
import { BaseService } from '@/services/base.service'
import { queryKeys } from './queryKeys'
import { AdminStats, AdminStatsParams } from '@/types'

class AdminStatsService extends BaseService {
  static async getAdminStats(params: AdminStatsParams): Promise<AdminStats> {
    const service = new AdminStatsService()
    return service.get<AdminStats>('/admin/campeonatos/estatisticas', params)
  }
}

export function useAdminStats(params?: AdminStatsParams | string) {
  // Suporte para ambos os formatos: objeto ou string (temporada)
  const queryParams = typeof params === 'string' ? { temporada: params } : params || {}

  return useQuery({
    queryKey: queryKeys.admin.stats(queryParams),
    queryFn: () => AdminStatsService.getAdminStats(queryParams),
    staleTime: 1000 * 60 * 5, // 5 minutos
    gcTime: 1000 * 60 * 10,   // 10 minutos
    retry: 2,
    refetchOnWindowFocus: false,
    
    // Tratamento de erro: se não houver rota implementada, retorna dados vazios
    throwOnError: false,
    
    // Se der erro 404, considera como dados não disponíveis
    meta: {
      errorHandler: (error: any) => {
        if (error.message?.includes('404') || error.message?.includes('não encontrado')) {
          console.warn('⚠️ Rota de estatísticas não implementada ainda no backend')
          return null
        }
        throw error
      }
    }
  })
}