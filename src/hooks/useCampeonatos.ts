"use client"

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Campeonato, Jogo, ClassificacaoGrupo, FiltroJogos, CriarCampeonatoRequest } from '@/types/campeonato'
import { useNotifications } from '@/hooks/useNotifications'
import { handleApiError } from '@/utils/errorHandler'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

// Query Keys
export const campeonatoQueryKeys = {
  all: ['campeonatos'] as const,
  lists: () => [...campeonatoQueryKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...campeonatoQueryKeys.lists(), filters] as const,
  details: () => [...campeonatoQueryKeys.all, 'detail'] as const,
  detail: (id: number) => [...campeonatoQueryKeys.details(), id] as const,
  jogos: (filters: FiltroJogos) => [...campeonatoQueryKeys.all, 'jogos', filters] as const,
  classificacao: (campeonatoId: number) => [...campeonatoQueryKeys.all, 'classificacao', campeonatoId] as const,
  proximosJogos: (campeonatoId: number) => [...campeonatoQueryKeys.all, 'proximos', campeonatoId] as const,
  ultimosResultados: (campeonatoId: number) => [...campeonatoQueryKeys.all, 'resultados', campeonatoId] as const,
}

// ✅ CORREÇÃO: Hook para listar campeonatos
export function useCampeonatos(filters?: { temporada?: string; tipo?: string; status?: string }) {
  return useQuery({
    queryKey: campeonatoQueryKeys.list(filters || {}),
    queryFn: async (): Promise<Campeonato[]> => {
      const params = new URLSearchParams()
      if (filters?.temporada) params.append('temporada', filters.temporada)
      if (filters?.tipo) params.append('tipo', filters.tipo)
      if (filters?.status) params.append('status', filters.status)

      // ✅ URL CORRIGIDA - adicionando /campeonatos no path
      const url = `${API_BASE_URL}/campeonatos/campeonatos${params.toString() ? `?${params.toString()}` : ''}`
      
      console.log('🔍 URL de busca:', url) // Para debug
      
      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error(`Erro ao buscar campeonatos: ${response.status}`)
      }
      
      return response.json()
    },
    staleTime: 1000 * 60 * 5,
  })
}

// ✅ CORREÇÃO: useCampeonato (campeonato específico)
export function useCampeonato(id: number) {
  return useQuery({
    queryKey: campeonatoQueryKeys.detail(id),
    queryFn: async (): Promise<Campeonato> => {
      // ✅ URL CORRIGIDA
      const response = await fetch(`${API_BASE_URL}/campeonatos/campeonatos/${id}`)
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Campeonato não encontrado')
        }
        throw new Error(`Erro ao buscar campeonato: ${response.status}`)
      }
      
      return response.json()
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  })
}


// ✅ CORREÇÃO: useClassificacao
export function useClassificacao(campeonatoId: number) {
  return useQuery({
    queryKey: campeonatoQueryKeys.classificacao(campeonatoId),
    queryFn: async (): Promise<ClassificacaoGrupo[]> => {
      // ✅ URL CORRIGIDA para classificação
      const response = await fetch(`${API_BASE_URL}/campeonatos/classificacao/campeonato/${campeonatoId}`)
      
      if (!response.ok) {
        throw new Error(`Erro ao buscar classificação: ${response.status}`)
      }
      
      return response.json()
    },
    enabled: !!campeonatoId,
    staleTime: 1000 * 60 * 5,
  })
}

// ✅ CORREÇÃO: useCreateCampeonato
export function useCreateCampeonato() {
  const queryClient = useQueryClient()
  const notifications = useNotifications()

  return useMutation({
    mutationFn: async (data: CriarCampeonatoRequest): Promise<Campeonato> => {
      // ✅ URL CORRIGIDA para criação
      const response = await fetch(`${API_BASE_URL}/campeonatos/campeonatos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json().catch(() => ({}))
        throw handleApiError({ response, message: error.message })
      }

      return response.json()
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: campeonatoQueryKeys.lists() })
      notifications.success(
        'Campeonato criado!', 
        `${data.nome} foi criado com sucesso`
      )
    },
    onError: (error) => {
      notifications.error(
        'Erro ao criar campeonato', 
        error.message || 'Tente novamente'
      )
    },
  })
}

export function useUpdateCampeonato() {
  const queryClient = useQueryClient()
  const notifications = useNotifications()

  return useMutation({
    mutationFn: async ({ 
      id, 
      data 
    }: { 
      id: number; 
      data: Partial<Campeonato> 
    }): Promise<Campeonato> => {
      const response = await fetch(`${API_BASE_URL}/campeonatos/campeonatos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json().catch(() => ({}))
        throw handleApiError({ response, message: error.message })
      }

      return response.json()
    },
    onSuccess: (data, { id }) => {
      // Atualizar cache do campeonato específico
      queryClient.setQueryData(campeonatoQueryKeys.detail(id), data)
      
      // Invalidar listas relacionadas
      queryClient.invalidateQueries({ queryKey: campeonatoQueryKeys.lists() })
      
      notifications.success(
        'Campeonato atualizado!', 
        `${data.nome} foi atualizado com sucesso`
      )
    },
    onError: (error) => {
      notifications.error(
        'Erro ao atualizar campeonato', 
        error.message || 'Verifique os dados e tente novamente'
      )
    }
  })
}

// ===== CORREÇÃO 8: useDeleteCampeonato =====
// src/hooks/useDeleteCampeonato.ts
export function useDeleteCampeonato() {
  const queryClient = useQueryClient()
  const notifications = useNotifications()

  return useMutation({
    mutationFn: async (campeonatoId: number): Promise<void> => {
      // ✅ CORRIGIR ROTA DE DELETE:
      const response = await fetch(`${API_BASE_URL}/campeonatos/campeonatos/${campeonatoId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      })

      if (!response.ok) {
        throw handleApiError({ response })
      }
    },
    onSuccess: (_, campeonatoId) => {
      queryClient.invalidateQueries({ queryKey: campeonatoQueryKeys.lists() })
      queryClient.removeQueries({ queryKey: campeonatoQueryKeys.detail(campeonatoId) })
      
      notifications.success(
        'Campeonato excluído!', 
        'O campeonato foi removido permanentemente'
      )
    },
    onError: (error) => {
      notifications.error(
        'Erro ao excluir campeonato', 
        error.message || 'Verifique se o campeonato não possui jogos associados'
      )
    }
  })
}

// Hook para classificação de um grupo específico
export function useClassificacaoGrupo(grupoId: number) {
  return useQuery({
    queryKey: [...campeonatoQueryKeys.all, 'classificacao-grupo', grupoId] as const,
    queryFn: async (): Promise<ClassificacaoGrupo[]> => {
      const response = await fetch(`${API_BASE_URL}/campeonatos/classificacao/grupo/${grupoId}`)
      
      if (!response.ok) {
        throw new Error('Erro ao buscar classificação do grupo')
      }
      
      return response.json()
    },
    enabled: !!grupoId,
    staleTime: 1000 * 60 * 5, // 5 minutos
  })
}

// ===========================================
// HOOKS DE CRUD PARA GRUPOS
// ===========================================

// Criar novo grupo
export function useCreateGrupo() {
  const queryClient = useQueryClient()
  const notifications = useNotifications()

  return useMutation({
    mutationFn: async (data: {
      nome: string;
      campeonatoId: number;
      ordem?: number;
      times?: number[];
    }): Promise<any> => {
      const response = await fetch(`${API_BASE_URL}/campeonatos/grupos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json().catch(() => ({}))
        throw handleApiError({ response, message: error.message })
      }

      return response.json()
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: campeonatoQueryKeys.detail(data.campeonatoId) })
      
      notifications.success(
        'Grupo criado!',
        `O grupo ${data.nome} foi criado com sucesso`
      )
    },
    onError: (error) => {
      notifications.error(
        'Erro ao criar grupo',
        error.message || 'Verifique os dados e tente novamente'
      )
    },
  })
}

// Atualizar grupo
export function useUpdateGrupo() {
  const queryClient = useQueryClient()
  const notifications = useNotifications()

  return useMutation({
    mutationFn: async ({ 
      id, 
      data 
    }: { 
      id: number; 
      data: {
        nome?: string;
        ordem?: number;
        times?: number[];
      }
    }): Promise<any> => {
      const response = await fetch(`${API_BASE_URL}/campeonatos/grupos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw handleApiError({ response })
      }

      return response.json()
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: campeonatoQueryKeys.detail(data.campeonatoId) })
      
      notifications.success(
        'Grupo atualizado!',
        `O grupo foi atualizado com sucesso`
      )
    },
    onError: (error) => {
      notifications.error(
        'Erro ao atualizar grupo',
        error.message || 'Tente novamente'
      )
    }
  })
}

// Deletar grupo
export function useDeleteGrupo() {
  const queryClient = useQueryClient()
  const notifications = useNotifications()

  return useMutation({
    mutationFn: async (grupoId: number): Promise<void> => {
      const response = await fetch(`${API_BASE_URL}/campeonatos/grupos/${grupoId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      })

      if (!response.ok) {
        throw handleApiError({ response })
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: campeonatoQueryKeys.lists() })
      
      notifications.success(
        'Grupo excluído!',
        'O grupo foi removido do campeonato'
      )
    },
    onError: (error) => {
      notifications.error(
        'Erro ao excluir grupo',
        error.message || 'Verifique se o grupo não possui jogos associados'
      )
    }
  })
}

// ===========================================
// HOOKS DE OPERAÇÕES EM MASSA
// ===========================================

// Bulk delete campeonatos
export function useBulkDeleteCampeonatos() {
  const queryClient = useQueryClient()
  const notifications = useNotifications()

  return useMutation({
    mutationFn: async (campeonatoIds: number[]): Promise<void> => {
      const response = await fetch(`${API_BASE_URL}/admin/campeonatos/bulk-delete`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ids: campeonatoIds })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || 'Erro ao excluir campeonatos')
      }

      return response.json()
    },
    onSuccess: (_, campeonatoIds) => {
      // Invalidar todas as queries relacionadas
      queryClient.invalidateQueries({ queryKey: campeonatoQueryKeys.lists() })
      
      // Remover cada campeonato do cache
      campeonatoIds.forEach(id => {
        queryClient.removeQueries({ queryKey: campeonatoQueryKeys.detail(id) })
        queryClient.removeQueries({ queryKey: campeonatoQueryKeys.jogos({ campeonatoId: id }) })
        queryClient.removeQueries({ queryKey: campeonatoQueryKeys.classificacao(id) })
      })

      notifications.success(
        'Campeonatos excluídos!',
        `${campeonatoIds.length} campeonatos foram removidos`
      )
    },
    onError: (error) => {
      notifications.error(
        'Erro ao excluir campeonatos',
        error.message || 'Alguns campeonatos podem ter jogos associados'
      )
    }
  })
}


// ===========================================
// HOOKS UTILITÁRIOS EXTRAS
// ===========================================

// Recalcular classificação manualmente
export function useRecalcularClassificacao() {
  const queryClient = useQueryClient()
  const notifications = useNotifications()

  return useMutation({
    mutationFn: async (grupoId: number): Promise<any> => {
      const response = await fetch(`${API_BASE_URL}/campeonatos/classificacao/recalcular/${grupoId}`, {
        method: 'POST',
      })

      if (!response.ok) {
        throw new Error('Erro ao recalcular classificação')
      }

      return response.json()
    },
    onSuccess: (_, grupoId) => {
      queryClient.invalidateQueries({ queryKey: [...campeonatoQueryKeys.all, 'classificacao-grupo', grupoId] })
      queryClient.invalidateQueries({ queryKey: campeonatoQueryKeys.lists() })
      
      notifications.success(
        'Classificação recalculada!',
        'A tabela foi atualizada com sucesso'
      )
    },
    onError: (error) => {
      notifications.error(
        'Erro ao recalcular',
        error.message || 'Tente novamente'
      )
    }
  })
}

// Processar estatísticas de um jogo
export function useProcessarEstatisticas() {
  const queryClient = useQueryClient()
  const notifications = useNotifications()

  return useMutation({
    mutationFn: async ({ 
      jogoId, 
      estatisticas 
    }: { 
      jogoId: number; 
      estatisticas: any[] 
    }): Promise<any> => {
      const response = await fetch(`${API_BASE_URL}/campeonatos/jogos/${jogoId}/estatisticas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estatisticas }),
      })

      if (!response.ok) {
        throw new Error('Erro ao processar estatísticas')
      }

      return response.json()
    },
    onSuccess: (_, { jogoId }) => {
      queryClient.invalidateQueries({ queryKey: [...campeonatoQueryKeys.all, 'jogo', jogoId] })
      queryClient.invalidateQueries({ queryKey: campeonatoQueryKeys.jogos({}) })
      
      notifications.success(
        'Estatísticas processadas!',
        'As estatísticas do jogo foram salvas'
      )
    },
    onError: (error) => {
      notifications.error(
        'Erro ao processar estatísticas',
        error.message || 'Verifique os dados e tente novamente'
      )
    }
  })
}