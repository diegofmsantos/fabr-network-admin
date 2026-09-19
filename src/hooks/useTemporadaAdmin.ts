import { useEffect, useState } from 'react'
import { useTemporadaStore, type Temporada, type Divisao } from '@/stores/temporadaStore'

export function useTemporadaAdmin(): {
    temporada: Temporada
    divisao: Divisao
    setTemporada: (t: Temporada) => void
    setDivisao: (d: Divisao) => void
    mounted: boolean
} {
    const temporada = useTemporadaStore((s) => s.temporada)
    const divisao = useTemporadaStore((s) => s.divisao)
    const setTemporada = useTemporadaStore((s) => s.setTemporada)
    const setDivisao = useTemporadaStore((s) => s.setDivisao)

    const [mounted, setMounted] = useState(false)
    useEffect(() => setMounted(true), [])

    return {
        temporada: mounted ? temporada : '2026',
        divisao: mounted ? divisao : 'D1',
        setTemporada,
        setDivisao,
        mounted,
    }
}