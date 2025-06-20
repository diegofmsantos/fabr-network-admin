// src/hooks/useJogadores.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { JogadoresService } from '@/services/jogadores.service'
import { queryKeys } from './queryKeys'
import { useNotifications } from './useNotifications'
import { Jogador } from '@/types'

// Hook para buscar jogadores
export function useJogadores(temporada: string = '2025') {
  return useQuery({
    queryKey: queryKeys.jogadores.list(temporada),
    queryFn: () => JogadoresService.getJogadores(temporada),
    staleTime: 1000 * 60 * 3, // 3 minutos (jogadores mudam mais frequentemente)
    gcTime: 1000 * 60 * 10,
    retry: 2,
    refetchOnWindowFocus: false,
  })
}

// Hook para buscar um jogador específico
export function useJogador(id: number) {
  return useQuery({
    queryKey: queryKeys.jogadores.detail(id),
    queryFn: () => JogadoresService.getJogador(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
    retry: 2,
  })
}

// Hook para criar jogador
export function useCreateJogador() {
  const queryClient = useQueryClient()
  const notifications = useNotifications()

  return useMutation({
    mutationFn: (data: Omit<Jogador, 'id'>) => JogadoresService.createJogador(data),
    onSuccess: (newJogador) => {
      // Invalidar lista de jogadores (todas as temporadas por segurança)
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.jogadores.lists() 
      })
      
      // Invalidar jogadores do time específico se aplicável
      if (newJogador.timeId) {
        queryClient.invalidateQueries({ 
          queryKey: queryKeys.times.jogadores(newJogador.timeId) 
        })
      }
      
      // Adicionar ao cache
      queryClient.setQueryData(queryKeys.jogadores.detail(newJogador.id), newJogador)
      
      notifications.success('Jogador criado!', `${newJogador.nome} foi criado com sucesso`)
    },
    onError: (error: any) => {
      notifications.error('Erro ao criar jogador', error.message || 'Tente novamente')
    },
  })
}

// Hook para atualizar jogador
export function useUpdateJogador() {
  const queryClient = useQueryClient()
  const notifications = useNotifications()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Jogador> }) =>
      JogadoresService.updateJogador(id, data),
    onSuccess: (updatedJogador, { id }) => {
      // Atualizar cache específico
      queryClient.setQueryData(queryKeys.jogadores.detail(id), updatedJogador)
      
      // Invalidar lista de jogadores
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.jogadores.lists() 
      })
      
      // Invalidar jogadores do time se mudou de time
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

// Hook para deletar jogador
export function useDeleteJogador() {
  const queryClient = useQueryClient()
  const notifications = useNotifications()

  return useMutation({
    mutationFn: JogadoresService.deleteJogador,
    onSuccess: (_, id) => {
      // Remover do cache
      queryClient.removeQueries({ 
        queryKey: queryKeys.jogadores.detail(id) 
      })
      
      // Invalidar todas as listas de jogadores
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.jogadores.lists() 
      })
      
      // Invalidar jogadores de times
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

// Hook para importar jogadores
export function useImportarJogadores() {
  const queryClient = useQueryClient()
  const notifications = useNotifications()

  return useMutation({
    mutationFn: JogadoresService.importarJogadores,
    onSuccess: (result) => {
      // Invalidar todas as listas de jogadores e times
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

// Hook para atualizar estatísticas
export function useAtualizarEstatisticas() {
  const queryClient = useQueryClient()
  const notifications = useNotifications()

  return useMutation({
    mutationFn: ({ arquivo, idJogo, dataJogo }: { arquivo: File; idJogo: string; dataJogo: string }) =>
      JogadoresService.atualizarEstatisticas(arquivo, idJogo, dataJogo),
    onSuccess: (result) => {
      // Invalidar jogadores e jogos relacionados
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