import { useEffect, useState } from 'react'
import { useTemporadaStore, type Temporada } from '@/stores/temporadaStore'

export function useTemporadaAdmin(): {
    temporada: Temporada
    setTemporada: (t: Temporada) => void
    mounted: boolean
} {
    const temporada = useTemporadaStore((s) => s.temporada)
    const setTemporada = useTemporadaStore((s) => s.setTemporada)

    const [mounted, setMounted] = useState(false)
    useEffect(() => setMounted(true), [])

    return {
        temporada: mounted ? temporada : '2026',
        setTemporada,
        mounted,
    }
}