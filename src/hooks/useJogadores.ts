import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { JogadoresService } from '@/services/jogadores.service'
import { queryKeys } from './queryKeys'
import { useNotifications } from './useNotifications'
import { Jogador } from '@/types'

export function useJogadores(temporada: string = '2025') {
  return useQuery({
    queryKey: queryKeys.jogadores.list(temporada),
    queryFn: () => JogadoresService.getJogadores(temporada),
    staleTime: 1000 * 60 * 3, 
    gcTime: 1000 * 60 * 10,
    retry: 2,
    refetchOnWindowFocus: false,
  })
}

export function useJogador(id: number) {
  return useQuery({
    queryKey: queryKeys.jogadores.detail(id),
    queryFn: () => JogadoresService.getJogador(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
    retry: 2,
  })
}

export function useCreateJogador() {
  const queryClient = useQueryClient()
  const notifications = useNotifications()

  return useMutation({
    mutationFn: (data: Omit<Jogador, 'id'>) => JogadoresService.createJogador(data),
    onSuccess: (newJogador) => {
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.jogadores.lists() 
      })
      
      if (newJogador.timeId) {
        queryClient.invalidateQueries({ 
          queryKey: queryKeys.times.jogadores(newJogador.timeId) 
        })
      }
      
      queryClient.setQueryData(queryKeys.jogadores.detail(newJogador.id), newJogador)
      
      notifications.success('Jogador criado!', `${newJogador.nome} foi criado com sucesso`)
    },
    onError: (error: any) => {
      notifications.error('Erro ao criar jogador', error.message || 'Tente novamente')
    },
  })
}

export function useUpdateJogador() {
  const queryClient = useQueryClient()
  const notifications = useNotifications()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Jogador> }) =>
      JogadoresService.updateJogador(id, data),
    onSuccess: (updatedJogador, { id }) => {
      queryClient.setQueryData(queryKeys.jogadores.detail(id), updatedJogador)
      
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.jogadores.lists() 
      })
      
      if (updatedJogador.timeId) {
        queryClient.invalidateQueries({ 
          queryKey: queryKeys.times.jogadores(updatedJogador.timeId) 
        })
      }
      
      notifications.success('Jogador atualizado!', `${updatedJogador.nome} foi atualizado`)
    },
    onError: (error: any) => {
      notifications.error('Erro ao atualizar jogador', error.message)
    },
  })
}

export function useDeleteJogador() {
  const queryClient = useQueryClient()
  const notifications = useNotifications()

  return useMutation({
    mutationFn: JogadoresService.deleteJogador,
    onSuccess: (_, id) => {
      queryClient.removeQueries({ 
        queryKey: queryKeys.jogadores.detail(id) 
      })
      
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.jogadores.lists() 
      })
      
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.times.all 
      })
      
      notifications.success('Jogador removido!', 'Jogador foi excluído com sucesso')
    },
    onError: (error: any) => {
      notifications.error('Erro ao remover jogador', error.message)
    },
  })
}

export function useImportarJogadores() {
  const queryClient = useQueryClient()
  const notifications = useNotifications()

  return useMutation({
    mutationFn: JogadoresService.importarJogadores,
    onSuccess: (result) => {
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.jogadores.lists() 
      })
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.times.lists() 
      })
      
      notifications.success(
        'Importação concluída!', 
        `${result.sucesso || 0} jogadores importados com sucesso`
      )
    },
    onError: (error: any) => {
      notifications.error('Erro na importação', error.message)
    },
  })
}

export function useAtualizarEstatisticas() {
  const queryClient = useQueryClient()
  const notifications = useNotifications()

  return useMutation({
    mutationFn: ({ arquivo, idJogo, dataJogo }: { arquivo: File; idJogo: string; dataJogo: string }) =>
      JogadoresService.atualizarEstatisticas(arquivo, idJogo, dataJogo),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.jogadores.lists() 
      })
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.jogos.lists() 
      })
      
      notifications.success(
        'Estatísticas atualizadas!', 
        'Estatísticas do jogo foram processadas com sucesso'
      )
    },
    onError: (error: any) => {
      notifications.error('Erro ao atualizar estatísticas', error.message)
    },
  })
}