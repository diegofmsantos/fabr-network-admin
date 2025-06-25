import { useMutation, useQueryClient } from '@tanstack/react-query'
import { BaseService } from '@/services/base.service'
import { queryKeys } from './queryKeys'
import { useNotifications } from './useNotifications'
import { IniciarTemporadaData, IniciarTemporadaResponse } from '@/types'

class TemporadaService extends BaseService {
  static async iniciarTemporada(ano: string, alteracoes: IniciarTemporadaData): Promise<IniciarTemporadaResponse> {
    const service = new TemporadaService()
    return service.post<IniciarTemporadaResponse>(`/admin/iniciar-temporada/${ano}`, alteracoes)
  }
}

export function useIniciarTemporada() {
  const queryClient = useQueryClient()
  const notifications = useNotifications()

  return useMutation({
    mutationFn: ({ ano, alteracoes }: { ano: string; alteracoes: IniciarTemporadaData }) =>
      TemporadaService.iniciarTemporada(ano, alteracoes),
    onSuccess: (result, { ano }) => {
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.times.list(ano) 
      })
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.jogadores.list(ano) 
      })
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.campeonatos.lists() 
      })
      
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.admin.all 
      })
      
      notifications.success(
        `Temporada ${ano} iniciada!`, 
        `${result.times} times e ${result.jogadores} jogadores criados. ${result.transferencias} transferências processadas.`
      )
    },
    onError: (error: any) => {
      notifications.error('Erro ao iniciar temporada', error.message || 'Verifique os dados e tente novamente')
    },
  
    meta: {
      timeout: 120000, 
    }
  })
}