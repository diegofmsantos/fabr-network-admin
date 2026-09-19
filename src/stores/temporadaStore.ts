import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Temporada = '2025' | '2026'
export type Divisao = 'D1' | 'D2'

export const TEMPORADAS_DISPONIVEIS: Temporada[] = ['2026', '2025']
export const DIVISOES_DISPONIVEIS: Divisao[] = ['D1', 'D2']

interface TemporadaState {
    temporada: Temporada
    divisao: Divisao
    setTemporada: (t: Temporada) => void
    setDivisao: (d: Divisao) => void
}

export const useTemporadaStore = create<TemporadaState>()(
    persist(
        (set) => ({
            temporada: '2026',
            divisao: 'D1',
            setTemporada: (temporada) => set({ temporada }),
            setDivisao: (divisao) => set({ divisao }),
        }),
        { name: 'fabr-admin-temporada' }
    )
)