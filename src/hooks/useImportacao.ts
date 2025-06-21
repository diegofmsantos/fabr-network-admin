// src/hooks/useImportacao.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ImportacaoService,} from '@/services/importacao.service'
import { queryKeys } from './queryKeys'
import { useNotifications } from './useNotifications'
import { EstatisticasResponse, ImportacaoResponse, TransferenciasResponse } from '@/types'

// ==================== HOOKS DE MUTAÇÃO PARA IMPORTAÇÃO ====================

// Hook para importar times
export function useImportarTimes() {
  const queryClient = useQueryClient()
  const notifications = useNotifications()

  return useMutation({
    mutationFn: (arquivo: File) => ImportacaoService.importarTimes(arquivo),
    onSuccess: (result: ImportacaoResponse) => {
      // Invalidar todos os caches relacionados a times
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.times.lists() 
      })
      
      // Invalidar estatísticas admin
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.admin.all 
      })
      
      // Notificação de sucesso
      notifications.success(
        'Times importados!', 
        `${result.sucesso} times processados com sucesso`
      )

      // Se houver erros, mostrar aviso
      if (result.erros && result.erros.length > 0) {
        notifications.warning(
          'Importação com avisos',
          `${result.erros.length} itens com problemas. Verifique o console.`
        )
        console.warn('Erros na importação de times:', result.erros)
      }
    },
    onError: (error: any) => {
      notifications.error(
        'Erro na importação de times', 
        error.message || 'Verifique o arquivo e tente novamente'
      )
    },
    // Timeout maior para upload de arquivos
    meta: {
      timeout: 60000, // 1 minuto
    }
  })
}

// Hook para importar jogadores
export function useImportarJogadores() {
  const queryClient = useQueryClient()
  const notifications = useNotifications()

  return useMutation({
    mutationFn: (arquivo: File) => ImportacaoService.importarJogadores(arquivo),
    onSuccess: (result: ImportacaoResponse) => {
      // Invalidar caches de jogadores e times
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.jogadores.lists() 
      })
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.times.lists() 
      })
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.admin.all 
      })
      
      notifications.success(
        'Jogadores importados!', 
        `${result.sucesso} jogadores processados com sucesso`
      )

      if (result.erros && result.erros.length > 0) {
        notifications.warning(
          'Importação com avisos',
          `${result.erros.length} jogadores com problemas. Verifique o console.`
        )
        console.warn('Erros na importação de jogadores:', result.erros)
      }
    },
    onError: (error: any) => {
      notifications.error(
        'Erro na importação de jogadores', 
        error.message || 'Verifique o arquivo e tente novamente'
      )
    },
    meta: {
      timeout: 90000, // 1.5 minutos - jogadores podem ser muitos
    }
  })
}

// Hook para atualizar estatísticas de jogo
export function useAtualizarEstatisticas() {
  const queryClient = useQueryClient()
  const notifications = useNotifications()

  return useMutation({
    mutationFn: ({ arquivo, idJogo, dataJogo }: { 
      arquivo: File
      idJogo: string
      dataJogo: string 
    }) => ImportacaoService.atualizarEstatisticas(arquivo, idJogo, dataJogo),
    
    onSuccess: (result: EstatisticasResponse) => {
      // Invalidar estatísticas dos jogadores
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.jogadores.lists() 
      })
      
      // Invalidar dados do jogo específico se soubermos o ID
      if (result.jogoId) {
        queryClient.invalidateQueries({ 
          queryKey: queryKeys.jogos.detail(parseInt(result.jogoId)) 
        })
      }
      
      // Invalidar listas de jogos
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.jogos.lists() 
      })
      
      notifications.success(
        'Estatísticas atualizadas!', 
        `${result.jogadoresAtualizados} jogadores atualizados, ${result.estatisticasProcessadas} estatísticas processadas`
      )
    },
    onError: (error: any) => {
      notifications.error(
        'Erro ao atualizar estatísticas', 
        error.message || 'Verifique o arquivo e os dados do jogo'
      )
    },
    meta: {
      timeout: 45000, // 45 segundos
    }
  })
}

// Hook para iniciar nova temporada
export function useIniciarTemporada() {
  const queryClient = useQueryClient()
  const notifications = useNotifications()

  return useMutation({
    mutationFn: ({ 
      ano, 
      alteracoes 
    }: { 
      ano: string
      alteracoes: Parameters<typeof ImportacaoService.iniciarTemporada>[1]
    }) => ImportacaoService.iniciarTemporada(ano, alteracoes),
    
    onSuccess: (result: TransferenciasResponse, { ano }) => {
      // Invalidar todos os dados da nova temporada
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.times.list(ano) 
      })
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.jogadores.list(ano) 
      })
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.campeonatos.lists() 
      })
      
      // Invalidar estatísticas admin
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.admin.all 
      })
      
      notifications.success(
        `Temporada ${ano} iniciada!`, 
        `${result.times} times e ${result.jogadores} jogadores criados. ${result.transferencias} transferências processadas.`
      )
    },
    onError: (error: any) => {
      notifications.error(
        'Erro ao iniciar temporada', 
        error.message || 'Verifique os dados e tente novamente'
      )
    },
    // Timeout maior para operação pesada
    meta: {
      timeout: 120000, // 2 minutos
    }
  })
}

// ==================== HOOKS DE QUERY PARA CONSULTAS ====================

// Hook para buscar transferências salvas
export function useTransferencias(temporadaOrigem: string, temporadaDestino: string) {
  return useQuery({
    queryKey: queryKeys.temporada.transition(temporadaOrigem, temporadaDestino),
    queryFn: () => ImportacaoService.getTransferencias(temporadaOrigem, temporadaDestino),
    enabled: !!(temporadaOrigem && temporadaDestino),
    staleTime: 1000 * 60 * 10, // 10 minutos
    retry: (failureCount, error: any) => {
      // Não tentar novamente se for 404 (arquivo não existe)
      if (error?.message?.includes('404')) return false
      return failureCount < 2
    },
    throwOnError: false, // Não quebrar se não houver transferências
  })
}

// Hook para verificar se uma temporada existe
export function useVerificarTemporada(temporada: string) {
  return useQuery({
    queryKey: [...queryKeys.temporada.all, 'verificar', temporada],
    queryFn: () => ImportacaoService.verificarTemporada(temporada),
    enabled: !!temporada,
    staleTime: 1000 * 60 * 5, // 5 minutos
    retry: false,
  })
}

// Hook para estatísticas de importação
export function useEstatisticasImportacao(temporada: string) {
  return useQuery({
    queryKey: [...queryKeys.importacao.all, 'stats', temporada],
    queryFn: () => ImportacaoService.getEstatisticasImportacao(temporada),
    enabled: !!temporada,
    staleTime: 1000 * 60 * 2, // 2 minutos
    retry: 2,
    throwOnError: false, // Pode não existir ainda
  })
}

// ==================== HOOKS DE VALIDAÇÃO (OPCIONAL) ====================

// Hook para validar planilha de times antes da importação
export function useValidarPlanilhaTimes() {
  const notifications = useNotifications()

  return useMutation({
    mutationFn: (arquivo: File) => ImportacaoService.validarPlanilhaTimes(arquivo),
    onSuccess: (result) => {
      notifications.success('Planilha válida!', 'A planilha de times está no formato correto')
    },
    onError: (error: any) => {
      notifications.error('Planilha inválida', error.message || 'Verifique o formato da planilha')
    },
  })
}

// Hook para validar planilha de jogadores antes da importação
export function useValidarPlanilhaJogadores() {
  const notifications = useNotifications()

  return useMutation({
    mutationFn: (arquivo: File) => ImportacaoService.validarPlanilhaJogadores(arquivo),
    onSuccess: (result) => {
      notifications.success('Planilha válida!', 'A planilha de jogadores está no formato correto')
    },
    onError: (error: any) => {
      notifications.error('Planilha inválida', error.message || 'Verifique o formato da planilha')
    },
  })
}