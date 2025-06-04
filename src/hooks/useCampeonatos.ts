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

// ✅ CORREÇÃO: useJogos
export function useJogos(filters: FiltroJogos) {
  return useQuery({
    queryKey: campeonatoQueryKeys.jogos(filters),
    queryFn: async (): Promise<Jogo[]> => {
      const params = new URLSearchParams()
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, String(value))
        }
      })

      // ✅ URL CORRIGIDA para jogos
      const response = await fetch(`${API_BASE_URL}/campeonatos/jogos?${params.toString()}`)
      
      if (!response.ok) {
        throw new Error(`Erro ao buscar jogos: ${response.status}`)
      }
      
      return response.json()
    },
    staleTime: 1000 * 60 * 2,
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

// ===== CORREÇÃO 6: useGerarJogos =====
export function useGerarJogos() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (campeonatoId: number) => {
      // ✅ CORRIGIR ROTA DE GERAR JOGOS:
      const response = await fetch(`${API_BASE_URL}/campeonatos/${campeonatoId}/gerar-jogos`, {
        method: 'POST',
      })

      if (!response.ok) {
        throw new Error('Erro ao gerar jogos')
      }

      return response.json()
    },
    onSuccess: (_, campeonatoId) => {
      queryClient.invalidateQueries({ queryKey: campeonatoQueryKeys.detail(campeonatoId) })
      queryClient.invalidateQueries({ queryKey: campeonatoQueryKeys.jogos({}) })
    },
  })
}

// ===== CORREÇÃO 7: useUpdateCampeonato =====
// src/hooks/useUpdateCampeonato.ts
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
      // ✅ CORRIGIR ROTA DE UPDATE:
      const response = await fetch(`${API_BASE_URL}/campeonatos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw handleApiError({ response })
      }

      return response.json()
    },
    onSuccess: (data, { id }) => {
      queryClient.setQueryData(campeonatoQueryKeys.detail(id), data)
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
      const response = await fetch(`${API_BASE_URL}/campeonatos/${campeonatoId}`, {
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