import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ImportacaoService, } from '@/services/importacao.service'
import { queryKeys } from './queryKeys'
import { useNotifications } from './useNotifications'

export interface ImportResult {
  sucesso?: number
  erros?: any[]
  jogoId?: string
  jogadoresAtualizados?: number
  estatisticasProcessadas?: number
  times?: number
  jogadores?: number
}

export function useImportarTimes() {
  const queryClient = useQueryClient()
  const notifications = useNotifications()

  return useMutation({
    mutationFn: (arquivo: File) => ImportacaoService.importarTimes(arquivo),
    onSuccess: (result: ImportResult) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.times.lists()
      })

      queryClient.invalidateQueries({
        queryKey: queryKeys.admin.all
      })

      notifications.success(
        'Times importados!',
        `${result.sucesso || 0} times processados com sucesso`
      )

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
    meta: {
      timeout: 60000,
    }
  })
}

export function useImportarJogadores() {
  const queryClient = useQueryClient()
  const notifications = useNotifications()

  return useMutation({
    mutationFn: (arquivo: File) => ImportacaoService.importarJogadores(arquivo),
    onSuccess: (result: ImportResult) => {
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
      timeout: 90000,
    }
  })
}

export function useAtualizarEstatisticas() {
  const queryClient = useQueryClient()
  const notifications = useNotifications()

  return useMutation({
    mutationFn: ({ arquivo, idJogo, dataJogo }: {
      arquivo: File
      idJogo: string
      dataJogo: string
    }) => ImportacaoService.atualizarEstatisticas(arquivo, idJogo, dataJogo),

    onSuccess: (result: ImportResult) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.jogadores.lists()
      })

      if (result.jogoId) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.jogos.detail(parseInt(result.jogoId))
        })
      }

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
      timeout: 45000,
    }
  })
}

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

    onSuccess: (result: ImportResult, { ano }) => {
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
        `${result.times || 0} times e ${result.jogadores || 0} jogadores criados.`
      )
    },
    onError: (error: any) => {
      notifications.error(
        'Erro ao iniciar temporada',
        error.message || 'Verifique os dados e tente novamente'
      )
    },
    meta: {
      timeout: 120000,
    }
  })
}

export function useTransferencias(temporadaOrigem: string, temporadaDestino: string) {
  return useQuery({
    queryKey: queryKeys.temporada.transition(temporadaOrigem, temporadaDestino),
    queryFn: () => ImportacaoService.getTransferencias(temporadaOrigem, temporadaDestino),
    enabled: !!(temporadaOrigem && temporadaDestino),
    staleTime: 1000 * 60 * 10,
    retry: (failureCount, error: any) => {
      if (error?.message?.includes('404')) return false
      return failureCount < 2
    },
    throwOnError: false,
  })
}

export function useVerificarTemporada(temporada: string) {
  return useQuery({
    queryKey: [...queryKeys.temporada.all, 'verificar', temporada],
    queryFn: () => ImportacaoService.verificarTemporada(temporada),
    enabled: !!temporada,
    staleTime: 1000 * 60 * 5,
    retry: false,
  })
}

export function useEstatisticasImportacao(temporada: string) {
  return useQuery({
    queryKey: [...queryKeys.importacao.all, 'stats', temporada],
    queryFn: () => ImportacaoService.getEstatisticasImportacao(temporada),
    enabled: !!temporada,
    staleTime: 1000 * 60 * 2,
    retry: 2,
    throwOnError: false,
  })
}

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

export function useImportarAgendaJogos() {
  const queryClient = useQueryClient()
  const notifications = useNotifications()

  return useMutation({
    mutationFn: (arquivo: File) => ImportacaoService.importarAgendaJogos(arquivo),
    onSuccess: (result: ImportResult) => {
      notifications.success(
        'Agenda importada!',
        `${result.sucesso || 0} jogos cadastrados com sucesso`
      )

      queryClient.invalidateQueries({ queryKey: ['jogos'] })
      queryClient.invalidateQueries({ queryKey: ['superliga'] })
      queryClient.invalidateQueries({ queryKey: ['campeonatos'] })
    },
    onError: (error: any) => {
      notifications.error(
        'Erro na importação da agenda',
        error.message || 'Verifique o formato da planilha e tente novamente'
      )
    },
    meta: {
      timeout: 30000,
    }
  })
}

export function useImportarResultados() {
  const queryClient = useQueryClient()
  const notifications = useNotifications()

  return useMutation({
    mutationFn: (arquivo: File) => ImportacaoService.importarResultados(arquivo),
    onSuccess: (result: ImportResult) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.jogos.lists()
      })
      queryClient.invalidateQueries({
        queryKey: queryKeys.admin.all
      })

      notifications.success(
        'Resultados importados!',
        `${result.sucesso || 0} jogos atualizados com sucesso`
      )

      if (result.erros && result.erros.length > 0) {
        notifications.warning(
          'Importação com avisos',
          `${result.erros.length} jogos com problemas. Verifique o console.`
        )
        console.warn('Erros na importação de resultados:', result.erros)
      }
    },
    onError: (error: any) => {
      notifications.error(
        'Erro na importação de resultados',
        error.message || 'Verifique o arquivo e tente novamente'
      )
    },
    meta: {
      timeout: 60000,
    }
  })
}

export function useResetDatabase() {
  const queryClient = useQueryClient()
  const notifications = useNotifications()

  return useMutation({
    mutationFn: () => ImportacaoService.resetDatabase(),
    onSuccess: (result) => {
      // Limpar todos os caches
      queryClient.clear()

      // Invalidar queries específicas
      queryClient.invalidateQueries({
        queryKey: queryKeys.times.all
      })
      queryClient.invalidateQueries({
        queryKey: queryKeys.jogadores.all
      })
      queryClient.invalidateQueries({
        queryKey: queryKeys.campeonatos.all
      })
      queryClient.invalidateQueries({
        queryKey: queryKeys.jogos.all
      })
      queryClient.invalidateQueries({
        queryKey: queryKeys.materias.all
      })
      queryClient.invalidateQueries({
        queryKey: queryKeys.admin.all
      })

      if (result.success) {
        notifications.success(
          'Banco resetado com sucesso!',
          result.message
        )
      } else {
        notifications.warning(
          'Reset concluído com avisos',
          result.warnings || 'Alguns dados podem não ter sido removidos'
        )
      }
    },
    onError: (error: any) => {
      notifications.error(
        'Erro ao resetar banco',
        error.message || 'Tente novamente ou verifique os logs'
      )
    },
    meta: {
      timeout: 60000, // 1 minuto
    }
  })
}