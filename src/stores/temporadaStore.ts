import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Temporada = '2025' | '2026'

export const TEMPORADAS_DISPONIVEIS: Temporada[] = ['2026', '2025']

interface TemporadaState {
    temporada: Temporada
    setTemporada: (t: Temporada) => void
}

export const useTemporadaStore = create<TemporadaState>()(
    persist(
        (set) => ({
            temporada: '2026',
            setTemporada: (temporada) => set({ temporada }),
        }),
        { name: 'fabr-admin-temporada' }
    )
)