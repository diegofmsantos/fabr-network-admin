import { BaseEntity } from './base'
import { Jogador } from './jogador'

export interface Titulo {
  nacionais?: string
  conferencias?: string
  estaduais?: string
}

export interface Time extends BaseEntity {
  nome: string
  sigla: string
  temporada: string
  cor: string
  cidade: string
  bandeira_estado: string
  fundacao: string
  logo: string
  capacete: string
  estadio: string
  presidente: string
  head_coach: string
  coord_ofen: string
  coord_defen: string
  
  // Opcionais
  instagram?: string
  instagram2?: string
  instagram_coach?: string
  
  // Relacionamentos
  titulos?: Titulo[]
  jogadores?: Jogador[]
  
  // Campos calculados (para cache/otimização)
  _count?: {
    jogadores: number
    campeonatos: number
    vitorias: number
    derrotas: number
  }
}

// Manter tipos existentes para compatibilidade
export type { Time as TimeOriginal } from '../types/time' // se precisar

// Requests/Responses específicos
export interface CreateTimeRequest extends Omit<Time, 'id' | 'createdAt' | 'updatedAt' | 'jogadores' | '_count'> {}
export interface UpdateTimeRequest extends Partial<CreateTimeRequest> {}
